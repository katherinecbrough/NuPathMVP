import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Video, Audio } from "expo-av";
import RNFS from "react-native-fs";
import {
  getAIResponse,
  playAudioResponse,
  transcribeAudio,
} from "../../components/openaiservice";

const LiveAvatarStreamer = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [buttonText, setButtonText] = useState("Start Recording");
  const videoRef = useRef<Video | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<string[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [audioChunks, setAudioChunks] = useState<string[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const isMountedRef = useRef(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cleanup all refs and recordings
  // got error for hooks so i commented this out
  // useEffect(() => {
  //   return () => {
  //     if (recording) {
  //       recording.stopAndUnloadAsync();
  //     }
  //     if (recordingTimeoutRef.current) {
  //       clearTimeout(recordingTimeoutRef.current);
  //     }
  //     if (processingIntervalRef.current) {
  //       clearInterval(processingIntervalRef.current);
  //     }
  //   };
  // }, [recording]);
  // useEffect(() => {
  //   console.log("Current chunks:", audioChunks.length);
  // }, [audioChunks]);
  // useEffect(() => {
  //   isMountedRef.current = true;

  //   // Process chunks whenever they accumulat
  //   const processInterval = setInterval(() => {
  //     if (isMountedRef.current && audioChunks.length > 0) {
  //       processAudioChunk();
  //     }
  //   }, 3000); // Processevery 3 seconds or when chunks exist

  //   return () => {
  //     isMountedRef.current = false;
  //     clearInterval(processInterval);
  //   };
  // }, [audioChunks]);
  const processAudioChunk = async () => {
    console.log("in process audio chunk beginnig ");
    if (audioChunks.length === 0 || isProcessing) return;
    console.log("in process audio chunk");

    setIsProcessing(true);
    try {
      const chunksToProcess = [...audioChunks];
      setAudioChunks([]);
      console.log("Processing", chunksToProcess.length, "audio chunks");

      if (chunksToProcess.length > 0) {
        const combinedBase64 = chunksToProcess.join("");
        const transcription = await transcribeAudio(combinedBase64);
        const response = await getAIResponse("user-id", transcription);
        setAiResponse(response);
        await playAudioResponse(response);
      }
    } catch (error) {
      console.error("Error processing audio chunk:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 32000,
        },
        ios: {
          extension: ".wav",
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.MAX,
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
      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );

      console.log("Recording started");
      setRecording(newRecording);
      recordingRef.current = newRecording; // Update the ref
      setButtonText("Stop Recording");
      // audioChunksRef.current = [];
      setAudioChunks([]);

      // Process audio every 3 seconds
      // processingIntervalRef.current = setInterval(processAudioChunk, 3000)
      recordingIntervalRef.current = setInterval(async () => {
        console.log("in rec mounted: " + isMountedRef.current);
        console.log("in rec: " + recording);
        if (!isMountedRef.current || !recordingRef.current) {
          console.log("Skipping - not mounted or no recording");
          return;
        }

        try {
          const uri = recordingRef.current.getURI();
          if (uri) {
            const base64Audio = await RNFS.readFile(uri, "base64");
            console.log("Audio chunk size:", base64Audio.length);
            setAudioChunks((prev) => [...prev, base64Audio]);
          }
        } catch (error) {
          console.error("Error capturing audio chunk:", error);
        }
      }, 1000);

      // Set timeout (5 minutes max recording time)
      recordingTimeoutRef.current = setTimeout(() => {
        if (newRecording) {
          console.warn("Maximum recording time reached");
          stopRecording();
        }
      }, 5 * 60 * 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log("Stopping recording...");
      // Clean up interval
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      // Clear any pending timeout
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // Now properly scoped

      setRecording(null);
      setButtonText("Start Recording");

      if (!uri) {
        console.error("No audio URI found");
        return;
      }

      console.log("Recording saved at:", uri);
      console.log(audioChunks.length);
      // Process any remaining audio chunks
      // if (audioChunksRef.current.length > 0) {
      //   await processAudioChunk();
      // }
      if (audioChunks.length > 0) {
        await processAudioChunk();
      }

      //need this down
      // const base64Audio = await RNFS.readFile(uri, "base64");
      // const response = await fetch("YOUR_GPU_SERVER_URL/process_audio", {
      //   method: "POST",
      //   headers: { "Content-Type": "audio/wav" },
      //   body: base64Audio,
      // });

      // const videoStreamUrl = await response.text();
      // setVideoUrl(videoStreamUrl);
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
        <Text>{buttonText}</Text>
      </TouchableOpacity>

      {recording && (
        <Text style={{ color: "red", marginTop: 10 }}>● RECORDING</Text>
      )}
      {aiResponse && <Text style={{ marginTop: 10 }}>AI: {aiResponse}</Text>}

      {videoUrl && (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          shouldPlay
          useNativeControls
          style={{ width: 300, height: 300, marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default LiveAvatarStreamer;
