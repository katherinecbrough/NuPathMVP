// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

import { getFunctions, httpsCallable } from "firebase/functions";

interface TestConnectionResult {
  status: "success" | "error";
  message: string;
  details?: {
    connectionTime: string;
    cluster: string;
  };
}
const firebaseConfig = {
  apiKey: "AIzaSyD-gOEE-vnL2UhlByUpB9K2Wdr7uOBUKj4",
  authDomain: "safeplace-8a941.firebaseapp.com",
  projectId: "safeplace-8a941",
  storageBucket: "safeplace-8a941.firebasestorage.app",
  messagingSenderId: "699739445576",
  appId: "1:699739445576:web:d99edabbf7aebf50797b7d",
  measurementId: "G-8W8WDLZX9X",
};
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const usersdb = collection(db, "Users");
const chatsdb = collection(db, "Chats");
export const testConnection = async () => {
  try {
    const testConnectionCallable = httpsCallable<{}, TestConnectionResult>(
      functions,
      "testConnection"
    );

    const result = await testConnectionCallable({});

    return {
      success: true,
      message: result.data.message,
      details: result.data.details,
    };
  } catch (error: any) {
    console.log("error.message", error.message);
    return {
      success: false,
      message: error.message,
      details: error.details,
    };
  }
};
// Add to your firebaseConfig.js

export const addEntry = async (collection: string, entryData: any) => {
  try {
    if (collection != "users") {
      const userId = getCurrentUserId();
      entryData.userId = userId;
    }

    const addEntryCallable = httpsCallable(functions, "addEntry");
    const result = await addEntryCallable({
      collection: collection,
      entryData: entryData,
    });
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Add entry error:", error.message);
    return { success: false, error: error.message };
  }
};
export const deleteEntry = async (collection: string, documentId: string) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const deleteEntryCallable = httpsCallable(functions, "deleteEntry");
    const result = await deleteEntryCallable({
      collection: collection,
      documentId: documentId,
      userId: userId,
    });

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Delete entry error:", error.message);
    return { success: false, error: error.message };
  }
};
export const updateDocument = async (collection: string, updateData: any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const updateDocCallable = httpsCallable(functions, "updateDocument");
    const result = await updateDocCallable({
      collection,
      updateData,
      userId: user.uid,
    });
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Update error:", error.message);
    return { success: false, error: error.message };
  }
};
export const getCurrentUserIdSafe = () => {
  return auth.currentUser?.uid || null;
};
export const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    //throw new Error("No authenticated user found");
    return false;
  }
  return user.uid;
};
export const getData = async (collection: string) => {
  try {
    const userId = getCurrentUserId();

    // Note: getData is an onRequest function, not callable, so we need to use fetch
    const functionsBaseUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net`;
    const url = `${functionsBaseUrl}/getData?collection=${encodeURIComponent(
      collection
    )}&userId=${encodeURIComponent(userId)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("Get data error:", error.message);
    return { success: false, error: error.message };
  }
};

export { app, auth, db, storage, usersdb, chatsdb };
