import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';

export const generateFilePath = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0];
    const fileParts = file.name.split(".");
    const fileType = fileParts[fileParts.length - 1];
    const filePath = `${uuid()}.${fileType}`;
    return { file, filePath };
}

export const generateRandomFileName = (fileExt: string) => {
    return `${uuid()}.${fileExt}`;
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
    if (!event.target?.files) return
    if (event.target.files?.length > 1) throw new Error("Please only select one file");

    const file = event.target.files[0];
    const fileType = file.type;
    const allowedTypes = ["image/jpeg", "image/png", "image/heif", "image/heic", "image/webp"];

    if (!allowedTypes.includes(fileType)) {
        throw new Error("Only PNG, JPEG, HEIF, HEIC, and WebP files are allowed");
    }

    // Todo - add a filesize check? and other checks like making sure they only select on image etc
    return true
}

export function phoneFormat(input: string) {
    input = input.replace(/\D/g, '');
    const size = input.length;
    if (size > 0) { input = "(" + input }
    if (size > 3) { input = input.slice(0, 4) + ") " + input.slice(4, 11) }
    if (size > 6) { input = input.slice(0, 9) + "-" + input.slice(9) }
    return input;
}

export function loadingToast() {
    toast("Loading...", {
        cancel: {
            label: "Dismiss",
            onClick: () => { },
        },
        duration: 2000
    })
}

export function successToast(message: string) {
    toast.success(message, {
        cancel: {
            label: 'Dismiss',
            onClick: () => { },
        }
    })
}

export function errorToast(error: unknown) {
    toast.error((error as Error).message, {
        cancel: {
            label: 'Dismiss',
            onClick: () => { },
        }
    })
}

export const zipRegex = new RegExp(
    // allow the value to be 10000-11999 or 12000
    /^1[01]\d{3}$|^12000$/
);

