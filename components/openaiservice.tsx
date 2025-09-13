import OpenAI from "openai";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { app, db, chatsdb } from "./firebaseConfig";
import { Audio } from "expo-av";

const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true, // Required for React Native
});

// Function to save messages in Firestore
const saveMessages = async (userId: string, messages: any[]) => {
  try {
    setDoc(doc(chatsdb, userId), {
      messages,
    });
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};

// Function to load messages from Firestore
const loadMessages = async (userId: string) => {
  try {
    const docRef = await getDoc(doc(chatsdb, userId));
    return docRef.exists() ? docRef.data()?.messages || [] : [];
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};
export const transcribeAudio = async (base64Audio: string) => {
  const response = await openai.audio.transcriptions.create({
    file: new File([base64Audio], "audio.wav"),
    model: "whisper-1",
  });
  return response.text;
};
export const playAudioResponse = async (text: string) => {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  // Play the audio using expo-av
  const sound = new Audio.Sound();
  await sound.loadAsync({ uri: response.url });
  await sound.playAsync();
};

export const getAIResponse = async (
  userId: string | undefined,
  userMessage: string
): Promise<string> => {
  try {
    if (!userId) {
      console.error("User ID is null");
      return "Please login to continue."; // Default response
    }
    if (userId == "journal") {
      // Create a special system prompt for journaling
      // Create a properly typed system message
      const journalSystemMessage: OpenAI.ChatCompletionSystemMessageParam = {
        role: "system",
        content: `Generate exactly 5 thoughtful journaling questions to help someone process their emotions. 
      The user said: "${userMessage}". 
      Create questions that:
      1. Help explore the root of the feeling
      2. Encourage self-compassion
      3. Consider healthy coping strategies
      4. Find meaning or lessons
      5. Move toward resolution
      Return ONLY the questions, numbered 1-5, with no additional text or commentary.`,
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [journalSystemMessage],
        temperature: 0.7, // Slightly creative but focused
      });

      return (
        response.choices[0]?.message?.content ||
        "1. What are you feeling right now?\n2. Where do you feel this in your body?\n3. What thoughts are accompanying this feeling?\n4. What would help you feel even slightly better?\n5. What's one small step you could take toward feeling at peace?"
      );
    } else {
      let messages = await loadMessages(userId);
      if (messages.length === 0) {
        messages.push({
          role: "system",
          content:
            "You are a licensed therapist. Respond in a warm, compassionate, and trauma-informed way. Ask thoughtful questions to help the user explore their emotions and gain self-awareness. Use language similar to a real therapist in a session. Avoid giving generic advice. Offer a spiritual approach as well",
        });
      }
      messages.push({ role: "user", content: userMessage });
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages, // Send full chat history
      });

      const aiMessage =
        response.choices[0]?.message?.content || "I didn't understand that";
      // Add AI response to chat history
      messages.push({ role: "assistant", content: aiMessage });

      // Save updated messages
      await saveMessages(userId, messages);

      return aiMessage;
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, I'm having trouble responding right now.";
  }
};
