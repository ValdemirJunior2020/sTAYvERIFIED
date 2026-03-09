// File: client/services/cloudinary.ts

import api from "./api";

type SignatureResponse = {
  ok: boolean;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

function getFileName(fileUri: string) {
  const cleanUri = fileUri.split("?")[0];
  const last = cleanUri.split("/").pop();
  return last || `proof-${Date.now()}.jpg`;
}

function getMimeType(fileUri: string) {
  const lower = fileUri.toLowerCase();

  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic")) return "image/heic";
  return "image/jpeg";
}

export async function uploadProofToCloudinary(fileUri: string) {
  const sigRes = await api.get<SignatureResponse>("/api/cloudinary/signature");
  const { cloudName, apiKey, timestamp, folder, signature } = sigRes.data;

  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: getFileName(fileUri),
    type: getMimeType(fileUri),
  } as any);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed.");
  }

  return {
    secure_url: data.secure_url as string,
    public_id: data.public_id as string,
  };
}