export const phoneRegex = new RegExp(
    /^([\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const timeOptions = [
    { name: '6:00 AM', value: '06:00:00' },
    { name: '6:15 AM', value: '06:15:00' },
    { name: '6:30 AM', value: '06:30:00' },
    { name: '6:45 AM', value: '06:45:00' },
    { name: '7:00 AM', value: '07:00:00' },
    { name: '7:15 AM', value: '07:15:00' },
    { name: '7:30 AM', value: '07:30:00' },
    { name: '7:45 AM', value: '07:45:00' },
    { name: '8:00 AM', value: '08:00:00' },
    { name: '8:15 AM', value: '08:15:00' },
    { name: '8:30 AM', value: '08:30:00' },
    { name: '8:45 AM', value: '08:45:00' },
    { name: '9:00 AM', value: '09:00:00' },
    { name: '9:15 AM', value: '09:15:00' },
    { name: '9:30 AM', value: '09:30:00' },
    { name: '9:45 AM', value: '09:45:00' },
    { name: '10:00 AM', value: '10:00:00' },
    { name: '10:15 AM', value: '10:15:00' },
    { name: '10:30 AM', value: '10:30:00' },
    { name: '10:45 AM', value: '10:45:00' },
    { name: '11:00 AM', value: '11:00:00' },
    { name: '11:15 AM', value: '11:15:00' },
    { name: '11:30 AM', value: '11:30:00' },
    { name: '11:45 AM', value: '11:45:00' },
    { name: '12:00 PM', value: '12:00:00' },
    { name: '12:15 PM', value: '12:15:00' },
    { name: '12:30 PM', value: '12:30:00' },
    { name: '12:45 PM', value: '12:45:00' },
    { name: '1:00 PM', value: '13:00:00' },
    { name: '1:15 PM', value: '13:15:00' },
    { name: '1:30 PM', value: '13:30:00' },
    { name: '1:45 PM', value: '13:45:00' },
    { name: '2:00 PM', value: '14:00:00' },
    { name: '2:15 PM', value: '14:15:00' },
    { name: '2:30 PM', value: '14:30:00' },
    { name: '2:45 PM', value: '14:45:00' },
    { name: '3:00 PM', value: '15:00:00' },
    { name: '3:15 PM', value: '15:15:00' },
    { name: '3:30 PM', value: '15:30:00' },
    { name: '3:45 PM', value: '15:45:00' },
    { name: '4:00 PM', value: '16:00:00' },
    { name: '4:15 PM', value: '16:15:00' },
    { name: '4:30 PM', value: '16:30:00' },
    { name: '4:45 PM', value: '16:45:00' },
    { name: '5:00 PM', value: '17:00:00' },
    { name: '5:15 PM', value: '17:15:00' },
    { name: '5:30 PM', value: '17:30:00' },
    { name: '5:45 PM', value: '17:45:00' },
    { name: '6:00 PM', value: '18:00:00' },
    { name: '6:15 PM', value: '18:15:00' },
    { name: '6:30 PM', value: '18:30:00' },
    { name: '6:45 PM', value: '18:45:00' },
    { name: '7:00 PM', value: '19:00:00' },
    { name: '7:15 PM', value: '19:15:00' },
    { name: '7:30 PM', value: '19:30:00' },
    { name: '7:45 PM', value: '19:45:00' },
    { name: '8:00 PM', value: '20:00:00' },
    { name: '8:15 PM', value: '20:15:00' },
    { name: '8:30 PM', value: '20:30:00' },
    { name: '8:45 PM', value: '20:45:00' },
    { name: '9:00 PM', value: '21:00:00' }
]

export const durationOptions = [
    { name: '15 minutes', value: '15' },
    { name: '30 minutes', value: '30' },
    { name: '45 minutes', value: '45' },
    { name: '60 minutes', value: '60' }
]

export function calculateEndTime(timeOption: string, duration: string) {
    const [hour, minute] = timeOption.split(':'); // Split the time option into hour and minute
    const durationInMinutes = parseInt(duration, 10); // Convert duration to a number

    // Create a date object starting at today's date but with specified hour and minute
    const startTime = new Date();
    startTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0); // Reset seconds and milliseconds to 0

    // Add duration to the startTime
    startTime.setMinutes(startTime.getMinutes() + durationInMinutes);

    // Format the new time in 'hh:mm:ss'
    const hours = startTime.getHours().toString().padStart(2, '0');
    const minutes = startTime.getMinutes().toString().padStart(2, '0');
    const seconds = startTime.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export function formatTimeToAmPm(timeString: string) {
    // Split the time string into components
    const [hours, minutes] = timeString.split(':');

    // Convert hours to integer to determine AM or PM
    let hoursInt = parseInt(hours, 10);

    // Determine the suffix and adjust hours for 12-hour format
    const suffix = hoursInt >= 12 ? 'PM' : 'AM';
    hoursInt = hoursInt % 12;
    hoursInt = hoursInt === 0 ? 12 : hoursInt; // Adjust for 12-hour format, change 0 to 12 for readability

    // Format the minutes to ensure two digits
    const formattedMinutes = minutes.padStart(2, '0');

    return `${hoursInt}:${formattedMinutes} ${suffix}`;
}

export function getTodaysDate() {
    // returns todays date in the format YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getNextWeekDate(date: Date) {
    // returns the date of the next week in the format YYYY-MM-DD
    const nextWeek = new Date(date);
    nextWeek.setDate(date.getDate() + 7);

    const year = nextWeek.getFullYear();
    const month = (nextWeek.getMonth() + 1).toString().padStart(2, '0');
    const day = nextWeek.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getNextMonthDate(date: Date) {
    // returns the date of the next month in the format YYYY-MM-DD
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);

    const year = nextMonth.getFullYear();
    const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0');
    const day = nextMonth.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatMonthDay(dateString: string) {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate() + 1;
    return `${month} ${day}`;
}

export function selectRandomBackgroundColor() {
    const colors = [
        '#FFADAD',
        '#FFD6A5',
        '#FDFFB6',
        '#CAFFBF',
        '#9BF6FF',
        '#A0C4FF',
        '#BDB2FF',
        '#FFC6FF'
    ]

    return colors[Math.floor(Math.random() * colors.length)];
}

export function timeDifference(start: string, end: string) {
    const [startHours, startMinutes] = start.split(':').slice(0, 2).map(Number);
    const [endHours, endMinutes] = end.split(':').slice(0, 2).map(Number);

    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;

    const timeDiff = endTime - startTime;

    return `${timeDiff}`;
}

export function parseDateStringToUTC(dateString: string) {
    return new Date(
        parseInt(dateString.slice(0, 4)), // year
        parseInt(dateString.slice(5, 7)) - 1, // month (0 indexed)
        parseInt(dateString.slice(8, 10)) // day
    );
}

export function getArrayDifferences(array1: number[], array2: number[]) {
    return {
        added: array2.filter(item => !array1.includes(item)),
        removed: array1.filter(item => !array2.includes(item))
    }
}