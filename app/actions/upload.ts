"use server";

import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import { revalidatePath } from "next/cache";

const STORAGE_LIMIT_BYTES = 9.5 * 1024 * 1024 * 1024; // 9.5 GB

async function getTotalStorageBytes(): Promise<number> {
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) return 0;

    let totalBytes = 0;
    let continuationToken: string | undefined;

    do {
      const cmd = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      });
      const result = await r2Client.send(cmd);
      for (const obj of result.Contents || []) {
        totalBytes += obj.Size || 0;
      }
      continuationToken = result.NextContinuationToken;
    } while (continuationToken);

    return totalBytes;
  } catch {
    return 0;
  }
}

export async function uploadPhotoServerAction(formData: FormData, albumId: string) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) throw new Error("R2_BUCKET_NAME is missing");

    // Check storage limit before uploading
    const currentStorage = await getTotalStorageBytes();
    if (currentStorage + file.size > STORAGE_LIMIT_BYTES) {
      const usedGB = (currentStorage / 1024 / 1024 / 1024).toFixed(2);
      return {
        success: false,
        error: `Storage limit reached (${usedGB} GB used of 9.5 GB). Please contact the couple to free up space.`,
      };
    }

    // Cleaned file name
    const safeRegex = /[^a-zA-Z0-9.\-_]/g;
    const safeName = file.name.replace(safeRegex, "");
    const fileKey = `${albumId === "general" ? "" : albumId + "/"}${crypto.randomUUID()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: file.type,
      Body: buffer,
    });

    // Upload directly to Cloudflare R2
    await r2Client.send(command);

    revalidatePath("/photos");
    revalidatePath("/home");

    return { success: true };
  } catch (error: any) {
    console.error("Upload error to Cloudflare R2:", error);
    return { success: false, error: error.message };
  }
}
