export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/avif',
  'image/bmp',
  'image/tiff',
];

export function checkMimeType(mimeType: string = 'unknown') {
  return allowedMimeTypes.includes(mimeType || '');
}

export function checkFileSize(fileSize: number) {
  return fileSize <= MAX_FILE_SIZE;
}
