import { getStorage } from 'firebase-admin/storage';

export default async function(
    action: 'read' | 'write',
    destination: string,
    contentType?: string,
    expiresInSeconds = 15 * 60 // 15 minutes
): Promise<string> {
    const bucket = getStorage().bucket();
    const file = bucket.file(destination);

    const options: any = {
        version: 'v4',
        action,
        expires: Date.now() + expiresInSeconds * 1000,
    };

    if (action === 'write') {
        options.contentType = contentType;
    }

    const [url] = await file.getSignedUrl(options);
    return url;
}
