import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  findNodeHandle,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { addEntry } from "../../components/firebaseConfig";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Entries } from "../../constants/Enums";
import {
  JournalEntryType,
  JournalTemplate,
  JournalTemplateID,
} from "../../constants/Enums";

type TemplateType = "blank" | "morning" | "night" | "todo" | "voice" | "camera";

interface JournalEntry {
  type: JournalEntryType;
  template: JournalTemplate;
  templateId: JournalTemplateID;
  content: any;
  date: Date;
  question?: string;
}

const templateMappings: Record<
  string,
  {
    type: JournalEntryType;
    template: JournalTemplate;
    templateId: JournalTemplateID;
  }
> = {
  "Morning Intentions": {
    type: JournalEntryType.Morning,
    template: JournalTemplate.Morning,
    templateId: JournalTemplateID.Morning1,
  },
  "Evening Reflection": {
    type: JournalEntryType.Night,
    template: JournalTemplate.Night,
    templateId: JournalTemplateID.Night1,
  },
  "Daily Gratitude": {
    type: JournalEntryType.Gratitude,
    template: JournalTemplate.Gratitude,
    templateId: JournalTemplateID.Gratitude,
  },
  "High/Low of the Day": {
    type: JournalEntryType.Blank,
    template: JournalTemplate.HighLow,
    templateId: JournalTemplateID.HighLow,
  },
  "Anxiety Check-in": {
    type: JournalEntryType.MentalHealth,
    template: JournalTemplate.AnxietyCheckin,
    templateId: JournalTemplateID.AnxietyCheckin,
  },
  "Mood Tracker": {
    type: JournalEntryType.MentalHealth,
    template: JournalTemplate.MoodTracker,
    templateId: JournalTemplateID.MoodTracker,
  },
  "Thought Challenge": {
    type: JournalEntryType.MentalHealth,
    template: JournalTemplate.ThoughtChallenge,
    templateId: JournalTemplateID.ThoughtChallenge,
  },
  "Self-Compassion Exercise": {
    type: JournalEntryType.MentalHealth,
    template: JournalTemplate.SelfCompassion,
    templateId: JournalTemplateID.SelfCompassion,
  },
  "Emotional Inventory": {
    type: JournalEntryType.MentalHealth,
    template: JournalTemplate.EmotionalInventory,
    templateId: JournalTemplateID.EmotionalInventory,
  },
  "Coping Strategies": {
    type: JournalEntryType.MentalHealth,
    template: JournalTemplate.CopingStrategies,
    templateId: JournalTemplateID.CopingStrategies,
  },
  "Priority Tasks": {
    type: JournalEntryType.Organization,
    template: JournalTemplate.PriorityTasks,
    templateId: JournalTemplateID.PriorityTasks,
  },
  "Weekly Goals": {
    type: JournalEntryType.Organization,
    template: JournalTemplate.WeeklyGoals,
    templateId: JournalTemplateID.WeeklyGoals,
  },
  "Brain Dump": {
    type: JournalEntryType.Organization,
    template: JournalTemplate.BrainDump,
    templateId: JournalTemplateID.BrainDump,
  },
  "Meeting Notes": {
    type: JournalEntryType.Organization,
    template: JournalTemplate.MeetingNotes,
    templateId: JournalTemplateID.MeetingNotes,
  },
  "Project Planning": {
    type: JournalEntryType.Organization,
    template: JournalTemplate.ProjectPlanning,
    templateId: JournalTemplateID.ProjectPlanning,
  },
  "Habit Tracker": {
    type: JournalEntryType.Organization,
    template: JournalTemplate.HabitTracker,
    templateId: JournalTemplateID.HabitTracker,
  },

  "Poetry Starter": {
    type: JournalEntryType.Creative,
    template: JournalTemplate.PoetryStarter,
    templateId: JournalTemplateID.PoetryStarter,
  },

  "Dialogue Prompt": {
    type: JournalEntryType.Creative,
    template: JournalTemplate.DialoguePrompt,
    templateId: JournalTemplateID.DialoguePrompt,
  },
  "Story Ideas": {
    type: JournalEntryType.Creative,
    template: JournalTemplate.StoryIdeas,
    templateId: JournalTemplateID.StoryIdeas,
  },

  "Relationship Appreciation": {
    type: JournalEntryType.Relationships,
    template: JournalTemplate.RelationshipAppreciation,
    templateId: JournalTemplateID.RelationshipAppreciation,
  },
  "Communication Reflection": {
    type: JournalEntryType.Relationships,
    template: JournalTemplate.CommunicationReflection,
    templateId: JournalTemplateID.CommunicationReflection,
  },
  "Social Energy Check-in": {
    type: JournalEntryType.Relationships,
    template: JournalTemplate.SocialEnergy,
    templateId: JournalTemplateID.SocialEnergy,
  },
  "Boundary Setting": {
    type: JournalEntryType.Relationships,
    template: JournalTemplate.BoundarySetting,
    templateId: JournalTemplateID.BoundarySetting,
  },
  "Conflict Resolution": {
    type: JournalEntryType.Relationships,
    template: JournalTemplate.ConflictResolution,
    templateId: JournalTemplateID.ConflictResolution,
  },
  "Gratitude for Others": {
    type: JournalEntryType.Relationships,
    template: JournalTemplate.GratitudeForOthers,
    templateId: JournalTemplateID.GratitudeForOthers,
  },
  "Values Alignment": {
    type: JournalEntryType.PersonalGrowth,
    template: JournalTemplate.ValuesAlignment,
    templateId: JournalTemplateID.ValuesAlignment,
  },
  "Life Vision": {
    type: JournalEntryType.PersonalGrowth,
    template: JournalTemplate.LifeVision,
    templateId: JournalTemplateID.LifeVision,
  },
  "Skill Development": {
    type: JournalEntryType.PersonalGrowth,
    template: JournalTemplate.SkillDevelopment,
    templateId: JournalTemplateID.SkillDevelopment,
  },
  "Obstacle Analysis": {
    type: JournalEntryType.PersonalGrowth,
    template: JournalTemplate.ObstacleAnalysis,
    templateId: JournalTemplateID.ObstacleAnalysis,
  },
  "Success Celebration": {
    type: JournalEntryType.PersonalGrowth,
    template: JournalTemplate.SuccessCelebration,
    templateId: JournalTemplateID.SuccessCelebration,
  },
  "Lesson Learning": {
    type: JournalEntryType.PersonalGrowth,
    template: JournalTemplate.LessonLearning,
    templateId: JournalTemplateID.LessonLearning,
  },
  "Weekly Review": {
    type: JournalEntryType.Blank,
    template: JournalTemplate.WeeklyReview,
    templateId: JournalTemplateID.WeeklyReview,
  },
  "Mindful Moment": {
    type: JournalEntryType.Blank,
    template: JournalTemplate.MindfulMoment,
    templateId: JournalTemplateID.MindfulMoment,
  },
};
const morningQuestions = [
  "How did you sleep last night?",
  "What are you most looking forward to today?",
  "What's one intention you want to set for today?",
  "What are three things you're grateful for this morning?",
  "How can you make today amazing?",
];

