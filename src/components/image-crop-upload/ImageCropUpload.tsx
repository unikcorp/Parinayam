"use client";

import { useEffect, useRef, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ImageCropperDialog from "./ImageCropperDialog"
import { validateImageFile } from "./validate-image"
import { DEFAULT_ACCEPTED_TYPES, DEFAULT_MAX_FILE_SIZE_MB } from "./types"
import type { CroppedImageResult, ImageCropUploadProps, ImageCropUploadValue } from "./types"

function resolvePreviewUrl(value: ImageCropUploadValue): string | null {
  if (!value) return null
  return typeof value === "string" ? value : value.url
}

/** Strips any existing extension and appends `.jpg`, since crops are always re-encoded as JPEG. */
function toCroppedFileName(originalName: string): string {
  return `${originalName.replace(/\.[^./]+$/, "")}.jpg`
}

/**
 * A reusable "pick an image, crop it, keep only the crop" control.
 *
 * @example
 * <ImageCropUpload value={image} onChange={setImage} aspect={1} maxFileSize={10} />
 */
export default function ImageCropUpload({
  value,
  onChange,
  aspect = 1,
  maxFileSize = DEFAULT_MAX_FILE_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  shape = aspect === 1 ? "round" : "rect",
  label = "Upload Image",
  disabled = false,
  className,
}: ImageCropUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [pendingFileName, setPendingFileName] = useState("cropped-image.jpg")
  const [error, setError] = useState<string | null>(null)

  const previewUrl = resolvePreviewUrl(value)

  // The source image is only ever a transient object URL for the dialog —
  // always revoke it once we're done with it, on close or on unmount.
  useEffect(() => {
    return () => {
      if (sourceImage) URL.revokeObjectURL(sourceImage)
    }
  }, [sourceImage])

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleFileSelect = (fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return

    const validationError = validateImageFile(file, { acceptedTypes, maxFileSize })
    if (validationError) {
      setError(validationError)
      // still reset the input so re-selecting the same (invalid) file re-triggers validation
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    setError(null)
    setPendingFileName(toCroppedFileName(file.name))
    setSourceImage(URL.createObjectURL(file))
    if (inputRef.current) inputRef.current.value = ""
  }

  const closeDialog = () => {
    if (sourceImage) URL.revokeObjectURL(sourceImage)
    setSourceImage(null)
  }

  const handleSave = (result: CroppedImageResult) => {
    onChange(result)
    closeDialog()
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        className="hidden"
        onChange={(event) => handleFileSelect(event.target.files)}
        disabled={disabled}
      />

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-dashed border-input bg-muted text-muted-foreground",
            shape === "round" ? "rounded-full" : "rounded-lg",
          )}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Selected" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" size="sm" onClick={openFilePicker} disabled={disabled}>
            <Upload className="h-4 w-4" />
            {label}
          </Button>
          {previewUrl && (
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={disabled}>
              <X className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {sourceImage && (
        <ImageCropperDialog
          open
          imageSrc={sourceImage}
          aspect={aspect}
          shape={shape}
          fileName={pendingFileName}
          onCancel={closeDialog}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
