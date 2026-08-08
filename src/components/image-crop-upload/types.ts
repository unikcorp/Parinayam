/** The only thing that ever leaves this component — the cropped output, never the original file. */
export interface CroppedImageResult {
  file: File
  blob: Blob
  /** Object URL for the cropped blob — remember to revoke it when you're done displaying it. */
  url: string
}

/**
 * What the component can render as "the current image":
 * - a `CroppedImageResult` produced by this component earlier in the session
 * - a plain URL string (e.g. an existing photo already saved on the server)
 * - `null` / `undefined` when there's nothing selected yet
 */
export type ImageCropUploadValue = CroppedImageResult | string | null | undefined

export interface ImageCropUploadProps {
  /** Controlled value — render either an existing server URL or a previous crop result. */
  value?: ImageCropUploadValue
  /** Called with the freshly cropped result, or `null` when the user removes the image. */
  onChange: (result: CroppedImageResult | null) => void
  /** Crop aspect ratio (width / height). 1 = square, 16/9 = widescreen, 4/5 = portrait. */
  aspect?: number
  /** Maximum accepted file size, in MB. */
  maxFileSize?: number
  /** Accepted MIME types for the source file picker. */
  acceptedTypes?: string[]
  /** Visual crop shape. Defaults to 'round' for square aspect ratios, 'rect' otherwise. */
  shape?: "round" | "rect"
  /** Label for the trigger button. */
  label?: string
  disabled?: boolean
  className?: string
}

export const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const DEFAULT_MAX_FILE_SIZE_MB = 10
