import { getStorage } from 'firebase-admin/storage';

export async function deleteFileFromBucket(path: string): Promise<void> {
    const bucket = getStorage().bucket();
    const file = bucket.file(path);

    const [exists] = await file.exists();
    if (!exists) {
        throw new Error(`File not found: ${path}`);
    }

    await file.delete();
}
