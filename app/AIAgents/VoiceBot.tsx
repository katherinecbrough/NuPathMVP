import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Text,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { getAIResponse } from "../../components/openaiservice";
import * as FileSystem from "expo-file-system";
import { useAuth } from "../../components/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const GOOGLE_CLOUD_API_KEY = "AIzaSyAbteeaN5GJtB8wVH1jv4xtby0qz0lwxog";

export default function VoiceBot() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingInstance, setRecordingInstance] =
    useState<Audio.Recording | null>(null);
  const [isEntrancePlaying, setIsEntrancePlaying] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Effect for entrance audio
  useEffect(() => {
    let sound: Audio.Sound | null = null;
    let timeoutId: NodeJS.Timeout;

    // Play entrance audio
    const playEntranceAudio = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../../assets/audio/VoiceBotEntrace.mp3")
        );
        console.log("playing sound");
        sound = newSound;
        await sound.playAsync();

        console.log(isListening);
        // Wait for 8 seconds (audio duration) before changing states
        timeoutId = setTimeout(() => {
          console.log("playing");
          setIsEntrancePlaying(false);
          setIsListening(true);
        }, 6000);
      } catch (error) {
        console.error("Error playing entrance audio:", error);
        setIsEntrancePlaying(false);
      }
    };

    playEntranceAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Only run once for audio

  // Effect for pulsing animation
  useEffect(() => {
    if (isListening && !isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1); // Reset animation when not listening
    }
  }, [isListening, isRecording]); // Run when listening or recording state changes

  // 1. Ask for microphone permission
  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Microphone Permission Required",
        "We need access to your microphone to record audio."
      );
      return false;
    }
    return true;
  };

  // 2. Start recording when user taps "Start Recording"
  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      const recordingSettings: Audio.RecordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 32000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 32000,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      };

      await recording.prepareToRecordAsync(recordingSettings);
      await recording.startAsync();

      // Animate button scale
      Animated.spring(buttonScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();

      setRecordingInstance(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  // 3. Stop recording when user taps "Stop Recording"
  const stopRecording = async () => {
    if (!recordingInstance) return;

    try {
      setIsProcessing(true);
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();

      // Reset button scale
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      setRecordingInstance(null);
      setIsRecording(false);

      if (uri) {
        const transcript = await transcribeAudio(uri);
        if (transcript) {
          setText(transcript);
          await handleAIResponse(transcript);
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsRecording(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Upload M4A file to the backend for conversion to WAV
  const uploadAudioForConversion = async (uri: string) => {
    const formData = new FormData();

    // Append the audio file directly
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      // Ensure the audio file is correctly typed when appending
      formData.append("audio", {
        uri,
        type: "audio/m4a", // Correct MIME type for m4a
        name: "audio.m4a", // Set a name for the file
      } as any); // We cast it as 'any' because FormData is not strongly typed in React Native
    }

    try {
      const response = await fetch("http://192.168.101.100:5000/convert", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("we fetched!");
      // 1. Get the response as a Blob (binary WAV data)
      const wavBlob = await response.blob();

      // 2. Convert Blob to base64 for Google Speech-to-Text
      const reader = new FileReader();
      reader.readAsDataURL(wavBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        // Strip the DataURL prefix (e.g., "data:audio/wav;base64,")
        const audioBase64 = base64Data.split(",")[1];
        // 4. Send to Google Speech-to-Text API
        try {
          const text = await transcribeAudio(audioBase64);
          if (text) {
            // 5. Send transcribed text to AI
            handleAIResponse(text);
          }
        } catch (error) {
          console.error("Google Speech-to-Text error:", error);
        }
        // handleAIResponse(audioBase64);
      };
    } catch (error) {
      console.error("Error uploading audio for conversion:", error);
    }
  };
  const transcribeAudio = async (audioUri: string): Promise<string> => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config: {
              encoding: "MP3",
              sampleRateHertz: 16000,
              languageCode: "en-US",
              audioChannelCount: 1,
            },
            audio: { content: base64Data },
          }),
        }
      );

      const data = await response.json();
      return data.results?.[0]?.alternatives?.[0]?.transcript || "";
    } catch (error) {
      console.error("Transcription error:", error);
      return "";
    }
  };

  // 5. Send user message to AI, set response, and speak
  const handleAIResponse = async (userMessage: string): Promise<void> => {
    console.log(userMessage);
    const response = await getAIResponse(user?.id, userMessage);
    setAiResponse(response || "");
    Speech.speak(response || "", {
      voice: "com.apple.ttsbundle.Samantha-compact",
      pitch: 1.1,
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={Colors.Primary} />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Animated.View
                style={[
                  styles.pulseContainer,
                  {
                    transform: [
                      {
                        scale:
                          !isEntrancePlaying && isListening && !isRecording
                            ? pulseAnim
                            : 1,
                      },
                      { scale: buttonScale },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    isRecording && styles.recordingButton,
                  ]}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  {!isEntrancePlaying && isListening && !isRecording ? (
                    <Text style={styles.listeningText}>Listening...</Text>
                  ) : (
                    <MaterialIcons
                      name={isRecording ? "stop" : "mic"}
                      size={50}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseContainer: {
    position: "relative",
  },
  recordButton: {
    backgroundColor: Colors.Primary,
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: "#ff4444",
  },
  listeningText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
