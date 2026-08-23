import { Eye, ImageOff, ShieldCheck, LockKeyhole, UserCheck, Flag, type LucideIcon } from "lucide-react";

export interface PrivacyFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const privacyFeatures: PrivacyFeature[] = [
  { icon: Eye, title: "Profile privacy controls", desc: "Choose exactly who can view your full profile — members, premium members, or nobody until you accept an interest." },
  { icon: ImageOff, title: "Photo visibility controls", desc: "Blur your photos from public search and reveal them only to profiles you've approved." },
  { icon: ShieldCheck, title: "Verified profiles", desc: "Every member's ID is reviewed by our team, and verified profiles carry a visible badge." },
  { icon: LockKeyhole, title: "Secure communication", desc: "Chat happens in-app — your phone number stays private until you choose to share it." },
  { icon: UserCheck, title: "Admin approval", desc: "Our Kerala-based team reviews every profile photo before it appears on your profile." },
  { icon: Flag, title: "Report & block", desc: "Report or block any profile — our team reviews every report you submit." },
];
