// File: src/lib/uploads/cloudinary-image-upload.ts

/**
 * Optional Cloudinary image-upload helper.
 *
 * This helper is intentionally not connected to profile-image or document
 * uploads. Those workflows use the authenticated Asancha document endpoints.
 * Keep this function available only for a future explicitly approved public
 * image-upload workflow.
 */

interface CloudinaryUploadResponse {
  secure_url: string;
}

function isCloudinaryUploadResponse(
  value: unknown,
): value is CloudinaryUploadResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CloudinaryUploadResponse).secure_url === "string"
  );
}

/**
 * Uploads an image to the configured Cloudinary unsigned-upload endpoint.
 *
 * Do not use this helper for profile images, verification files, or documents.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ?? "";

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary image upload is not configured.");
  }

  const formData = new FormData();
  formData.set("file", file, file.name);
  formData.set("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  const responseBody = (await response.json().catch(() => null)) as unknown;

  if (!response.ok || !isCloudinaryUploadResponse(responseBody)) {
    throw new Error("Cloudinary image upload failed.");
  }

  return responseBody.secure_url;
}
