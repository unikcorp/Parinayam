export const REPORT_REASONS = [
  { value: "FAKE_PROFILE", label: "Fake profile / not a real person" },
  { value: "INAPPROPRIATE_PHOTOS", label: "Inappropriate photos" },
  { value: "HARASSMENT", label: "Harassment or abusive messages" },
  { value: "SPAM_OR_SCAM", label: "Spam or scam" },
  { value: "ALREADY_MARRIED", label: "Already married" },
  { value: "OTHER", label: "Other" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];
