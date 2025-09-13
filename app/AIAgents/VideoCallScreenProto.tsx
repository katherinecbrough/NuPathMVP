import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";

const therapistVideos = [
  require("../../assets/videos/mia_intro.mp4"),
  require("../../assets/videos/mia_anxiety.mp4"),
];

const VideoCallScreenProto: React.FC = () => {
  useKeepAwake();
  const videoRef = useRef<Video>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Simple autoplay implementation
  useEffect(() => {
    const playVideo = async () => {
      try {
        await videoRef.current?.loadAsync(therapistVideos[currentVideoIndex]);
        await videoRef.current?.playAsync();
      } catch (error) {
        console.log("Playback error:", error);
      }
    };

    playVideo();
  }, [currentVideoIndex]);

  const handleRecordPress = async () => {
    if (isRecording) {
      // Stop recording - move to next video
      const nextIndex = (currentVideoIndex + 1) % therapistVideos.length;
      setCurrentVideoIndex(nextIndex);
    }
    setIsRecording(!isRecording);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={therapistVideos[currentVideoIndex]}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay={true}
        isMuted={false}
      />

      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordingButton]}
        onPress={handleRecordPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  recordButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 59, 48, 0.7)",
  },
  recordingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
export default VideoCallScreenProto;
