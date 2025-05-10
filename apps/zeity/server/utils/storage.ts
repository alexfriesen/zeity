import { S3Client } from '@bradenmacdonald/s3-lite-client';

let storage: S3Client | null = null;

function getStorage() {
  if (storage) {
    return storage;
  }

  const { s3 } = useRuntimeConfig();
  storage ??= new S3Client(s3);
  return storage;
}

export async function readStorageFile(
  key: string
): Promise<{ data: Blob; type: string } | null> {
  const storage = getStorage();
  const raw = await storage.getObject(key);

  if (!raw) {
    return null;
  }

  return { data: await raw.blob(), type: raw.type };
}

export function saveStorageFile(
  key: string,
  file: { name: string; type: string; data: Buffer }
) {
  const storage = getStorage();
  return storage.putObject(key, file.data, {
    size: file.data.byteLength,
    metadata: {
      'Content-Type': file.type,
    },
  });
}

export function removeStorageFile(key: string) {
  const storage = getStorage();
  return storage.deleteObject(key);
}
