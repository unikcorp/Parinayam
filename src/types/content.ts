export interface SuccessStory {
  couple: string;
  when: string;
  place: string;
  quote: string;
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
}

export interface Faq {
  q: string;
  a: string;
}
