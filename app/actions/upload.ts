"use server";

import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

const MAX_STORAGE_BYTES = 9.5 * 1024 * 1024 * 1024; // 9.5 GB limit

async function getTotalStorageUsed(bucketName: string): Promise<number> {
  let totalSize = 0;
  let isTruncated = true;
  let continuationToken: string | undefined;

  while (isTruncated) {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    });

    const response = await r2Client.send(command);
    if (response.Contents) {
      for (const item of response.Contents) {
        totalSize += item.Size || 0;
      }
    }

    isTruncated = response.IsTruncated || false;
    continuationToken = response.NextContinuationToken;
  }

  return totalSize;
}

export async function uploadPhotoServerAction(formData: FormData, albumId: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Please login to upload." };
    const userId = session.user.id;

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!bucketName || !publicUrl) return { success: false, error: "R2 not configured" };

    // Check storage limit
    const usedBytes = await getTotalStorageUsed(bucketName);
    if (usedBytes + file.size > MAX_STORAGE_BYTES) {
      return { success: false, error: "Global storage limit (9.5GB) reached." };
    }

    // Ensure the album exists and user owns it or it's a shared album (if we had any)
    const dbAlbum = await prisma.album.findUnique({ where: { slug: albumId } });
    if (!dbAlbum) return { success: false, error: "Album not found" };

    // Limit to 10 photos per folder
    const photoCount = await prisma.photo.count({ where: { albumId: dbAlbum.id } });
    if (photoCount >= 10) {
      return { success: false, error: "Limit of 10 photos per folder reached." };
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const fileKey = `${albumId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    await prisma.photo.create({
      data: {
        url: `${publicUrl}/${fileKey}`,
        fileKey: fileKey,
        albumId: dbAlbum.id,
        userId: userId,
      }
    });

    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
