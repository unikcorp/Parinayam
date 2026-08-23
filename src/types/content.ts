export interface SuccessStory {
  /** Present for stories loaded from the admin CMS — used as a stable list key. */
  id?: number;
  couple: string;
  when: string;
  place: string;
  quote: string;
  /** Real photo path (e.g. "/images/success1.jpg") — falls back to a placeholder when omitted. */
  image?: string;
}

export interface Testimonial {
  /** Present for testimonials loaded from the admin CMS — used as a stable list key. */
  id?: number;
  initials: string;
  name: string;
  meta: string;
  quote: string;
  /** 1-5 — defaults to 5 stars when omitted. */
  rating?: number;
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
