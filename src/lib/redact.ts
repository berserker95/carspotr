import type { Box } from "./types";

const MAX_SIDE = 1280;

/**
 * Blurs the given regions and re-encodes the image as JPEG.
 * Re-encoding through a canvas drops every EXIF field, GPS included.
 */
export async function redactImage(file: File, regions: Box[]): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, 0, 0, width, height);

  for (const r of regions) {
    const x = r.x * width;
    const y = r.y * height;
    const w = r.width * width;
    const h = r.height * height;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.filter = `blur(${Math.max(8, Math.round(h / 3))}px)`;
    ctx.drawImage(bitmap, 0, 0, width, height);
    ctx.restore();
  }

  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}
