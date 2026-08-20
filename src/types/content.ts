export interface SuccessStory {
  couple: string;
  when: string;
  place: string;
  quote: string;
  /** Real photo path (e.g. "/images/success1.jpg") — falls back to a placeholder when omitted. */
  image?: string;
}

export interface Testimonial {
  initials: string;
  name: string;
  meta: string;
  quote: string;
}

export interface BlogPost {
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
}

export interface BlogTeaserPost {
  tag: string;
  title: string;
  meta: string;
  /** Real photo path (e.g. "/images/success1.jpg") — falls back to a placeholder when omitted. */
  image?: string;
}

export interface Faq {
  q: string;
  a: string;
}
