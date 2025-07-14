import { Flame, CheckCircle, Star, Shield, Trophy, Globe, Users, Sparkles, BookOpen, type LucideProps } from "lucide-react";

const icons = {
  Flame,
  CheckCircle,
  Star,
  Shield,
  Trophy,
  Globe,
  Users,
  Sparkles,
  BookOpen,
};

export type BadgeIconName = keyof typeof icons;

interface BadgeIconProps extends LucideProps {
  name: BadgeIconName;
}

export function BadgeIcon({ name, ...props }: BadgeIconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) {
    return null; // or a default icon
  }
  return <IconComponent {...props} />;
}
