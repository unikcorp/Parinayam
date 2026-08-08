export const settingsNavItems = [
  { icon: "👤", label: "Profile settings" },
  { icon: "🔒", label: "Privacy & visibility" },
  { icon: "🔔", label: "Notifications" },
  { icon: "🚫", label: "Blocked users" },
  { icon: "🔑", label: "Password & security" },
  { icon: "★", label: "Membership & billing" },
  { icon: "⚠", label: "Account" },
];

export const visibilityToggles = [
  { key: "search", icon: "🔍", label: "Show my profile in search", mobileLabel: "Show in search", desc: "Verified members can find you in search results", defaultOn: true, mobile: true },
  { key: "online", icon: "🟢", label: "Show online status", mobileLabel: "Online status", desc: "Members can see when you’re active", defaultOn: true, mobile: true },
  { key: "lastActive", icon: "🕐", label: "Show last active time", mobileLabel: "Last active time", desc: "“Last active 5 min ago” on your profile", defaultOn: false, mobile: true },
  { key: "sharing", icon: "🔗", label: "Allow profile sharing", mobileLabel: "Profile sharing", desc: "Members can share your profile with family", defaultOn: true, mobile: false },
  { key: "contacts", icon: "📱", label: "Hide from contacts", mobileLabel: "Hide from contacts", desc: "Hide profile from phone contacts who join", defaultOn: false, mobile: true },
];

export const notificationMatrix = [
  { label: "New interest received", push: true, email: true, sms: true },
  { label: "Interest accepted", push: true, email: true, sms: false },
  { label: "New messages", push: true, email: false, sms: false },
  { label: "Weekly match digest", push: false, email: true, sms: false },
];

export const blockedUsers = [
  { initials: "RS", id: "PNM-2024-11893", when: "Blocked 12 May 2026" },
  { initials: "MK", id: "PNM-2023-07721", when: "Blocked 3 Feb 2026" },
];

export const mobileAccountItems = [
  { icon: "🔔", label: "Notification settings" },
  { icon: "🚫", label: "Blocked users", badge: "2" },
  { icon: "🔑", label: "Password & security" },
  { icon: "★", label: "Membership & billing", badge: "Premium" },
  { icon: "🌐", label: "Language", badge: "English" },
];
