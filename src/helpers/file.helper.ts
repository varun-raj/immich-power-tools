import { IDeviceAsset } from "@/types/asset"
import * as exifr from "exifr";
import * as MP4box from "mp4box";

export interface FileExifData {
  type: "image" | "video" | "unknown";
  width: number;
  height: number;
  dateTime: Date | null;
}

export async function getDeviceAssetData(file: File): Promise<IDeviceAsset> {
  if(file.type.startsWith("image/"))
    return extractImageData(file);
  else if(file.type.startsWith("video/"))
    return extractVideoData(file);
  else
    throw Error(`unsupported file type ${file.type}`);
}


async function extractImageData(file: File): Promise<IDeviceAsset> {
  try {
    const assetData = await extractImageExifData(file)
    if(assetData) return assetData;
  } catch {
    // ignore and fallback
  }

  return extractImageDomData(file)
}

async function extractImageExifData(file: File): Promise<IDeviceAsset | undefined> {
  const exif = await exifr.parse(file, [
    "ExifImageWidth",
    "ExifImageHeight",
    "ImageWidth",
    "ImageHeight",

    "DateTimeOriginal",
    "CreateDate",
    "ModifyDate",
  ]);

  const exifImageWidth = exif?.ExifImageWidth || exif?.ImageWidth || null;
  const exifImageHeight = exif?.ExifImageHeight || exif?.ImageHeight || null;
  const dateTimeOriginal = exif?.DateTimeOriginal || exif?.CreateDate || exif?.ModifyDate || new Date(file.lastModified)

  if (exifImageWidth && exifImageHeight) {
    return {
      file,
      previewUrl: URL.createObjectURL(file),
      checksum: await computeFileChecksum(file),
      type: "image",
      exifImageWidth,
      exifImageHeight,
      dateTimeOriginal,
    };
  }
}
async function extractImageDomData(file: File): Promise<IDeviceAsset> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = async () => {
      resolve({
        file,
        previewUrl: URL.createObjectURL(file),
        checksum: await computeFileChecksum(file),
        type: "image",
        exifImageWidth: img.naturalWidth,
        exifImageHeight: img.naturalHeight,
        dateTimeOriginal: new Date(file.lastModified)
      });

      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function extractVideoData(file: File): Promise<IDeviceAsset> {
  return new Promise((resolve) => {
    const mp4box = MP4box.createFile();
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as any;
      buffer.fileStart = 0;

      mp4box.onReady = async (info) => {
        resolve({
          file,
          previewUrl: await extractVideoThumbnail(file),
          videoURL: URL.createObjectURL(file),
          checksum: await computeFileChecksum(file),
          type: "video",
          exifImageHeight: info.videoTracks[0].track_height,
          exifImageWidth: info.videoTracks[0].track_width,
          dateTimeOriginal: info.created,
        })
      };

      mp4box.appendBuffer(buffer);
      mp4box.flush();
    };

    reader.readAsArrayBuffer(file);
  });
}

async function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not available");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return reject("Failed to create thumbnail blob");
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg", 0.85);
    };

    video.onerror = (e) => reject("Error loading video");
  });
}

export async function computeFileChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
  return [...new Uint8Array(hashBuffer)]
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");
};
