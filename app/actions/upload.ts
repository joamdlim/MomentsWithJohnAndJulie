"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { getSession } from "@/lib/auth";

const MAX_STORAGE_BYTES = 9.5 * 1024 * 1024 * 1024; // 9.5 GB limit

/**
 * ✅ Performance fix: Cache the total storage sum for 5 minutes (300 seconds)
 * to avoid expensive DB aggregation lag on every upload.
 */
const getCachedTotalStorageUsed = unstable_cache(
  async () => {
    const result = await prisma.photo.aggregate({
      _sum: { storageBytes: true },
    });
    return result._sum.storageBytes ?? 0;
  },
  ["total-storage-used"],
  { revalidate: 300 }
);

export async function getPresignedUrlAction(
  filename: string,
  contentType: string,
  albumId?: string,
  isCover: boolean = false
) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Please login to upload." };
    
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!bucketName || !publicUrl) return { success: false, error: "R2 not configured" };

    if (!isCover && albumId) {
      // Ensure the album exists
      const dbAlbum = await prisma.album.findUnique({ where: { slug: albumId } });
      if (!dbAlbum) return { success: false, error: "Album not found" };

      // Limit to 10 photos per folder
      const photoCount = await prisma.photo.count({ where: { albumId: dbAlbum.id } });
      if (photoCount >= 10) {
        return { success: false, error: "Limit of 10 photos per folder reached." };
      }
    }

    const fileExtension = filename.split(".").pop();
    const prefix = isCover ? "covers" : albumId;
    const fileKey = `${prefix}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    // Generate pre-signed URL valid for 5 minutes
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

    return { 
      success: true, 
      signedUrl, 
      fileKey, 
      publicUrl: `${publicUrl}/${fileKey}` 
    };
  } catch (error: any) {
    console.error("Presigned URL error:", error);
    return { success: false, error: error.message };
  }
}

export async function savePhotoMetadataAction(
  fileKey: string,
  albumId: string,
  fileSize: number
) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Please login." };
    const userId = session.user.id;

    const publicUrl = process.env.R2_PUBLIC_URL;
    
    // Fast cached DB-based storage check
    const usedBytes = await getCachedTotalStorageUsed();
    if (usedBytes + fileSize > MAX_STORAGE_BYTES) {
      return { success: false, error: "Global storage limit (9.5GB) reached." };
    }

    const dbAlbum = await prisma.album.findUnique({ where: { slug: albumId } });
    if (!dbAlbum) return { success: false, error: "Album not found" };

    await prisma.photo.create({
      data: {
        url: `${publicUrl}/${fileKey}`,
        fileKey: fileKey,
        albumId: dbAlbum.id,
        userId: userId,
        storageBytes: fileSize,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Save metadata error:", error);
    return { success: false, error: error.message };
  }
}
