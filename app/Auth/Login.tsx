import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { Stack } from "expo-router";
import { useAuth, User } from "../../components/AuthContext";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, usersdb, db } from "../../components/firebaseConfig";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Login() {
  const { user, loginStorage } = useAuth();
  const router = useRouter();
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const updateInputVal = (val: string, prop: keyof typeof state) => {
    setState((prevState) => ({
      ...prevState,
      [prop]: val,
    }));
  };

  const handleFocus = (field: keyof typeof isFocused) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field: keyof typeof isFocused) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const LoginKat = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        "katherine@kcbsoftware.com",
        "June292010!"
      );

      const user = userCredentials.user;
      const newUser = {
        id: "ntBDjur0Q1a2fYYI71PHSSUyqLn2",
        name: "KAtherine Brough",
        email: "katherine@kcbsoftware.com",
        startDate: "",
      };

      loginStorage(newUser);
      const date = new Date();
      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, { lastLogin: date });
      router.push("/(tabs)/Dashboard");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const Login = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        state.email,
        state.password
      );
      const user = userCredentials.user;

      const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        startDate: "",
      };
      loginStorage(newUser);

      const date = new Date();
      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, { lastLogin: date });
      router.push("/(tabs)/Dashboard");
    } catch (err) {
      if (typeof err === "object" && err !== null && "code" in err) {
        const firebaseError = err as { code: string; message: string };
        switch (firebaseError.code) {
          case "auth/invalid-credential":
            alert("Invalid credentials. Please check your email and password.");
            break;
          case "auth/user-not-found":
            alert("No user found with this email.");
            break;
          case "auth/wrong-password":
            alert("Incorrect password.");
            break;
          default:
            alert(firebaseError.message);
        }
      } else {
        alert("An unknown error occurred");
      }
    }
  };
  const handleRegisterNavigation = () => {
    router.push("/Auth/Register"); // Update this path to match your registration screen route
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <Stack.Screen options={{ headerTitle: "", headerShown: true }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ThemedText style={styles.title} type="title">
              Welcome Back
            </ThemedText>
            <ThemedText style={styles.subtitle} type="subtitle">
              Sign in to continue
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, isFocused.email && styles.inputFocused]}
              placeholder="Email"
              placeholderTextColor={Colors.PlaceHolderGrey}
              value={state.email}
              onChangeText={(val) => updateInputVal(val, "email")}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.input, isFocused.password && styles.inputFocused]}
              placeholder="Password"
              placeholderTextColor={Colors.PlaceHolderGrey}
              value={state.password}
              onChangeText={(val) => updateInputVal(val, "password")}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={Login}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={LoginKat}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Login as Katherine</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegisterNavigation}>
                <Text style={styles.registerLink}>Register here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.OffWhite,
  },
  container: {
    flex: 1,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    color: Colors.Grey,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
  registerLink: {
    color: Colors.MainGreen,
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.MainGreen,
    marginBottom: 8,
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.Grey,
    fontFamily: "PoppinsRegular",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "lightGrey",
    backgroundColor: "white",
    fontFamily: "PoppinsRegular",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: Colors.MainGreen,
    borderWidth: 2,
  },
  primaryButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.MainGreen,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  secondaryButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.MainGreen,
  },
  secondaryButtonText: {
    color: Colors.MainGreen,
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
});
