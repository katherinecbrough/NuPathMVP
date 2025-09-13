// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the User type
export type User = {
  userId: string;
  name: string | null;
  email: string | null;
  created: string | null; // ISO string format, e.g. "2025-02-27T12:00:00Z"
  lastLogin: string | null; // ISO string format, e.g. "2025-02-27T12:00:00Z"
  questionaire: boolean | null; // ISO string format, e.g. "2025-02-27T12:00:00Z"
  appleHealthConnected: boolean | null;
  updatedAt: string | null; // ISO string format, e.g. "2025-02-27T12:00:00Z"
  journal: boolean | null;
  therapy: boolean | null;
  quiz: boolean | null;
  activity: boolean | null;
  nickname: string | null;
};

type AuthContextType = {
  user: User | null;
  loginStorage: (user: User) => Promise<void>;
  logoutStorage: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load the stored user object when the app starts
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser && isMounted) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to log in and save the user object
  const loginStorage = async (newUser: User) => {
    setUser(newUser);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Function to log out and remove the user object
  const logoutStorage = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginStorage, logoutStorage }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
