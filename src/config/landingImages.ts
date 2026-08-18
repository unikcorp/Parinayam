/**
 * Stable image references for the landing page hero collage and marketing
 * sections. Pulled from the curated, pre-fetched dataset in
 * `src/data/stock-photos.ts` (hotlink-safe CDN URLs, regenerate via
 * `scripts/fetch-stock-photos.mjs`) so the layout never shifts between
 * renders and no image URL is generated on the fly.
 */
import { avatarPhotos, scenePhotos } from "@/data/stock-photos";

export const heroCollageImages = {
  /** Large portrait/landscape image, top-right of the collage. */
  main: scenePhotos[3],
  /** Overlapping couple/outdoor image. */
  secondary: scenePhotos[20],
  /** Wide family/friends/social gathering image, lower-middle. */
  gathering: scenePhotos[5],
  /** Small wedding/celebration image, bottom-right. */
  celebration: scenePhotos[10],
  /** Optional small portrait tucked behind the collage. */
  portrait: avatarPhotos.women[8],
};

export const privacyImage = scenePhotos[9];
