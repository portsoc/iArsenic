const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function resizeImage(
    file: File,
    maxSize = 1280,
    quality = 0.85
): Promise<Blob> {
    const type = file.type;

    if (!VALID_IMAGE_TYPES.includes(type)) {
        throw new Error(`Unsupported image type: ${type}`);
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;

                // Maintain aspect ratio
                if (width > height && width > maxSize) {
                    height = Math.round(height * (maxSize / width));
                    width = maxSize;
                } else if (height > maxSize) {
                    width = Math.round(width * (maxSize / height));
                    height = maxSize;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("Failed to get canvas context");

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) return reject("Failed to create blob");
                    resolve(blob);
                }, type, quality);
            };

            img.onerror = () => reject("Failed to load image into canvas");
            img.src = reader.result as string;
        };

        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file);
    });
}
