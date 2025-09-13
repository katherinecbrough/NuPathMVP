import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

type Video = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  type: string;
  tags?: string[];
};

type Resource = {
  id: string;
  title: string;
  type: string;
  author?: string;
  host?: string;
  tags: string[];
  image: string;
};

const MentalHealthLibrary = () => {
  const [selectedStruggle, setSelectedStruggle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>(
    []
  );

  // Mock function to get recommended resources based on app usage
  const getRecommendedResources = () => {
    // In a real app, this would be based on user behavior
    // For prototype, we'll return a mix of resources
    const recommendations = [
      {
        id: "r5",
        title: "5-Minute Morning Meditation",
        type: "Video",
        author: "Nikki Roy",
        tags: ["stress", "anxiety"],
        image: "https://i.ytimg.com/vi/ssss7V1_eyA/maxresdefault.jpg",
      },
      allResources[0], // "The Body Keeps the Score"
      {
        id: "r6",
        title: "Small Wins, Big Shifts: The Science of Tiny Habits podcast",
        type: "Podcast",
        author: "Mindful Momentum",
        tags: ["stress", "anxiety"],
        image:
          "https://res.cloudinary.com/kcb-software-design/image/upload/v1748648030/g5bu5vm1q0tfnz2t2dfz.jpg",
      },
    ];
    setRecommendedResources(recommendations);
    setShowRecommendations(true);
  };

  const favoriteVideos = [
    {
      id: "fav1",
      title: "Morning Calm Meditation",
      duration: "8:15",
      thumbnail: "https://i.ytimg.com/vi/inpok4MKVLM/maxresdefault.jpg",
    },
    {
      id: "fav2",
      title: "Yoga for Anxiety Relief",
      duration: "12:30",
      thumbnail:
        "https://i.ytimg.com/vi/bJJWArRfKa0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBJ3dkfKbM8TbpumTYT2MVW53khtA",
    },
    {
      id: "fav3",
      title: "Understanding Trauma Responses",
      duration: "15:42",
      thumbnail: "https://i.ytimg.com/vi/svX3fEdVTLQ/maxresdefault.jpg",
    },
  ];

  const videoCategories = [
    {
      id: "1",
      title: "Meditation Guides",
      videos: [
        {
          id: "101",
          title: "5-Minute Morning Meditation",
          duration: "5:22",
          thumbnail: "https://i.ytimg.com/vi/ssss7V1_eyA/maxresdefault.jpg",
          type: "meditation",
          tags: ["stress", "anxiety"],
        },
        {
          id: "102",
          title: "Body Scan for Anxiety Relief",
          duration: "10:45",
          thumbnail: "https://i.ytimg.com/vi/HtDAUccuwO8/maxresdefault.jpg",
          type: "meditation",
          tags: ["anxiety"],
        },
      ],
    },
    {
      id: "2",
      title: "Yoga Flows",
      videos: [
        {
          id: "201",
          title: "Gentle Yoga for Stress Relief",
          duration: "15:30",
          thumbnail:
            "https://i.ytimg.com/vi/Y0F6jVg_Pr4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD-UTwhkoUFmJ_CnJHpN2idwJDe7w",
          type: "yoga",
          tags: ["stress"],
        },
        {
          id: "202",
          title: "Yoga for Better Sleep",
          duration: "20:15",
          thumbnail: "https://i.ytimg.com/vi/HVL1txy1FNM/maxresdefault.jpg",
          type: "yoga",
          tags: ["stress", "anxiety"],
        },
      ],
    },
    {
      id: "3",
      title: "Mental Health Topics",
      videos: [
        {
          id: "301",
          title: "Understanding CPTSD",
          duration: "12:18",
          thumbnail: "https://i.ytimg.com/vi/NeQ8bgUAnFg/maxresdefault.jpg",
          type: "education",
          tags: ["cptsd"],
        },
        {
          id: "302",
          title: "ADHD Focus Techniques",
          duration: "8:42",
          thumbnail: "https://i.ytimg.com/vi/4W4eLD3dG38/maxresdefault.jpg",
          type: "education",
          tags: ["adhd"],
        },
        {
          id: "303",
          title: "Healing After a Breakup",
          duration: "14:25",
          thumbnail:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuaEd83q-EFzqh-bvSQKnDx8SokvXdWm88_w&s",
          type: "education",
          tags: ["breakup"],
        },
      ],
    },
  ];

  const allResources = [
    {
      id: "r1",
      title: "The Body Keeps the Score",
      type: "book",
      author: "Bessel van der Kolk",
      tags: ["cptsd", "trauma"],
      image: "https://i.ytimg.com/vi/QSCXyYuT2rE/maxresdefault.jpg",
    },
    {
      id: "r2",
      title: "Driven to Distraction",
      type: "book",
      author: "Edward Hallowell",
      tags: ["adhd"],
      image:
        "https://psychwithkeegan.com/wp-content/uploads/2024/09/driven-to-distraction-1.png",
    },
    {
      id: "r3",
      title: "The Happiness Trap",
      type: "book",
      author: "Russ Harris",
      tags: ["stress", "anxiety"],
      image:
        "https://cdn.mall.adeptmind.ai/https%3A%2F%2Fslimages.macysassets.com%2Fis%2Fimage%2FMCY%2Fproducts%2F2%2Foptimized%2F22334622_fpx.tif%3Fwid%3D1200%26fmt%3Djpeg%26qlt%3D100_large.webp",
    },
    {
      id: "r4",
      title: "The Mental Illness Happy Hour",
      type: "podcast",
      host: "Paul Gilmartin",
      tags: ["mental health", "cptsd"],
      image:
        "https://mentalpod.com/wp-content/uploads/2015/10/MentalPodiTunesBannerYellow3.png",
    },
  ];

  const struggles = [
    { id: "stress", name: "Stress" },
    { id: "anxiety", name: "Anxiety" },
    { id: "adhd", name: "Focus" },
    { id: "breakup", name: "Relationships" },
    { id: "depression", name: "Depression" },
    { id: "self", name: "Self" },
  ];

  // Filter resources based on search query or selected struggle
  const filteredResources = searchQuery
    ? allResources.filter((resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedStruggle
    ? allResources.filter((resource) =>
        resource.tags.includes(selectedStruggle)
      )
    : [];

  const filteredVideos = selectedStruggle
    ? videoCategories
        .flatMap((category) => ({
          ...category,
          videos: category.videos.filter(
            (video) =>
              video.tags?.includes(selectedStruggle) ||
              (selectedStruggle === "stress" &&
                ["meditation", "yoga"].includes(video.type))
          ),
        }))
        .filter((category) => category.videos.length > 0)
    : videoCategories;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Library</Text>
            <Text style={styles.subtitle}>
              Resources for your healing journey
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for resources..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <MaterialIcons
              name="search"
              size={24}
              color={Colors.Primary}
              style={styles.searchIcon}
            />
          </View>

          {/* Recommended Resources Button */}
          <TouchableOpacity
            style={styles.recommendButton}
            onPress={getRecommendedResources}
          >
            <Text style={styles.recommendButtonText}>
              <MaterialIcons name="recommend" size={20} color="white" />{" "}
              Recommended Resources
            </Text>
          </TouchableOpacity>

          {/* Search Results (only shows when searching) */}
          {searchQuery && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Search Results for "{searchQuery}"
              </Text>
              {filteredResources.length > 0 ? (
                <FlatList
                  horizontal
                  data={filteredResources}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.resourceCard}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.resourceImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.resourceTitle}>{item.title}</Text>
                      <Text style={styles.resourceMeta}>
                        {item.type === "book"
                          ? `Book by ${item.author}`
                          : `Podcast`}
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={styles.resourceContainer}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.emptyText}>
                  No resources found for your search
                </Text>
              )}
            </View>
          )}

          {/* Favorites Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.sectionTitle}>Your Favorites</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favoriteVideos.map((video) => (
                <View key={video.id} style={styles.favoriteCard}>
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.favoriteThumbnail}
                  />
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteTitle}>{video.title}</Text>
                    <Text style={styles.favoriteDuration}>
                      <MaterialIcons
                        name="access-time"
                        size={14}
                        color="#666"
                      />
                      {" " + video.duration}
                    </Text>
                  </View>
                  <View style={styles.favoriteBadge}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Struggle Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              What are you struggling with today?
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.struggleContainer}
            >
              {struggles.map((struggle) => (
                <TouchableOpacity
                  key={struggle.id}
                  style={[
                    styles.struggleButton,
                    selectedStruggle === struggle.id && styles.selectedStruggle,
                  ]}
                  onPress={() => {
                    setSelectedStruggle(
                      selectedStruggle === struggle.id ? null : struggle.id
                    );
                    setSearchQuery(""); // Clear search when selecting a struggle
                  }}
                >
                  <Text
                    style={[
                      styles.struggleText,
                      selectedStruggle === struggle.id &&
                        styles.selectedStruggleText,
                    ]}
                  >
                    {struggle.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recommended Resources (only shows when a struggle is selected) */}
          {selectedStruggle && !searchQuery && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons
                  name="recommend"
                  size={20}
                  color={Colors.Primary}
                />
                Recommended Resources
              </Text>
              {filteredResources.length > 0 ? (
                <FlatList
                  horizontal
                  data={filteredResources}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.resourceCard}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.resourceImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.resourceTitle}>{item.title}</Text>
                      <Text style={styles.resourceMeta}>
                        {item.type === "book"
                          ? `Book by ${item.author}`
                          : `Podcast`}
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={styles.resourceContainer}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.emptyText}>
                  No specific resources found, try our general videos below
                </Text>
              )}
            </View>
          )}

          {/* Video Categories */}
          {!searchQuery &&
            filteredVideos.map((category) => (
              <View key={category.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{category.title}</Text>
                <FlatList
                  horizontal
                  data={category.videos}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.videoCard}>
                      <Image
                        source={{ uri: item.thumbnail }}
                        style={styles.videoThumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.videoInfo}>
                        <Text style={styles.videoTitle}>{item.title}</Text>
                        <Text style={styles.videoDuration}>
                          <MaterialIcons
                            name="access-time"
                            size={14}
                            color="#666"
                          />
                          {item.duration}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.videoContainer}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ))}
        </ScrollView>

        {/* Recommendations Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRecommendations}
          onRequestClose={() => {
            setShowRecommendations(!showRecommendations);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Recommended For You</Text>
              <Text style={styles.modalSubtitle}>
                Based on your usage in the app
              </Text>

              <FlatList
                data={recommendedResources}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.modalResourceCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.modalResourceImage}
                      resizeMode="cover"
                    />
                    <View style={styles.modalResourceInfo}>
                      <Text style={styles.modalResourceTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.modalResourceMeta}>
                        {item.type === "book"
                          ? `Book by ${item.author}`
                          : `${item.type} by  ${item.author}`}
                      </Text>
                      <Text
                        style={[
                          styles.modalResourceMeta,
                          { fontWeight: "bold" },
                        ]}
                      >
                        {item.type === "book" || item.type === "Podcast"
                          ? ``
                          : `NuPath Exclusive`}
                      </Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.modalResourceContainer}
              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setShowRecommendations(false)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
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
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.Primary,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 10,
  },
  recommendButton: {
    backgroundColor: Colors.Primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  recommendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  struggleContainer: {
    paddingBottom: 8,
  },
  struggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  selectedStruggle: {
    backgroundColor: Colors.Primary,
  },
  struggleText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedStruggleText: {
    color: "white",
  },
  resourceContainer: {
    paddingRight: 16,
  },
  resourceCard: {
    width: 150,
    marginRight: 12,
  },
  resourceImage: {
    width: 150,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  resourceMeta: {
    fontSize: 12,
    color: "#666",
  },
  videoContainer: {
    paddingRight: 16,
  },
  videoCard: {
    width: 220,
    marginRight: 12,
  },
  videoThumbnail: {
    width: 220,
    height: 124,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoInfo: {
    paddingHorizontal: 4,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  favoriteCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  favoriteThumbnail: {
    width: 200,
    height: 120,
  },
  favoriteInfo: {
    padding: 12,
  },
  favoriteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  favoriteDuration: {
    fontSize: 12,
    color: "#666",
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    padding: 4,
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.Primary,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
    textAlign: "center",
  },
  modalResourceContainer: {
    paddingBottom: 20,
  },
  modalResourceCard: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalResourceImage: {
    width: 80,
    height: 120,
  },
  modalResourceInfo: {
    flex: 1,
    padding: 10,
  },
  modalResourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  modalResourceMeta: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: Colors.Primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MentalHealthLibrary;
