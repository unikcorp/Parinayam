/**
 * White-label config: brand name, logo, and community strings.
 * Swapping this file (plus the color tokens in globals.css) rebrands the app for a new client.
 */
export const brand = {
  // name: "Parinayam",
  logoLetter: "P",
  tagline: "Where families begin forever",
  community: "Veluthedathu Nair",
  supportPhone: "+91 96339 44422",
  supportEmail: "[EMAIL_ADDRESS]",
  whatsapp: "+91 98470 12345",
} as const;

export type Brand = typeof brand;
