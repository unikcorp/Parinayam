import type { Faq } from "@/types/content";

export const faqs: Faq[] = [
  {
    q: "How does photo privacy work?",
    a: "Your photos are hidden by default. When a member requests access you get a notification, and only members you approve can view them. You can revoke access anytime from Settings → Privacy.",
  },
  { q: "How do I get the verified badge?", a: "Complete ID verification and a live selfie match from Settings → Verification. Approved badges appear within 24 hours." },
  { q: "Can my parents manage my profile?", a: "Yes — choose “My daughter” or “My son” when creating a profile, and clearly label it as parent-managed." },
  { q: "What is the refund policy?", a: "Unused memberships can be refunded within 7 days of purchase. Visit Settings → Membership & billing to request one." },
  { q: "How is the AI match score calculated?", a: "We weigh preferences, horoscope compatibility, lifestyle answers and community match to produce a single compatibility score." },
  { q: "How do I report a suspicious profile?", a: "Open the profile, tap ⋯ and choose Report. Our trust & safety team reviews every report within a few hours." },
];
