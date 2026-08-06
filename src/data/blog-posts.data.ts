import type { BlogPost, BlogTeaserPost } from "@/types/content";

export const blogCategories = ["All", "Tradition", "Advice", "Safety", "Weddings", "For parents"];

// Full article list shown on /blog.
export const blogPosts: BlogPost[] = [
  { tag: "Weddings", title: "A Guruvayur wedding checklist, from muhurtham to sadhya", excerpt: "Everything Kerala families plan in the 90 days before the big day.", meta: "7 min read · Jan 2026" },
  { tag: "Advice", title: "Writing a profile bio that sounds like you", excerpt: "Skip the clichés. Three prompts that make bios feel human.", meta: "4 min read · Jan 2026" },
  { tag: "Tradition", title: "What the 10 poruthams actually mean", excerpt: "An astrologer explains each compatibility check in plain language.", meta: "8 min read · Dec 2025" },
  { tag: "Safety", title: "Five signs of a suspicious profile", excerpt: "What our trust & safety team looks for — and what you should too.", meta: "3 min read · Dec 2025" },
  { tag: "Advice", title: "Long-distance to lifelong: NRI matches that worked", excerpt: "How three couples bridged time zones before bridging families.", meta: "6 min read · Nov 2025" },
  { tag: "For parents", title: "When to step back: letting your child lead the search", excerpt: "A counsellor on balancing involvement with independence.", meta: "5 min read · Nov 2025" },
];

// Sidebar teaser posts next to the featured article on /blog.
export const sideBlogPosts: BlogTeaserPost[] = [
  { tag: "Advice", title: "The first family meeting: questions worth asking", meta: "4 min read · Dec 2025" },
  { tag: "Safety", title: "How we verify every profile on Parinayam", meta: "3 min read · Dec 2025" },
  { tag: "For parents", title: "Managing your child’s profile — respectfully", meta: "5 min read · Nov 2025" },
];

// Homepage "From the blog" teaser.
export const homeBlogPosts: BlogTeaserPost[] = [
  { tag: "Tradition", title: "Understanding porutham: a modern guide to horoscope matching", meta: "6 min read · Jan 2026" },
  { tag: "Advice", title: "The first family meeting: questions worth asking", meta: "4 min read · Dec 2025" },
  { tag: "Safety", title: "How we verify every profile on Parinayam", meta: "3 min read · Dec 2025" },
];