const nightQuestions = [
  "What were the highlights of your day?",
  "What challenges did you face today?",
  "What did you learn today?",
  "How are you feeling right now?",
  "What would make tomorrow even better?",
];

// Define template prompts for each template type
const templatePrompts: Record<string, string[]> = {
  "Morning Intentions": [
    "What are your main goals for today?",
    "How do you want to feel by the end of the day?",
    "What's one thing you can do to make today great?",
    "What are you looking forward to today?",
    "How will you practice self-care today?",
  ],
  "Evening Reflection": [
    "What were the highlights of your day?",
    "What challenges did you face and how did you handle them?",
    "What are you grateful for today?",
    "What did you learn about yourself today?",
    "How will you make tomorrow even better?",
  ],
  "Daily Gratitude": [
    "What are three things you're grateful for today?",
    "Who made a positive impact on your day and how?",
    "What small pleasure did you enjoy today?",
    "What ability or skill are you thankful to have?",
    "What beauty did you notice in your surroundings today?",
  ],
  "High/Low of the Day": [
    "What was the high point of your day?",
    "What was the low point of your day?",
    "What did you learn from these experiences?",
    "How can you create more high points tomorrow?",
    "What would you do differently if you could replay the day?",
  ],
  "Anxiety Check-in": [
    "On a scale of 1-10, how anxious are you feeling right now?",
    "What physical sensations are you experiencing?",
    "What thoughts are contributing to your anxiety?",
    "What coping strategies could help right now?",
    "What's one small step you can take to feel more grounded?",
  ],
  "Mood Tracker": [
    "How would you describe your overall mood today?",
    "What factors influenced your mood most today?",
    "What activities improved your mood?",
    "What patterns do you notice in your mood changes?",
    "What can you do tomorrow to support a positive mood?",
  ],
  "Thought Challenge": [
    "What negative thought is bothering you right now?",
    "What evidence supports this thought?",
    "What evidence contradicts this thought?",
    "What's a more balanced way to view this situation?",
    "What would you tell a friend who had this thought?",
  ],
  "Self-Compassion Exercise": [
    "What difficult emotions are you experiencing right now?",
    "How would you comfort a friend going through this?",
    "What kind words can you offer yourself?",
    "What common humanity can you find in this experience?",
    "What small act of self-care can you practice today?",
  ],
  "Emotional Inventory": [
    "What emotions are you experiencing right now?",
    "On a scale of 1-10, how intense is each emotion?",
    "What triggered these emotions?",
    "How are these emotions showing up in your body?",
    "What do these emotions need you to hear or do?",
  ],
  "Coping Strategies": [
    "What stressor are you currently facing?",
    "What healthy coping strategies have worked for you before?",
    "What new strategies could you try?",
    "Who can support you in dealing with this?",
    "What small step can you take right now to feel better?",
  ],
  "Priority Tasks": [
    "What are your top 3 priorities for today?",
    "What deadlines are you working towards?",
    "What tasks will have the biggest impact?",
    "What can you delegate or eliminate?",
    "How will you celebrate completing your tasks?",
  ],
  "Weekly Goals": [
    "What do you want to accomplish this week?",
    "What steps will help you achieve these goals?",
    "What potential obstacles might you face?",
    "How will you measure success this week?",
    "How can you break big goals into manageable steps?",
  ],
  "Brain Dump": [
    "What thoughts are occupying your mind right now?",
    "What tasks do you need to remember?",
    "What ideas or inspirations have you had recently?",
    "What worries or concerns are on your mind?",
    "What questions do you need answers to?",
  ],
  "Meeting Notes": [
    "What was the main purpose of this meeting?",
    "What key decisions were made?",
    "What action items were assigned (and to whom)?",
    "What important information was shared?",
    "What are the next steps and deadlines?",
  ],
  "Project Planning": [
    "What is the main objective of this project?",
    "What are the key milestones or phases?",
    "What resources will you need?",
    "What potential challenges might arise?",
    "How will you measure the project's success?",
  ],
  "Habit Tracker": [
    "What habits are you focusing on this week?",
    "How consistently have you practiced each habit?",
    "What made it easier or harder to maintain your habits?",
    "What adjustments do you need to make?",
    "How are these habits helping you reach your goals?",
  ],
  "Poetry Starter": [
    "Write a poem about a memory that feels like sunlight",
    "Describe the color of your current emotion in verse",
    "Create a poem using these words: whisper, shadow, bloom, distance",
    "Write about an ordinary object as if it's magical",
    "Compose a poem that captures the sound of silence",
  ],
  "Dialogue Prompt": [
    "Write a conversation between two people meeting for the first time",
    "Create dialogue where someone reveals a secret",
    "Write an argument where both people are right in their own way",
    "Compose a conversation that happens entirely through text messages",
    "Write dialogue where what's unsaid is more important than what's spoken",
  ],
  "Story Ideas": [
    "What if you discovered a hidden door in your home?",
    "Imagine a world where emotions are visible as colors",
    "Write about a character who can hear people's thoughts",
    "Create a story that begins with 'The last thing I expected to find...'",
    "What happens when someone receives a letter from their future self?",
  ],
  "Relationship Appreciation": [
    "Who in your life are you most grateful for today?",
    "What specific qualities do you appreciate about this person?",
    "How has this person positively impacted your life?",
    "What memory with them makes you smile?",
    "How can you show your appreciation to them this week?",
  ],
  "Communication Reflection": [
    "How effectively have you been communicating lately?",
    "What conversation made you feel truly heard recently?",
    "Where could you improve your listening skills?",
    "What's something you've been avoiding talking about?",
    "How can you express yourself more clearly and kindly?",
  ],
  "Social Energy Check-in": [
    "How is your social battery feeling today?",
    "What types of interactions drain or energize you?",
    "What boundaries do you need to set for your social health?",
    "How can you balance social time with alone time?",
    "What relationships feel most nourishing right now?",
  ],
  "Boundary Setting": [
    "Where do you need to establish clearer boundaries?",
    "What makes it difficult for you to set boundaries?",
    "How will you communicate your boundaries respectfully?",
    "What will you do if someone crosses your boundaries?",
    "How will maintaining these boundaries improve your wellbeing?",
  ],
  "Conflict Resolution": [
    "What conflict is currently on your mind?",
    "What's your perspective and what might be theirs?",
    "What common ground can you find?",
    "How can you express your needs without blame?",
    "What would a peaceful resolution look like?",
  ],
  "Gratitude for Others": [
    "Who has shown you kindness recently?",
    "What specific actions from others are you thankful for?",
    "How have others supported your growth?",
    "What relationships challenge you in positive ways?",
    "How can you pay forward the kindness you've received?",
  ],
  "Values Alignment": [
    "What values are most important to you right now?",
    "How well are your actions aligning with these values?",
    "Where do you notice misalignment in your life?",
    "What changes could help you live more authentically?",
    "How do your values guide your decisions?",
  ],
  "Life Vision": [
    "What does your ideal life look like in 5 years?",
    "What values will guide your life journey?",
    "What accomplishments would make you feel fulfilled?",
    "What kind of person do you want to become?",
    "What steps can you take today toward this vision?",
  ],
  "Skill Development": [
    "What skill would you like to develop or improve?",
    "Why is this skill important to you?",
    "What resources are available to help you learn?",
    "How can you practice this skill regularly?",
    "How will mastering this skill enhance your life?",
  ],
  "Obstacle Analysis": [
    "What obstacle are you currently facing?",
    "What have you tried so far to overcome it?",
    "What resources or support could help?",
    "What's the smallest step you can take right now?",
    "What might this obstacle be teaching you?",
  ],
  "Success Celebration": [
    "What accomplishment are you proud of recently?",
    "How did you grow through this experience?",
    "Who helped you achieve this success?",
    "How will you celebrate this achievement?",
    "What does this success teach you about your capabilities?",
  ],
  "Lesson Learning": [
    "What challenged you recently?",
    "What did this experience teach you?",
    "How will you apply this lesson moving forward?",
    "What would you do differently next time?",
    "How has this experience helped you grow?",
  ],
  "Weekly Review": [
    "What were your biggest accomplishments this week?",
    "What challenges did you overcome?",
    "What did you learn about yourself?",
    "What habits served you well?",
    "What will you focus on next week?",
  ],
  "Mindful Moment": [
    "What sensations do you notice in your body right now?",
    "What sounds can you hear around you?",
    "What emotions are present without judgment?",
    "Where is your breath flowing in your body?",
    "What can you observe with gentle curiosity?",
  ],
};

