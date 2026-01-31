import { cloudinary } from "@/lib/cloudinary";
import type { IImage } from "@/database/product.model";

// Constants relating to maximum allowed file size uploads per product
const MB_SIZE = 1024 * 1024;

const MAX_FILE_SIZE_MB = 7;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * MB_SIZE;

const MAX_TOTAL_SIZE_MB = 15;
const MAX_TOTAL_SIZE = MAX_TOTAL_SIZE_MB * MB_SIZE;

const MAX_FILES = 5;

/**
 * Processes uploaded images to Cloudinary
 * @param files Array of File objects from FormData
 */
export const processProductImages = async (
  files: File[],
): Promise<IImage[]> => {
  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<IImage>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "EdMarket",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));

          resolve({
            url: result.secure_url,
            filename: result.public_id,
            size: result.bytes,
          });
        },
      );

      uploadStream.end(buffer);
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * Validates uploaded images based on max file size and total file size limit
 * @param initNoFiles
 * @param initFileSizes
 */
export const validateImages = (
  files: File[],
  initNoFiles: number,
  initFileSizes: number,
) => {
  // Validates that there exists at least one file uploaded
  if (files.length + initNoFiles < 0) {
    return { message: `Need at least one image` };
  }
  // Validates that total no of files doesn't exceed max
  if (files.length + initNoFiles > MAX_FILES) {
    return {
      message: `Only ${MAX_FILES} are allowed to be uploaded in total`,
    };
  }

  let totalSize = initFileSizes;
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      // Checks each file size is under max file size
      return {
        message: `File "${file.name}" is too large (Max ${MAX_FILE_SIZE_MB}MB).`,
      };
    }
    totalSize += file.size;
  }

  // Validates that total size doesn't exceed max total size
  if (totalSize > MAX_TOTAL_SIZE) {
    return {
      message: `Total size exceeds limit of ${MAX_TOTAL_SIZE_MB}MB.`,
    };
  }

  return true;
};
