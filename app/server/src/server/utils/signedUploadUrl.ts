import { getStorage } from 'firebase-admin/storage';

export default async function getSignedUploadUrl(
    destination: string,
    contentType: string,
    expiresInSeconds = 15 * 60 // default: 15 minutes
): Promise<string> {
    const bucket = getStorage().bucket();
    const file = bucket.file(destination);

    const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + expiresInSeconds * 1000,
        contentType,
    });

    return url;
}