const NewEntryScreen = () => {
  const [activeTab, setActiveTab] = useState<TemplateType>("blank");
  const [entryText, setEntryText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTemplateDetail, setShowTemplateDetail] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateAnswers, setTemplateAnswers] = useState<
    Record<string, string[]>
  >({});
  const [morningAnswers, setMorningAnswers] = useState(
    Array(morningQuestions.length).fill("")
  );
  const [nightAnswers, setNightAnswers] = useState(
    Array(nightQuestions.length).fill("")
  );
  const [todoItems, setTodoItems] = useState([{ text: "", checked: false }]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<TemplateType | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  //   const inputRefs = useRef<Array<TextInput | null>>([]);
  //   const templateInputRefs = useRef<Array<TextInput | null>>([]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const templateInputRefs = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  //   const onEntrySaved = params.onEntrySaved as (() => void) | undefined;

  // Check if there are unsaved changes
  const hasChanges = () => {
    switch (activeTab) {
      case "blank":
        return entryText.trim() !== "";
      case "morning":
        return morningAnswers.some((answer) => answer.trim() !== "");
      case "night":
        return nightAnswers.some((answer) => answer.trim() !== "");
      case "todo":
        return todoItems.some((item) => item.text.trim() !== "");
      default:
        return false;
    }
  };

  const templateCategories = [
    {
      name: "Daily Reflection",
      templates: [
        "Morning Intentions",
        "Evening Reflection",
        "Daily Gratitude",
        "High/Low of the Day",
        "Weekly Review",
        "Mindful Moment",
      ],
    },
    {
      name: "Mental Health",
      templates: [
        "Anxiety Check-in",
        "Mood Tracker",
        "Thought Challenge",
        "Self-Compassion Exercise",
        "Emotional Inventory",
        "Coping Strategies",
      ],
    },
    {
      name: "Organization",
      templates: [
        "Priority Tasks",
        "Weekly Goals",
        "Brain Dump",
        "Meeting Notes",
        "Project Planning",
        "Habit Tracker",
      ],
    },
    {
      name: "Creative",
      templates: ["Poetry Starter", "Dialogue Prompt", "Story Ideas"],
    },
    {
      name: "Relationships",
      templates: [
        "Relationship Appreciation",
        "Communication Reflection",
        "Social Energy Check-in",
        "Boundary Setting",
        "Conflict Resolution",
        "Gratitude for Others",
      ],
    },
    {
      name: "Personal Growth",
      templates: [
        "Values Alignment",
        "Life Vision",
        "Skill Development",
        "Obstacle Analysis",
        "Success Celebration",
        "Lesson Learning",
      ],
    },
  ];

  // Show alert when trying to switch tabs with unsaved changes
  const confirmTabChange = (newTab: TemplateType) => {
    if (hasUnsavedChanges && hasChanges()) {
      setPendingTabChange(newTab);
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. What would you like to do?",
        [
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              discardChanges();
              setActiveTab(newTab);
              setHasUnsavedChanges(false);
              setPendingTabChange(null);
            },
          },
          {
            text: "Save",
            onPress: () => {
              handleSave().then(() => {
                setActiveTab(newTab);
                setPendingTabChange(null);
              });
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setPendingTabChange(null),
          },
        ]
      );
    } else {
      setActiveTab(newTab);
      setHasUnsavedChanges(false);
    }
  };

  const discardChanges = () => {
    setEntryText("");
    setMorningAnswers(Array(morningQuestions.length).fill(""));
    setNightAnswers(Array(nightQuestions.length).fill(""));
    setTodoItems([{ text: "", checked: false }]);
    setHasUnsavedChanges(false);
  };

  // Handle template selection with confirmation
  const handleTemplate = (type: TemplateType) => {
    confirmTabChange(type);
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);

    // Initialize answers if not already set
    if (!templateAnswers[template]) {
      const prompts = templatePrompts[template] || [
        "Write your thoughts here...",
      ];
      setTemplateAnswers({
        ...templateAnswers,
        [template]: Array(prompts.length).fill(""),
      });
    }

    setShowTemplates(false);
    setShowTemplateDetail(true);
  };

  const handleTemplateAnswerChange = (
    template: string,
    index: number,
    text: string
  ) => {
    const newAnswers = [...(templateAnswers[template] || [])];
    newAnswers[index] = text;
    setTemplateAnswers({
      ...templateAnswers,
      [template]: newAnswers,
    });
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    setIsSavingTemplate(true);

    try {
      const prompts = templatePrompts[selectedTemplate] || [
        "Write your thoughts here...",
      ];
      const answers = templateAnswers[selectedTemplate] || [];

      const mapping = templateMappings[selectedTemplate] || {
        type: JournalEntryType.Blank,
        template: JournalTemplate.Blank,
        templateId: JournalTemplateID.Blank,
      };

      const content = prompts.map((question, index) => ({
        id: index,
        question: question,
        answer: answers[index] || "",
      }));

      const journalEntry: JournalEntry = {
        type: mapping.type,
        template: mapping.template,
        templateId: mapping.templateId,
        content: content,
        date: new Date(),
      };

      const result = await addEntry(Entries.Journal, journalEntry);

      if (result.success) {
        Alert.alert("Success", "Journal entry saved successfully!");

        // Navigate back to Journal with a parameter that will trigger refresh
        // (navigation as any).navigate("(tabs)/Journal", {
        //   refreshNeeded: true,
        //   timestamp: Date.now(), // Add a timestamp to ensure it's unique
        // });
        router.push({
          pathname: "/(tabs)/Journal", // or whatever your journal route path is
          params: {
            refreshNeeded: "true",
            timestamp: Date.now(),
          },
        });

        setShowTemplateDetail(false);
        setSelectedTemplate("");
        setTemplateAnswers({
          ...templateAnswers,
          [selectedTemplate]: Array(prompts.length).fill(""),
        });
      } else {
        Alert.alert("Error", "Failed to save journal entry. Please try again.");
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      Alert.alert("Error", "An unexpected error occurred while saving.");
    } finally {
      setIsSavingTemplate(false);
    }
  };
  const handleSavePress = async () => {
    setIsSaving(true);
    const success = await handleSave();
    setIsSaving(false);

    if (success) {
      // Navigate back with refresh parameter

      //   (navigation as any).navigate("(tabs)/Journal", {
      //     refreshNeeded: true,
      //     timestamp: Date.now(),
      //   });
      router.push({
        pathname: "/(tabs)/Journal", // or whatever your journal route path is
        params: {
          refreshNeeded: "true",
          timestamp: Date.now(),
        },
      });
    }
  };
  const handleSave = async (): Promise<boolean> => {
    try {
      let journalEntry: JournalEntry;

      switch (activeTab) {
        case "blank":
          // For blank entries, we'll keep it as simple text
          journalEntry = {
            type: JournalEntryType.Blank,
            template: JournalTemplate.Blank,
            templateId: JournalTemplateID.Blank,
            content: entryText as any, // Keep as string for blank entries
            date: new Date(),
          };
          break;

        case "morning":
          // Convert morning answers to AIQuestion format
          const morningContent = morningQuestions.map((question, index) => ({
            id: index,
            question: question,
            answer: morningAnswers[index] || "",
          }));
          journalEntry = {
            type: JournalEntryType.Morning,
            template: JournalTemplate.Morning,
            templateId: JournalTemplateID.Morning1,
            content: morningContent,
            date: new Date(),
          };
          break;

        case "night":
          // Convert night answers to AIQuestion format
          const nightContent = nightQuestions.map((question, index) => ({
            id: index,
            question: question,
            answer: nightAnswers[index] || "",
          }));
          journalEntry = {
            type: JournalEntryType.Night,
            template: JournalTemplate.Night,
            templateId: JournalTemplateID.Night1,
            content: nightContent,
            date: new Date(),
          };
          break;

        case "todo":
          // For todo, we'll keep the original format since it's different
          journalEntry = {
            type: JournalEntryType.Todo,
            template: JournalTemplate.Todo,
            templateId: JournalTemplateID.Todo,
            content: todoItems as any,
            date: new Date(),
          };
          break;

        case "voice":
          journalEntry = {
            type: JournalEntryType.Voice,
            template: JournalTemplate.Voice,
            templateId: JournalTemplateID.Voice,
            content: "Voice recording" as any,
            date: new Date(),
          };
          break;

        case "camera":
          journalEntry = {
            type: JournalEntryType.Camera,
            template: JournalTemplate.Camera,
            templateId: JournalTemplateID.Camera,
            content: "Scanned text" as any,
            date: new Date(),
          };
          break;

        default:
          return false;
      }

      const result = await addEntry(Entries.Journal, journalEntry);

      if (result.success) {
        setHasUnsavedChanges(false);
        Alert.alert("Success", "Journal entry saved successfully!");
        return true;
      } else {
        Alert.alert("Error", "Failed to save journal entry. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      Alert.alert("Error", "An unexpected error occurred while saving.");
      return false;
    }
  };

  // Handle navigation back with confirmation
  const handleGoBack = () => {
    if (hasUnsavedChanges && hasChanges()) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. What would you like to do?",
        [
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              discardChanges();
              navigation.goBack();
            },
          },
          {
            text: "Save",
            onPress: () => {
              handleSave().then((success) => {
                if (success) navigation.goBack();
              });
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Update functions to track changes
  const updateEntryText = (text: string) => {
    setEntryText(text);
    setHasUnsavedChanges(true);
  };

  const handleCamera = () => console.log("open camera");
  const handleVoice = () => console.log("open voice");

  const handleMorningAnswerChange = (index: number, text: string) => {
    const newAnswers = [...morningAnswers];
    newAnswers[index] = text;
    setMorningAnswers(newAnswers);
    setHasUnsavedChanges(true);
  };

  const handleNightAnswerChange = (index: number, text: string) => {
    const newAnswers = [...nightAnswers];
    newAnswers[index] = text;
    setNightAnswers(newAnswers);
    setHasUnsavedChanges(true);
  };

  const handleTodoChange = (index: number, text: string) => {
    const newItems = [...todoItems];
    newItems[index].text = text;

    if (index === newItems.length - 1 && text.trim() !== "") {
      newItems.push({ text: "", checked: false });
    }

    if (index < newItems.length - 1 && text.trim() === "") {
      newItems.splice(index, 1);
    } else {
      setTodoItems(newItems);
    }
    setHasUnsavedChanges(true);
  };

  const toggleTodoCheck = (index: number) => {
    const newItems = [...todoItems];
    newItems[index].checked = !newItems[index].checked;
    setTodoItems(newItems);
    setHasUnsavedChanges(true);
  };

  const handleInputFocus =
    (index: number) => (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setTimeout(() => {
        const inputNode = inputRefs.current[index]
          ? findNodeHandle(inputRefs.current[index])
          : null;
        const scrollNode = scrollViewRef.current
          ? findNodeHandle(scrollViewRef.current)
          : null;

        if (inputNode && scrollNode) {
          //   inputRefs.current[index]?.measureLayout(
          //     scrollNode,
          //     (x, y, width, height) => {
          //       scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
          //     },
          //     () => console.log("measurement failed")
          //   );
          //   inputRefs.current[index]?.measureInWindow((x, y, width, height) => {
          //     scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
          //   });
        }
      }, 100);
    };

  const handleTemplateInputFocus =
    (index: number) => (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: index * 100, animated: true });
      }, 100);
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Entry</Text>
        <TouchableOpacity onPress={handleSavePress} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.Primary} />
          ) : (
            <Text
              style={[styles.saveButton, isSaving && styles.disabledButton]}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Entry Type Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.entryTypeContainer}
      >
        {(
          [
            "blank",
            "morning",
            "night",
            "todo",
            "voice",
            "camera",
          ] as TemplateType[]
        ).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.entryTypeButton,
              activeTab === type && styles.activeEntryType,
            ]}
            onPress={() => handleTemplate(type)}
          >
            <Text
              style={[
                styles.entryTypeText,
                activeTab === type && styles.activeEntryTypeText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.moreTemplatesButton}
        onPress={() => setShowTemplates(true)}
      >
        <Text style={styles.moreTemplatesText}>More Templates...</Text>
      </TouchableOpacity>

      {/* Templates Modal */}
      <Modal visible={showTemplates} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Journal Templates</Text>

            <ScrollView>
              {templateCategories.map((category) => (
                <View key={category.name} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  {category.templates.map((template) => (
                    <TouchableOpacity
                      key={template}
                      style={styles.templateButton}
                      onPress={() => handleTemplateSelect(template)}
                    >
                      <Text style={styles.templateText}>{template}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTemplates(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Template Detail Modal */}
      <Modal
        visible={showTemplateDetail}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View style={styles.templateDetailModal}>
            <Text style={styles.templateDetailTitle}>{selectedTemplate}</Text>

            <ScrollView
              style={styles.templateDetailContent}
              keyboardShouldPersistTaps="handled"
            >
              {(
                templatePrompts[selectedTemplate] || [
                  "Write your thoughts here...",
                ]
              ).map((prompt, index) => (
                <View key={index} style={styles.templatePromptContainer}>
                  <Text style={styles.templatePromptText}>{prompt}</Text>
                  <TextInput
                    ref={(el) => (templateInputRefs.current[index] = el)}
                    style={styles.templateAnswerInput}
                    multiline
                    placeholder="Your answer..."
                    value={templateAnswers[selectedTemplate]?.[index] || ""}
                    onChangeText={(text) =>
                      handleTemplateAnswerChange(selectedTemplate, index, text)
                    }
                    onFocus={handleTemplateInputFocus(index)}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.templateModalActions}>
              <TouchableOpacity
                style={[
                  styles.templateModalButton,
                  styles.templateModalButtonSecondary,
                ]}
                onPress={() => setShowTemplateDetail(false)}
              >
                <Text style={styles.templateModalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.templateModalButton,
                  styles.templateModalButtonPrimary,
                ]}
                onPress={handleSaveTemplate}
                disabled={isSavingTemplate}
              >
                {isSavingTemplate ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    style={[
                      styles.templateModalButtonText,
                      styles.templateModalButtonPrimaryText,
                    ]}
                  >
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Main Content Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.contentArea}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "blank" && (
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Write your thoughts here..."
            value={entryText}
            onChangeText={updateEntryText}
            onFocus={handleInputFocus(0)}
          />
        )}

        {activeTab === "morning" && (
          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>Morning Reflection</Text>

            {morningQuestions.map((question, index) => (
              <View key={index}>
                <Text style={styles.templatePrompt}>
                  {index + 1}. {question}
                </Text>
                <TextInput
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={styles.answerInput}
                  multiline
                  placeholder="Your answer..."
                  value={morningAnswers[index]}
                  onChangeText={(text) =>
                    handleMorningAnswerChange(index, text)
                  }
                  onFocus={handleInputFocus(index)}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === "night" && (
          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>Evening Reflection</Text>

            {nightQuestions.map((question, index) => (
              <View key={index}>
                <Text style={styles.templatePrompt}>
                  {index + 1}. {question}
                </Text>
                <TextInput
                  ref={(el) => (inputRefs.current[3 + index] = el)}
                  style={styles.answerInput}
                  multiline
                  placeholder="Your answer..."
                  value={nightAnswers[index]}
                  onChangeText={(text) => handleNightAnswerChange(index, text)}
                  onFocus={handleInputFocus(3 + index)}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === "todo" && (
          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>To-Do List</Text>

            {todoItems.map((item, index) => (
              <View key={index} style={styles.todoItem}>
                <TouchableOpacity
                  style={[styles.checkbox, item.checked && styles.checkedBox]}
                  onPress={() => toggleTodoCheck(index)}
                >
                  {item.checked && (
                    <MaterialIcons name="check" size={16} color="white" />
                  )}
                </TouchableOpacity>
                <TextInput
                  ref={(el) => (inputRefs.current[6 + index] = el)}
                  style={styles.todoInput}
                  multiline
                  placeholder={`Task ${index + 1}`}
                  value={item.text}
                  onChangeText={(text) => handleTodoChange(index, text)}
                  onFocus={handleInputFocus(6 + index)}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === "voice" && (
          <View style={styles.centeredOption}>
            <TouchableOpacity style={styles.bigButton} onPress={handleVoice}>
              <Text style={styles.bigButtonText}>
                🎤 Tap to Record Voice Note
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "camera" && (
          <View style={styles.centeredOption}>
            <TouchableOpacity style={styles.bigButton} onPress={handleCamera}>
              <Text style={styles.bigButtonText}>📷 Scan Journal Page</Text>
            </TouchableOpacity>
            <Text style={styles.hintText}>
              Will extract text from your handwritten notes
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    color: Colors.Primary,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    color: Colors.Primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  entryTypeContainer: {
    maxHeight: 50,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  entryTypeButton: {
    paddingHorizontal: 17,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  activeEntryType: {
    backgroundColor: Colors.Primary,
  },
  entryTypeText: {
    color: "#333",
  },
  activeEntryTypeText: {
    color: "white",
  },
  contentArea: {
    flex: 1,
    padding: 15,
  },
  textInput: {
    minHeight: 200,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    elevation: 1,
  },
  templateContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 1,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.Primary,
  },
  templatePrompt: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 8,
    color: "#333",
  },
  answerInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
    minHeight: 80,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: Colors.Primary,
    borderColor: Colors.Primary,
  },
  todoInput: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 40,
  },
  centeredOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigButton: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    width: "80%",
  },
  bigButtonText: {
    fontSize: 18,
    color: Colors.Primary,
  },
  hintText: {
    marginTop: 15,
    color: "#666",
    textAlign: "center",
  },
  moreTemplatesButton: {
    alignSelf: "center",
    marginVertical: 15,
    maxHeight: 80,
  },
  moreTemplatesText: {
    color: Colors.Primary,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    maxHeight: "80%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.Primary,
    textAlign: "center",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  templateButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  templateText: {
    fontSize: 15,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.Primary,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Template Detail Modal Styles
  templateDetailModal: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 15,
    maxHeight: "80%",
    padding: 20,
  },
  templateDetailTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.Primary,
    textAlign: "center",
  },
  templateDetailContent: {
    marginBottom: 20,
    maxHeight: "70%",
  },
  templatePromptContainer: {
    marginBottom: 20,
  },
  templatePromptText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  templateAnswerInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  templateModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  templateModalButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  templateModalButtonSecondary: {
    backgroundColor: "#e0e0e0",
  },
  templateModalButtonPrimary: {
    backgroundColor: Colors.Primary,
  },
  templateModalButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  templateModalButtonPrimaryText: {
    color: "white",
  },
});

export default NewEntryScreen;
