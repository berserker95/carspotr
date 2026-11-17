import { mockPrivacyDetector, mockRecognizer } from "@/lib/recognizer";
import type { RecognizeResponse } from "@/lib/types";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("photo");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing photo" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "Only JPEG, PNG or WebP" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Photo larger than 8 MB" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const [car, privacy] = await Promise.all([
    mockRecognizer.identify(bytes),
    mockPrivacyDetector.detect(bytes),
  ]);

  const body: RecognizeResponse = { car, privacy, engine: "mock" };
  return Response.json(body);
}
