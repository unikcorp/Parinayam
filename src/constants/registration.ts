export const MAX_REGISTRATION_PHOTOS = 5;

// Minimum partner age enforced in the UI and in Zod validation.
// The rule is gender-based: if the registering member is male they
// can look for partners from 18; female members start from 21.
export const PARTNER_AGE_MIN_MALE = 18;
export const PARTNER_AGE_MIN_FEMALE = 21;

// Convenience helper used in places that need a single constant
// (e.g. initialising the form before gender is known).
export const PARTNER_AGE_MIN = PARTNER_AGE_MIN_FEMALE; // safe default
export const PARTNER_AGE_MAX = 55;
