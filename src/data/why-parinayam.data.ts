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
  { icon: ShieldCheck, title: "Verified profiles", desc: "Every profile manually reviewed by our team before going live." },
  { icon: Heart, title: "Family-friendly matchmaking", desc: "Parent-managed profiles and family involvement, every step of the way." },
  { icon: Lock, title: "Privacy first", desc: "Photos and contact details stay private until you choose to share them." },
  { icon: Users, title: "Community focused", desc: "Built for the Kerala community, with local context in every match." },
  { icon: MessageCircle, title: "Secure communication", desc: "Private in-app chat — no personal number shared until you're ready." },
  { icon: Sparkles, title: "Smart match recommendations", desc: "AI-assisted suggestions tuned by preference, horoscope and porutham." },
];

export const verifySteps = [
  { title: "Government ID verified", desc: "Aadhaar or passport checked against the profile name." },
  { title: "Phone & photo verified", desc: "OTP-confirmed number and a live selfie match." },
  { title: "Community reviewed", desc: "Details cross-checked by our Kerala-based team." },
];
