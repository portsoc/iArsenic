import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'iarsenic-stagings-storage';

export default async function uploadFileToBucket(
    file: Buffer, 
    destination: string, 
    mimetype: string,
) {
    const bucket = storage.bucket(bucketName);
    const fileRef = bucket.file(destination);
    await fileRef.save(file, {
        metadata: {
            contentType: mimetype,
        },
        resumable: false,
    });
    await fileRef.makePublic();
    return fileRef.publicUrl();
}
