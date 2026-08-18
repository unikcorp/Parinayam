import { Eye, ImageOff, ShieldCheck, LockKeyhole, UserCheck, Flag, type LucideIcon } from "lucide-react";

export interface PrivacyFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const privacyFeatures: PrivacyFeature[] = [
  { icon: Eye, title: "Profile privacy controls", desc: "Choose exactly who can view your full profile — members, premium members, or nobody until you accept an interest." },
  { icon: ImageOff, title: "Photo visibility controls", desc: "Blur your photos from public search and reveal them only to profiles you've approved." },
  { icon: ShieldCheck, title: "Verified profiles", desc: "Every member is ID and photo verified before their profile goes live." },
  { icon: LockKeyhole, title: "Secure communication", desc: "Chat and calls happen in-app — your phone number stays private until you choose to share it." },
  { icon: UserCheck, title: "Admin approval", desc: "Our Kerala-based team reviews every profile and photo change before it's published." },
  { icon: Flag, title: "Report & block", desc: "Report or block any profile in one tap — our team acts on every report within 24 hours." },
];
