import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

type TherapyApproach =
  | "CBT"
  | "DBT"
  | "Psychodynamic"
  | "Humanistic"
  | "Solution-Focused";
type TherapistDemeanor =
  | "Gentle"
  | "Direct"
  | "Supportive"
  | "Challenging"
  | "Spiritual"
  | "Friend-like";
type CommunicationStyle =
  | "Formal"
  | "Casual"
  | "Professional"
  | "Conversational";
type VoiceOption = {
  id: string;
  name: string;
  gender: string;
  language: string;
};
type AppearanceOption = {
  id: string;
  name: string;
  image: string;
  description: string;
};

const Account = () => {
  // User data state
  const [user, setUser] = useState({
    email: "user@example.com",
    password: "********",
    nickname: "WellnessSeeker",
    theme: "light",
    therapistSettings: {
      approaches: ["CBT"] as TherapyApproach[],
      demeanor: "Gentle" as TherapistDemeanor,
      communicationStyle: "Professional" as CommunicationStyle,
      sessionPacing: 3,
      homework: true,
      mindfulness: true,
      humor: false,
      metaphors: true,
      specializations: ["Anxiety", "Stress"],
      voice: {
        id: "1",
        name: "Warm Female",
        gender: "female",
        language: "English",
      },
      appearance: {
        id: "1",
        name: "Dr. Sarah",
        image:
          "https://res.cloudinary.com/kcb-software-design/image/upload/v1742779693/aria_kze9q3.png",
        description: "Cognitive Behavioral Therapy specialist",
      },
    },
  });

  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeTherapistTab, setActiveTherapistTab] = useState<
    "approach" | "demeanor" | "communication" | "voice" | "appearance"
  >("approach");

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Available options
  const therapyApproaches: TherapyApproach[] = [
    "CBT",
    "DBT",
    "Psychodynamic",
    "Humanistic",
    "Solution-Focused",
  ];
  const demeanors: TherapistDemeanor[] = [
    "Gentle",
    "Direct",
    "Supportive",
    "Challenging",
    "Spiritual",
    "Friend-like",
  ];
  const communicationStyles: CommunicationStyle[] = [
    "Formal",
    "Casual",
    "Professional",
    "Conversational",
  ];
  const voiceOptions: VoiceOption[] = [
    { id: "1", name: "Warm Female", gender: "female", language: "English" },
    { id: "2", name: "Calm Male", gender: "male", language: "English" },
    { id: "3", name: "Neutral Voice", gender: "neutral", language: "English" },
  ];
  const appearanceOptions: AppearanceOption[] = [
    {
      id: "1",
      name: "Dr. Sarah",
      image:
        "https://res.cloudinary.com/kcb-software-design/image/upload/v1742779693/aria_kze9q3.png",
      description: "Cognitive Behavioral Therapy specialist",
    },
    {
      id: "2",
      name: "Dr. James",
      image:
        "https://res.cloudinary.com/kcb-software-design/image/upload/v1744755008/ChatGPT_Image_Apr_15_2025_05_09_49_PM_guipqs.png",
      description: "Mindfulness and meditation expert",
    },
    {
      id: "3",
      name: "Dr. Maya",
      image:
        "https://res.cloudinary.com/kcb-software-design/image/upload/v1743539116/portrait-of-smiling-brunette-young-woman-2024-09-23-01-08-15-utc_a0kuh2.jpg",
      description: "Trauma-informed care specialist",
    },
  ];

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleUpdate = () => {
    switch (activeModal) {
      case "email":
        setUser({ ...user, email: inputValue });
        break;
      case "nickname":
        setUser({ ...user, nickname: inputValue });
        break;
      case "password":
        if (newPassword === confirmPassword) {
          console.log("Password changed");
        }
        break;
      default:
        break;
    }
    setModalVisible(false);
    setInputValue("");
  };

  const openModal = (type: string, currentValue = "") => {
    setActiveModal(type);
    setInputValue(currentValue);
    setModalVisible(true);
  };

  const toggleApproach = (approach: TherapyApproach) => {
    const currentApproaches = [...user.therapistSettings.approaches];
    if (currentApproaches.includes(approach)) {
      setUser({
        ...user,
        therapistSettings: {
          ...user.therapistSettings,
          approaches: currentApproaches.filter((a) => a !== approach),
        },
      });
    } else {
      setUser({
        ...user,
        therapistSettings: {
          ...user.therapistSettings,
          approaches: [...currentApproaches, approach],
        },
      });
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "email":
        return (
          <>
            <Text style={styles.modalTitle}>Change Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="New email"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        );
      case "nickname":
        return (
          <>
            <Text style={styles.modalTitle}>Change Nickname</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="New nickname"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </>
        );
      case "password":
        return (
          <>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </>
        );
      case "therapist-settings":
        return (
          <View style={styles.therapistModalContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.therapistTabContainer}
              style={styles.therapistTabScrollView}
            >
              <TouchableOpacity
                style={[
                  styles.therapistTabButton,
                  activeTherapistTab === "approach" &&
                    styles.activeTherapistTab,
                ]}
                onPress={() => setActiveTherapistTab("approach")}
              >
                <Text style={styles.therapistTabText}>Approach</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.therapistTabButton,
                  activeTherapistTab === "demeanor" &&
                    styles.activeTherapistTab,
                ]}
                onPress={() => setActiveTherapistTab("demeanor")}
              >
                <Text style={styles.therapistTabText}>Demeanor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.therapistTabButton,
                  activeTherapistTab === "communication" &&
                    styles.activeTherapistTab,
                ]}
                onPress={() => setActiveTherapistTab("communication")}
              >
                <Text style={styles.therapistTabText}>Communication</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.therapistTabButton,
                  activeTherapistTab === "voice" && styles.activeTherapistTab,
                ]}
                onPress={() => setActiveTherapistTab("voice")}
              >
                <Text style={styles.therapistTabText}>Voice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.therapistTabButton,
                  activeTherapistTab === "appearance" &&
                    styles.activeTherapistTab,
                ]}
                onPress={() => setActiveTherapistTab("appearance")}
              >
                <Text style={styles.therapistTabText}>Appearance</Text>
              </TouchableOpacity>
            </ScrollView>

            <ScrollView style={styles.therapistOptionsContainer}>
              {activeTherapistTab === "approach" && (
                <>
                  <Text style={styles.therapistOptionTitle}>
                    Therapy Approaches
                  </Text>
                  <Text style={styles.therapistOptionSubtitle}>
                    Select which therapeutic techniques you prefer
                  </Text>
                  <View style={styles.therapistOptionsGrid}>
                    {therapyApproaches.map((approach) => (
                      <TouchableOpacity
                        key={approach}
                        style={[
                          styles.therapistOptionButton,
                          user.therapistSettings.approaches.includes(
                            approach
                          ) && styles.selectedTherapistOption,
                        ]}
                        onPress={() => toggleApproach(approach)}
                      >
                        <Text style={styles.therapistOptionText}>
                          {approach}
                        </Text>
                        {user.therapistSettings.approaches.includes(
                          approach
                        ) && (
                          <MaterialIcons
                            name="check"
                            size={20}
                            color={Colors.Primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {activeTherapistTab === "demeanor" && (
                <>
                  <Text style={styles.therapistOptionTitle}>
                    Therapist Demeanor
                  </Text>
                  <Text style={styles.therapistOptionSubtitle}>
                    Choose how your therapist interacts with you
                  </Text>
                  <View style={styles.therapistOptionsGrid}>
                    {demeanors.map((demeanor) => (
                      <TouchableOpacity
                        key={demeanor}
                        style={[
                          styles.therapistOptionButton,
                          user.therapistSettings.demeanor === demeanor &&
                            styles.selectedTherapistOption,
                        ]}
                        onPress={() =>
                          setUser({
                            ...user,
                            therapistSettings: {
                              ...user.therapistSettings,
                              demeanor,
                            },
                          })
                        }
                      >
                        <Text style={styles.therapistOptionText}>
                          {demeanor}
                        </Text>
                        {user.therapistSettings.demeanor === demeanor && (
                          <MaterialIcons
                            name="check"
                            size={20}
                            color={Colors.Primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {activeTherapistTab === "communication" && (
                <>
                  <Text style={styles.therapistOptionTitle}>
                    Communication Style
                  </Text>
                  <View style={styles.therapistOptionsGrid}>
                    {communicationStyles.map((style) => (
                      <TouchableOpacity
                        key={style}
                        style={[
                          styles.therapistOptionButton,
                          user.therapistSettings.communicationStyle === style &&
                            styles.selectedTherapistOption,
                        ]}
                        onPress={() =>
                          setUser({
                            ...user,
                            therapistSettings: {
                              ...user.therapistSettings,
                              communicationStyle: style,
                            },
                          })
                        }
                      >
                        <Text style={styles.therapistOptionText}>{style}</Text>
                        {user.therapistSettings.communicationStyle ===
                          style && (
                          <MaterialIcons
                            name="check"
                            size={20}
                            color={Colors.Primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {activeTherapistTab === "voice" && (
                <>
                  <Text style={styles.therapistOptionTitle}>
                    Voice Preference
                  </Text>
                  <View style={styles.voiceOptionsContainer}>
                    {voiceOptions.map((voice) => (
                      <TouchableOpacity
                        key={voice.id}
                        style={[
                          styles.voiceOption,
                          user.therapistSettings.voice.id === voice.id &&
                            styles.selectedVoiceOption,
                        ]}
                        onPress={() =>
                          setUser({
                            ...user,
                            therapistSettings: {
                              ...user.therapistSettings,
                              voice,
                            },
                          })
                        }
                      >
                        <Text style={styles.voiceOptionText}>
                          {voice.name} ({voice.gender}, {voice.language})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {activeTherapistTab === "appearance" && (
                <>
                  <Text style={styles.therapistOptionTitle}>
                    Therapist Appearance
                  </Text>
                  <View style={styles.appearanceOptionsContainer}>
                    {appearanceOptions.map((appearance) => (
                      <TouchableOpacity
                        key={appearance.id}
                        style={[
                          styles.appearanceOption,
                          user.therapistSettings.appearance.id ===
                            appearance.id && styles.selectedAppearanceOption,
                        ]}
                        onPress={() =>
                          setUser({
                            ...user,
                            therapistSettings: {
                              ...user.therapistSettings,
                              appearance,
                            },
                          })
                        }
                      >
                        <Image
                          source={{ uri: appearance.image }}
                          style={styles.appearanceImage}
                        />
                        <Text style={styles.appearanceName}>
                          {appearance.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        );
      case "privacy":
        return (
          <>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <ScrollView style={styles.termsScroll}>
              <Text style={styles.termsText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor. Suspendisse dictum feugiat
                nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id
                metus massa, ut blandit odio.
                {"\n\n"}
                Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi
                congue nunc, vitae euismod ligula urna in dolor. Mauris
                sollicitudin fermentum libero. Praesent non lorem sit amet nisl
                tempus convallis quis ac lectus. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
              </Text>
            </ScrollView>
          </>
        );
      case "terms":
        return (
          <>
            <Text style={styles.modalTitle}>Terms & Conditions</Text>
            <ScrollView style={styles.termsScroll}>
              <Text style={styles.termsText}>
                {" "}
                Welcome to our wellness app. If you continue to browse and use
                this app, you are agreeing to comply with and be bound by the
                following terms and conditions of use.
                {"\n\n"}
                1. The content of this app is for your general information and
                use only. It is subject to change without notice.
                {"\n\n"}
                2. Neither we nor any third parties provide any warranty or
                guarantee as to the accuracy, timeliness, performance,
                completeness or suitability of the information and materials
                found or offered on this app for any particular purpose.
                {"\n\n"}
                3. Your use of any information or materials on this app is
                entirely at your own risk, for which we shall not be liable.
              </Text>
            </ScrollView>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, darkMode && styles.darkContainer]}
      >
        <ScrollView>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://t4.ftcdn.net/jpg/05/95/35/97/360_F_595359724_Ol81T1Nx5hjmQ4USeY30rui8DnyyllDI.jpg",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatar}>
                <Feather name="edit-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.nickname, darkMode && styles.darkText]}>
              {user.nickname}
            </Text>
            <Text style={[styles.email, darkMode && styles.darkSubtext]}>
              {user.email}
            </Text>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
              Account Settings
            </Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => openModal("nickname", user.nickname)}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="person-outline"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Nickname
                </Text>
              </View>
              <View style={styles.optionRight}>
                <Text
                  style={[styles.optionValue, darkMode && styles.darkSubtext]}
                >
                  {user.nickname}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => openModal("email", user.email)}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="email"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Email
                </Text>
              </View>
              <View style={styles.optionRight}>
                <Text
                  style={[styles.optionValue, darkMode && styles.darkSubtext]}
                >
                  {user.email}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => openModal("password")}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="lock-outline"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Password
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={darkMode ? "#ddd" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {/* App Preferences */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
              App Preferences
            </Text>

            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons
                  name={darkMode ? "moon" : "moon-outline"}
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                thumbColor={darkMode ? "#6200ee" : "#f5f5f5"}
                trackColor={{ false: "#767577", true: "#b39ddb" }}
              />
            </View>

            <TouchableOpacity
              style={styles.option}
              onPress={() => openModal("therapist-settings")}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="psychology"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Therapist Preferences
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={darkMode ? "#ddd" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
              Legal
            </Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => openModal("privacy")}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="privacy-tip"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Privacy Policy
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={darkMode ? "#ddd" : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => openModal("terms")}
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="description"
                  size={24}
                  color={darkMode ? "#ddd" : "#666"}
                />
                <Text style={[styles.optionText, darkMode && styles.darkText]}>
                  Terms & Conditions
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={darkMode ? "#ddd" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal for all settings */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalContainer, darkMode && styles.darkContainer]}
          >
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={darkMode ? "white" : "black"}
                />
              </Pressable>
              <Text style={[styles.modalTitle, darkMode && styles.darkText]}>
                {activeModal === "therapist-settings"
                  ? "Therapist Preferences"
                  : activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}
              </Text>
              {activeModal !== "privacy" &&
                activeModal !== "terms" &&
                activeModal !== "therapist-settings" && (
                  <Pressable onPress={handleUpdate}>
                    <Text
                      style={[
                        styles.modalSave,
                        darkMode && styles.darkPrimaryText,
                      ]}
                    >
                      Save
                    </Text>
                  </Pressable>
                )}
            </View>

            <View style={styles.modalContent}>{renderModalContent()}</View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingBottom: 50,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  darkText: {
    color: "#fff",
  },
  darkSubtext: {
    color: "#aaa",
  },
  darkPrimaryText: {
    color: "#bb86fc",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6200ee",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  nickname: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  darkSection: {
    backgroundColor: "#1e1e1e",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  optionValue: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalSave: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200ee",
  },
  modalContent: {
    padding: 20,
    flex: 1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  therapistOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  therapistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  therapistSpecialty: {
    fontSize: 14,
    color: "#666",
  },
  termsScroll: {
    maxHeight: 400,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  therapistModalContainer: {
    flex: 1,
    height: "100%",
  },
  therapistTabScrollView: {
    flexGrow: 0, // Prevent vertical expansion
  },
  therapistTabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#6200ee",
    paddingVertical: 10,
  },
  therapistTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  activeTherapistTab: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  therapistTabText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  therapistOptionsContainer: {
    padding: 15,
    flex: 1,
  },
  therapistOptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 8,
  },
  therapistOptionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  therapistOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  therapistOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: "48%",
  },
  selectedTherapistOption: {
    borderColor: "#6200ee",
    backgroundColor: "#f3e5f5",
  },
  therapistOptionText: {
    fontSize: 14,
    color: "#333",
  },
  voiceOptionsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  voiceOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedVoiceOption: {
    backgroundColor: "#f0f0ff",
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  voiceOptionText: {
    fontSize: 16,
  },
  appearanceOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  appearanceOption: {
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
  },
  selectedAppearanceOption: {
    borderWidth: 2,
    borderColor: "#6200ee",
    borderRadius: 8,
    padding: 5,
  },
  appearanceImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  appearanceName: {
    marginTop: 8,
    fontWeight: "bold",
  },
});

export default Account;
