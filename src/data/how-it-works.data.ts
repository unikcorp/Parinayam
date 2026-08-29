import { FileText, ShieldCheck, Heart, MessageCircle, type LucideIcon } from "lucide-react";

export interface HowItWorksStep {
  icon: LucideIcon;
  tint: string;
  title: string;
  desc: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    icon: FileText,
    tint: "bg-surface-blue text-primary",
    title: "Create your profile",
    desc: "Tell us about yourself, your family and what matters to you.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-success-bg text-success",
    title: "Get verified",
    desc: "A quick ID check earns your badge and unlocks full search.",
  },
  {
    icon: Heart,
    tint: "bg-peach-bg text-peach-text",
    title: "Discover matches",
    desc: "Search and filter profiles by preference, horoscope and family values.",
  },
  {
    icon: MessageCircle,
    tint: "bg-surface-cream-2 text-gold-text",
    title: "Connect & meet",
    desc: "Express interest and chat privately with the profiles you connect with.",
  },
];
