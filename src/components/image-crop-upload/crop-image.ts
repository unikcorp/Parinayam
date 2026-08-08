import type { Area } from "react-easy-crop"
import type { CroppedImageResult } from "./types"

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (event) => reject(event))
    image.crossOrigin = "anonymous"
    image.src = url
  })
}

function getRadianAngle(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/** Bounding box of `width`x`height` once rotated by `rotation` degrees. */
function getRotatedBoundingBox(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export interface GetCroppedImageOptions {
  rotation?: number
  fileName?: string
  mimeType?: string
  /** 0-1, only applies to lossy formats like image/jpeg and image/webp. */
  quality?: number
}

/**
 * Crops `imageSrc` down to `pixelCrop` (as reported by react-easy-crop's
 * `onCropComplete`), applying `rotation` first, entirely on the client via
 * two canvases: one to rotate the full image without clipping it, one to
 * lift out just the crop rectangle at native resolution.
 */
export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  options: GetCroppedImageOptions = {},
): Promise<CroppedImageResult> {
  const { rotation = 0, fileName = "cropped-image.jpg", mimeType = "image/jpeg", quality = 0.92 } = options

  const image = await createImage(imageSrc)
  const rotRad = getRadianAngle(rotation)
  const { width: boxWidth, height: boxHeight } = getRotatedBoundingBox(image.width, image.height, rotation)

  const rotateCanvas = document.createElement("canvas")
  rotateCanvas.width = boxWidth
  rotateCanvas.height = boxHeight
  const rotateCtx = rotateCanvas.getContext("2d")
  if (!rotateCtx) throw new Error("Could not get a 2D canvas context")

  rotateCtx.translate(boxWidth / 2, boxHeight / 2)
  rotateCtx.rotate(rotRad)
  rotateCtx.translate(-image.width / 2, -image.height / 2)
  rotateCtx.drawImage(image, 0, 0)

  const cropCanvas = document.createElement("canvas")
  cropCanvas.width = pixelCrop.width
  cropCanvas.height = pixelCrop.height
  const cropCtx = cropCanvas.getContext("2d")
  if (!cropCtx) throw new Error("Could not get a 2D canvas context")

  cropCtx.drawImage(
    rotateCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  const blob = await new Promise<Blob | null>((resolve) => cropCanvas.toBlob(resolve, mimeType, quality))
  if (!blob) throw new Error("Failed to generate the cropped image")

  const file = new File([blob], fileName, { type: mimeType })
  const url = URL.createObjectURL(blob)

  return { file, blob, url }
}
