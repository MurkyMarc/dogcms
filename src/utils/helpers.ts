import { ChangeEvent } from 'react';
import { v4 as uuid } from 'uuid';

export const generateFilePath = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.')
    }

    const file = event.target.files[0];
    const filePath = `${uuid()}`;
    return { file, filePath };
}

export async function processImage(file: Blob) {
    const img = document.createElement('img');
    const reader = new FileReader();

    // Promise to load the file
    const fileLoaded = new Promise<void>((resolve, reject) => {
        reader.onload = function (e) {
            if (e.target && typeof e.target.result === 'string') {
                img.src = e.target.result;
                resolve();
            } else {
                reject(new Error('File load error: result is null or not a string.'));
            }
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });

    reader.readAsDataURL(file);

    // Wait for the image file to load
    await fileLoaded;

    // Promise to load the image into the img element
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image loading error'));
    });

    // Determine the smallest dimension to make the image square
    const minDimension = Math.min(img.width, img.height);

    // Dynamically adjust quality based on multiple criteria
    const quality = calculateDynamicQuality(img.width, img.height, file.size);

    // Pre-scale images if necessary
    const scale = minDimension > 512 ? 512 / minDimension : 1;

    // Canvas to hold the processed image
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = minDimension * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get the canvas context');
    }

    ctx.fillStyle = 'white';
    // Draw the image centered and cropped to square
    ctx.drawImage(
        img,
        (img.width - minDimension) / 2 * scale,
        (img.height - minDimension) / 2 * scale,
        minDimension * scale,
        minDimension * scale,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Convert and compress the image to WebP
    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Image processing failed'));
            }
        }, 'image/webp', quality);
    });
}

function calculateDynamicQuality(width: number, height: number, fileSize: number): number {
    let quality = 0.75; // Default quality

    // Adjust quality based on image dimensions
    const largeDimensionThreshold = 512;
    if (width > largeDimensionThreshold || height > largeDimensionThreshold) {
        quality -= 0.1;
    }

    // Further adjust based on file size
    const largeFileThreshold = 1 * 1024 * 1024; // 1MB
    if (fileSize > largeFileThreshold) {
        quality -= 0.1;
    }

    // Ensure quality stays within acceptable range
    quality = Math.max(0.1, Math.min(quality, 0.9));

    return quality;
}

export function fileTypeSupported(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files) throw new Error("Error uploading your file");
    const file = event.target.files[0];
    const fileType = file.type;

    const allowedTypes = ["image/jpeg", "image/png", "image/heif", "image/heic", "image/webp"];

    if (allowedTypes.includes(fileType)) {
        return true;
    }
    return false;
}