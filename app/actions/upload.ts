"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { minioClient } from "@/lib/minio";
import { revalidatePath } from "next/cache";

export async function uploadPhotoServerAction(formData: FormData, albumId: string) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const bucketName = process.env.MINIO_BUCKET_NAME;
    if (!bucketName) throw new Error("MINIO_BUCKET_NAME is missing");

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

    // Upload physically straight into MinIO
    await minioClient.send(command);

    revalidatePath("/photos");
    revalidatePath("/home");

    return { success: true };
  } catch (error: any) {
    console.error("Upload error directly to MinIO:", error);
    return { success: false, error: error.message };
  }
}
