"use server";

import { ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { minioClient } from "@/lib/minio";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getAlbums() {
  noStore(); // Prevents Next.js aggressive caching for Server Action
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    if (!bucketName) return [];
    
    // Delimiter "/" groups all objects into folders. 
    const command = new ListObjectsV2Command({ Bucket: bucketName, Delimiter: "/" });
    const data = await minioClient.send(command).catch(err => {
      console.log("Error finding common prefixes:", err);
      return { CommonPrefixes: [] };
    });
    
    const prefixes = data.CommonPrefixes?.map(p => p.Prefix!.replace("/", "")) || [];
    
    let albums = [];
    let i = 0;
    
    // Add "general" if the bucket has files at the root
    if (data.Contents && data.Contents.length > 0) {
      const rootPhotos = data.Contents.filter(c => !c.Key!.includes("/") && !c.Key!.endsWith(".keep"));
      if (rootPhotos.length > 0) {
        albums.push({
          id: "general",
          name: "General Photos",
          photos: rootPhotos.map(c => `${process.env.MINIO_ENDPOINT}/${bucketName}/${c.Key}`),
          color: "#F2E8E0"
        });
        i++;
      }
    }

    if (prefixes.length === 0 && albums.length === 0) {
      return [];
    }
    
    for (const prefix of prefixes) {
      if (prefix === "general") continue;
      // Get count of objects exactly in this folder
      const listCmd = new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix + "/" });
      const objs = await minioClient.send(listCmd);
      const countObjs = objs.Contents ? objs.Contents.filter(c => !c.Key!.endsWith(".keep")) : [];
      const photos = countObjs.map(c => `${process.env.MINIO_ENDPOINT}/${bucketName}/${c.Key}`);
      
      albums.push({
        id: prefix,
        name: prefix.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        photos,
        color: i % 2 === 0 ? "#F2E8E0" : "#EDE5DC" 
      });
      i++;
    }
    
    return albums;
  } catch (error) {
    console.error("Error fetching albums from MinIO:", error);
    return [];
  }
}

export async function createAlbumAction(name: string) {
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "No bucket configured" };
    
    // Format id: "Table 4" -> "table-4"
    const folderId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    // Upload a .keep file to force the folder to exist visibly in MinIO!
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${folderId}/.keep`,
      Body: "",
    });
    
    await minioClient.send(command);
    
    revalidatePath("/photos");
    revalidatePath("/home"); // MUST revalidate home since MemoriesSection is on home page
    return { success: true, folderId };
  } catch (error: any) {
    console.error("Error creating folder in MinIO:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAlbumAction(albumId: string) {
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "No bucket configured" };

    const prefix = albumId === "general" ? "" : albumId + "/";
    const listCmd = new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix });
    const objs = await minioClient.send(listCmd);

    if (objs.Contents && objs.Contents.length > 0) {
      for (const obj of objs.Contents) {
        if (obj.Key) {
          const deleteCmd = new DeleteObjectCommand({ Bucket: bucketName, Key: obj.Key });
          await minioClient.send(deleteCmd);
        }
      }
    }

    revalidatePath("/home");
    revalidatePath("/photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting album in MinIO:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePhotoAction(photoUrl: string) {
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "No bucket configured" };

    const baseUrl = `${process.env.MINIO_ENDPOINT}/${bucketName}/`;
    if (!photoUrl.startsWith(baseUrl)) return { success: false, error: "Invalid URL" };
    const fileKey = photoUrl.slice(baseUrl.length);

    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey });
    await minioClient.send(command);

    revalidatePath("/home");
    revalidatePath("/photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting photo in MinIO:", error);
    return { success: false, error: error.message };
  }
}
