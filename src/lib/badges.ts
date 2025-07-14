import { type BadgeIconName } from "@/components/badge-icon";

export type BadgeName = 
  | "Lesson Learner"
  | "Accuracy Ace"
  | "Streak Starter"
  | "Streak Legend"
  | "Trivia Champion"
  | "Cultural Explorer"
  | "Harmony Ambassador"
  | "First Flame"
  | "Flashcard Fanatic";

export interface Badge {
  title: BadgeName;
  description: string;
  icon: BadgeIconName;
  unlocked?: boolean;
}

export const allBadges: Omit<Badge, 'unlocked'>[] = [
  {
    title: "Lesson Learner",
    description: "Complete 10 lessons",
    icon: "BookOpen",
  },
  {
    title: "Accuracy Ace",
    description: "Score 100% accuracy in 5 lessons",
    icon: "CheckCircle",
  },
  {
    title: "Streak Starter",
    description: "Achieve a 3-day streak",
    icon: "Flame",
  },
  {
    title: "Streak Legend",
    description: "Maintain a 30-day streak",
    icon: "Shield",
  },
  {
    title: "Trivia Champion",
    description: "Win 5 trivia games against friends",
    icon: "Trophy",
  },
  {
    title: "Cultural Explorer",
    description: "Complete one module each from all religions",
    icon: "Globe",
  },
  {
    title: "Harmony Ambassador",
    description: "Invite 5 friends and complete a friend challenge",
    icon: "Users",
  },
  {
    title: "First Flame",
    description: "Earn your first 100 XP",
    icon: "Sparkles",
  },
  {
    title: "Flashcard Fanatic",
    description: "View 50+ encyclopedia flashcards",
    icon: "Star",
  },
];
