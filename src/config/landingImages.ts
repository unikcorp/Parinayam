/**
 * Stable image references for the landing page hero collage and marketing
 * sections. These are local placeholders (client/public) — every homepage
 * slot is admin-overridable (Site Settings > Home Page Banner), so nothing
 * here hotlinks an external image API/CDN.
 */
const localPhoto = (src: string, alt: string) => ({ id: src, regular: src, small: src, alt });

export const heroCollageImages = {
  /** Large portrait/landscape image, top-right of the collage. */
  main: localPhoto("/photos/couple.jpg", "Couple photo"),
  /** Overlapping couple/outdoor image. */
  secondary: localPhoto("/photos/couple.jpg", "Couple photo"),
  /** Wide family/friends/social gathering image, lower-middle. */
  gathering: localPhoto("/photos/couple.jpg", "Couple photo"),
  /** Small wedding/celebration image, bottom-right. */
  celebration: localPhoto("/photos/couple.jpg", "Couple photo"),
  /** Optional small portrait tucked behind the collage. */
  portrait: localPhoto("/images/women.png", "Portrait"),
};

export const privacyImage = localPhoto("/photos/couple.jpg", "Your privacy comes first");
