export interface CompressedImage {
  base64: string;
  mediaType: 'image/jpeg';
  previewUrl: string;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_DIM = 1280;
const MAX_INPUT_BYTES = 12 * 1024 * 1024;

export class ImageError extends Error {}

/**
 * Validate, downscale, and re-encode an image to JPEG on the client.
 * Keeps uploads small (cost/bandwidth) before sending to the AI endpoint.
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  if (!ALLOWED.includes(file.type)) {
    throw new ImageError('unsupported-type');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageError('too-large');
  }

  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ImageError('canvas-unavailable');
  ctx.drawImage(img, 0, 0, w, h);

  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.8);
  const base64 = jpegDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  return { base64, mediaType: 'image/jpeg', previewUrl: jpegDataUrl };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new ImageError('read-failed'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageError('decode-failed'));
    img.src = src;
  });
}
