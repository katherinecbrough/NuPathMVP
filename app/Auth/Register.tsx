import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useAuth, User } from "../../components/AuthContext";
import { useRouter } from "expo-router";
import React, { Component } from "react";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, usersdb } from "../../components/firebaseConfig";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Stack } from "expo-router";
import { addEntry } from "../../components/firebaseConfig";
type State = {
  Name: string;
  email: string;
  password: string;
  ReenteredPassword: string;
  terms: boolean;
  isLoading: boolean;
  taken: boolean;
  isFocused: {
    Name: boolean;
    email: boolean;
    password: boolean;
    ReenteredPassword: boolean;
  };
};

class Register extends Component<
  {
    router: any;
    user: User | null;
    loginStorage: (user: User) => Promise<void>;
  },
  State
> {
  constructor(props: {
    router: any;
    user: User | null;
    loginStorage: (user: User) => Promise<void>;
  }) {
    super(props);
    this.state = {
      Name: "",
      email: "",
      password: "",
      ReenteredPassword: "",
      terms: false,
      isLoading: false,
      taken: false,
      isFocused: {
        Name: false,
        email: false,
        password: false,
        ReenteredPassword: false,
      },
    };
  }

  updateInputVal = (val: string | boolean, prop: keyof State) => {
    this.setState((prevState) => ({
      ...prevState,
      [prop]: val,
    }));
  };

  handleFocus = (field: keyof State["isFocused"]) => {
    this.setState((prevState) => ({
      isFocused: {
        ...prevState.isFocused,
        [field]: true,
      },
    }));
  };

  handleBlur = (field: keyof State["isFocused"]) => {
    this.setState((prevState) => ({
      isFocused: {
        ...prevState.isFocused,
        [field]: false,
      },
    }));
  };

  registerUser = () => {
    if (this.state.password.length < 6) {
      alert("Please enter a Password with at least 6 characters");
      return;
    }
    if (this.state.password !== this.state.ReenteredPassword) {
      alert("Passwords don't match, please reenter");
      return;
    }
    if (this.state.Name === "" || this.state.email === "") {
      alert("Please enter all information into all fields");
      return;
    }

    this.setState({ isLoading: true });

    createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then((res) => {
        const date = new Date();
        updateProfile(res.user, {
          displayName: this.state.Name,
        });

        return setDoc(doc(usersdb, res.user.uid), {
          email: this.state.email,
          startDate: date,
          name: this.state.Name,
          lastLogin: date,
        }).then(() => {
          const newUser = {
            userId: res.user.uid,
            name: this.state.Name,
            email: this.state.email,
            lastLogin: date.toISOString(),
            questionaire: false,
            appleHealthConnected: false,
            created: date.toISOString(),
            updatedAt: date.toISOString(),
            journal: false,
            therapy: false,
            quiz: false,
            activity: false,
          };
          this.props.loginStorage(newUser);
          addEntry("users", newUser);
          this.props.router.push("/Questionaires/IntakeQuestionnaire");
        });
      })
      .catch((error) => {
        alert(
          "Invalid email or password. Make sure your password contains letters. " +
            error.message
        );
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color={Colors.MainGreen} />
        </View>
      );
    }

    return (
      <SafeAreaProvider style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: "Register",
            headerBackTitle: "Back",
          }}
        />
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
                Create Account
              </ThemedText>
              <ThemedText style={styles.subtitle} type="subtitle">
                Join us to get started
              </ThemedText>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={[
                  styles.input,
                  this.state.isFocused.Name && styles.inputFocused,
                ]}
                placeholder="Full Name"
                placeholderTextColor={Colors.PlaceHolderGrey}
                value={this.state.Name}
                onChangeText={(val) => this.updateInputVal(val, "Name")}
                onFocus={() => this.handleFocus("Name")}
                onBlur={() => this.handleBlur("Name")}
              />

              <TextInput
                style={[
                  styles.input,
                  this.state.isFocused.email && styles.inputFocused,
                ]}
                placeholder="Email"
                placeholderTextColor={Colors.PlaceHolderGrey}
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, "email")}
                onFocus={() => this.handleFocus("email")}
                onBlur={() => this.handleBlur("email")}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={[
                  styles.input,
                  this.state.isFocused.password && styles.inputFocused,
                ]}
                placeholder="Password"
                placeholderTextColor={Colors.PlaceHolderGrey}
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, "password")}
                onFocus={() => this.handleFocus("password")}
                onBlur={() => this.handleBlur("password")}
                secureTextEntry
              />

              <TextInput
                style={[
                  styles.input,
                  this.state.isFocused.ReenteredPassword && styles.inputFocused,
                ]}
                placeholder="Re-enter Password"
                placeholderTextColor={Colors.PlaceHolderGrey}
                value={this.state.ReenteredPassword}
                onChangeText={(val) =>
                  this.updateInputVal(val, "ReenteredPassword")
                }
                onFocus={() => this.handleFocus("ReenteredPassword")}
                onBlur={() => this.handleBlur("ReenteredPassword")}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.primaryButton}
                // onPress={this.registerUser}
                onPress={() =>
                  this.props.router.push("/Questionaires/IntakeQuestionnaire")
                }
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  this.props.router.push("/Questionaires/IntakeQuestionnaire")
                }
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  Skip Registration
                </Text>
              </TouchableOpacity> */}

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => this.props.router.push("/Auth/Login")}
                >
                  <Text style={styles.loginLink}>Login here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.OffWhite,
  },
  container: {
    flex: 1,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center",
  },
  loginText: {
    color: Colors.Grey,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
  loginLink: {
    color: Colors.MainGreen,
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});

export default function RegisterWrapper() {
  const { user, loginStorage } = useAuth();
  const router = useRouter();
  return <Register router={router} user={user} loginStorage={loginStorage} />;
}
