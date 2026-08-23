import {
  ShieldCheck,
  Heart,
  Lock,
  Users,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface WhyParinayamFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const whyParinayamFeatures: WhyParinayamFeature[] = [
  { icon: ShieldCheck, title: "Verified profiles", desc: "Every ID and photo is reviewed by our team, and verified members carry a badge." },
  { icon: Heart, title: "Horoscope & preference matching", desc: "Add your birth star and rasi, and filter by the preferences that matter to you." },
  { icon: Lock, title: "Privacy first", desc: "Photos and contact details stay private until you choose to share them." },
  { icon: Users, title: "Community focused", desc: "Search and match by religion, caste and community — the way Kerala families do." },
  { icon: MessageCircle, title: "Secure communication", desc: "Private in-app chat — no personal number shared until you're ready." },
  { icon: Sparkles, title: "Real people, real support", desc: "Reach our team by live chat, call or WhatsApp whenever you need help." },
];

export const verifySteps = [
  { title: "Government ID verified", desc: "Aadhaar or passport checked against the profile name." },
  { title: "Photo reviewed", desc: "Every profile photo checked and approved by our team." },
  { title: "Community reviewed", desc: "Details cross-checked by our Kerala-based team." },
];
