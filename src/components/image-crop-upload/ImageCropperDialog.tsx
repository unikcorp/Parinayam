"use client";

import { useEffect, useState } from "react"
import Cropper from "react-easy-crop"
import { Loader2, RotateCw, ZoomIn } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useImageCropper } from "./use-image-cropper"
import type { CroppedImageResult } from "./types"

interface ImageCropperDialogProps {
  open: boolean
  imageSrc: string
  aspect: number
  shape: "round" | "rect"
  fileName: string
  onCancel: () => void
  onSave: (result: CroppedImageResult) => void
}

export default function ImageCropperDialog({
  open,
  imageSrc,
  aspect,
  shape,
  fileName,
  onCancel,
  onSave,
}: ImageCropperDialogProps) {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    croppedAreaPixels,
    onCropComplete,
    reset,
    hasCropArea,
    getCroppedResult,
  } = useImageCropper()

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Start every newly-opened image from a clean crop/zoom/rotation state.
  useEffect(() => {
    if (open) reset()
  }, [open, imageSrc, reset])

  // Live preview: regenerate the small thumbnail whenever the crop settles
  // (onCropComplete fires on drag/zoom end, not on every frame) or rotation changes.
  useEffect(() => {
    if (!croppedAreaPixels) return

    let cancelled = false
    let objectUrl: string | null = null

    getCroppedResult(imageSrc, fileName)
      .then((result) => {
        if (cancelled) {
          URL.revokeObjectURL(result.url)
          return
        }
        objectUrl = result.url
        setPreviewUrl(result.url)
      })
      .catch(() => {
        // A live-preview failure isn't fatal — Crop & Save will surface the real error.
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels, rotation, imageSrc, fileName])

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)
    try {
      const result = await getCroppedResult(imageSrc, fileName)
      onSave(result)
    } catch {
      setError("Could not process this image. Please try a different one.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !isSaving && onCancel()}>
      <DialogContent className="sm:max-w-lg" showCloseButton={!isSaving}>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
          <DialogDescription>Drag to reposition, use the sliders to zoom or rotate, then save.</DialogDescription>
        </DialogHeader>

        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted sm:h-80">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            cropShape={shape}
            showGrid={shape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "h-20 w-20 shrink-0 overflow-hidden border border-border bg-muted",
              shape === "round" ? "rounded-full" : "rounded-lg",
            )}
            aria-hidden="true"
          >
            {previewUrl && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <ZoomIn className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Label htmlFor="crop-zoom" className="sr-only">
                Zoom
              </Label>
              <Slider
                id="crop-zoom"
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={(v) => setZoom(Array.isArray(v) ? v[0] : v)}
                aria-label="Zoom"
              />
            </div>

            <div className="flex items-center gap-3">
              <RotateCw className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Label htmlFor="crop-rotation" className="sr-only">
                Rotation
              </Label>
              <Slider
                id="crop-rotation"
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(v) => setRotation(Array.isArray(v) ? v[0] : v)}
                aria-label="Rotation"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <DialogFooter className="items-center sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={isSaving}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving || !hasCropArea}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                "Crop & Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
