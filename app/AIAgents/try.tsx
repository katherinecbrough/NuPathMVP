import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { getAIResponse } from "../../components/openaiservice";
import * as FileSystem from "expo-file-system";
import { useAuth, User } from "../../components/AuthContext";

const GOOGLE_CLOUD_API_KEY = "AIzaSyAbteeaN5GJtB8wVH1jv4xtby0qz0lwxog"; // Replace with your Google Cloud key

export default function VoiceBot() {
  const { user, loginStorage } = useAuth();
  const [text, setText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] =
    useState<Audio.Recording | null>(null);
  console.log("id");
  console.log(user?.id);

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
          outputFormat: 2, // MPEG_4
          audioEncoder: 3, // AAC
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          audioQuality: 2, // high quality
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      };

      await recording.prepareToRecordAsync(recordingSettings);
      await recording.startAsync();

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
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();

      // Reset state
      setRecordingInstance(null);
      setIsRecording(false);
      console.log("uri");
      console.log(uri);

      if (uri) {
        // Upload the recording for conversion
        await uploadAudioForConversion(uri);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsRecording(false);
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
      const response = await fetch("http://your-server-url.com/convert", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json();
      if (data?.convertedFileUrl) {
        console.log("Converted WAV file:", data.convertedFileUrl);

        // Handle AI response and playback (optional)
        handleAIResponse(data.convertedFileUrl);
      } else {
        console.log("Error: Conversion failed");
      }
    } catch (error) {
      console.error("Error uploading audio for conversion:", error);
    }
  };

  // 5. Send user message to AI, set response, and speak
  const handleAIResponse = async (userMessage: string): Promise<void> => {
    const response = await getAIResponse(user?.id, userMessage);
    setAiResponse(response || "");
    Speech.speak(response || "");
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Start Recording"
        onPress={startRecording}
        disabled={isRecording}
      />
      <Button
        title="Stop Recording"
        onPress={stopRecording}
        disabled={!isRecording}
      />
      <Text>User: {text}</Text>
      <Text>AI: {aiResponse}</Text>
    </View>
  );
}
