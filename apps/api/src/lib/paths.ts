import { fileURLToPath } from 'node:url';

// Local image storage dir (served at /uploads). Resolves correctly for both
// tsx (src/) and built (dist/) layouts since both sit one level under apps/api.
export const uploadsDir = fileURLToPath(new URL('../../uploads/', import.meta.url));

export function publicUploadUrl(host: string, protocol: string, filename: string): string {
  return `${protocol}://${host}/uploads/${filename}`;
}
