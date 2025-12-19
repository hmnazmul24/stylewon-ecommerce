import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "ddyrlplxn",
  api_key: "421831774123297",
  api_secret: "PLgbuuVNAAYmMUZYwZXsn_OmnkQ",
});

export async function convertToBase64(file: File) {
  // ❗ Convert File → base64 data URL string
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.type;
  const dataUrl = `data:${mimeType};base64,${base64}`;
  return dataUrl;
}

export async function uploadToCloude(file: File) {
  const base64String = await convertToBase64(file);
  const result = await cloudinary.uploader.upload(base64String);
  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}
export async function deleteFromCloude(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
