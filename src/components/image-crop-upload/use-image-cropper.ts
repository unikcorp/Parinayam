import { useCallback, useState } from "react"
import type { Area, Point } from "react-easy-crop"
import { getCroppedImage } from "./crop-image"
import type { CroppedImageResult } from "./types"

const INITIAL_CROP: Point = { x: 0, y: 0 }
const INITIAL_ZOOM = 1
const INITIAL_ROTATION = 0

/** All the interactive crop/zoom/rotate state for one open cropper session. */
export function useImageCropper() {
  const [crop, setCrop] = useState<Point>(INITIAL_CROP)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [rotation, setRotation] = useState(INITIAL_ROTATION)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const reset = useCallback(() => {
    setCrop(INITIAL_CROP)
    setZoom(INITIAL_ZOOM)
    setRotation(INITIAL_ROTATION)
    setCroppedAreaPixels(null)
  }, [])

  const getCroppedResult = useCallback(
    (imageSrc: string, fileName?: string): Promise<CroppedImageResult> => {
      if (!croppedAreaPixels) return Promise.reject(new Error("No crop area selected yet"))
      return getCroppedImage(imageSrc, croppedAreaPixels, { rotation, fileName })
    },
    [croppedAreaPixels, rotation],
  )

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    croppedAreaPixels,
    onCropComplete,
    reset,
    hasCropArea: croppedAreaPixels !== null,
    getCroppedResult,
  }
}
