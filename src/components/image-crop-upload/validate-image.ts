import { DEFAULT_ACCEPTED_TYPES, DEFAULT_MAX_FILE_SIZE_MB } from "./types"

export interface ValidateImageOptions {
  acceptedTypes?: string[]
  /** MB */
  maxFileSize?: number
}

function extensionLabel(mimeType: string): string {
  return mimeType.split("/")[1]?.toUpperCase() ?? mimeType
}

/** Returns a user-facing error message, or `null` if the file passes validation. */
export function validateImageFile(file: File, options: ValidateImageOptions = {}): string | null {
  const acceptedTypes = options.acceptedTypes ?? DEFAULT_ACCEPTED_TYPES
  const maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE_MB

  if (!acceptedTypes.includes(file.type)) {
    const allowed = acceptedTypes.map(extensionLabel).join(", ")
    return `Unsupported file type. Please upload ${allowed}.`
  }

  const maxBytes = maxFileSize * 1024 * 1024
  if (file.size > maxBytes) {
    return `File is too large. Maximum size is ${maxFileSize}MB.`
  }

  return null
}
