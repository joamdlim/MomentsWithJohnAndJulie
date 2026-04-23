"use server";

import { ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getAlbumPhotos(albumId: string): Promise<string[]> {
  noStore();
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!bucketName || !publicUrl) return [];

    const prefix = albumId === "general" ? "" : albumId + "/";
    const listCmd = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: 1000,
    });
    const objs = await r2Client.send(listCmd);

    const photos = (objs.Contents || [])
      .filter(c => {
        if (!c.Key || c.Key.endsWith(".keep")) return false;
        if (albumId === "general") return !c.Key.includes("/");
        return true;
      })
      .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0))
      .map(c => `${publicUrl}/${c.Key}`);

    return photos;
  } catch (error) {
    console.error("Error fetching album photos from R2:", error);
    return [];
  }
}

export async function getAlbums() {
  noStore(); // Prevents Next.js aggressive caching for Server Action
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!bucketName || !publicUrl) return [];

    // Delimiter "/" groups all objects into folders.
    const command = new ListObjectsV2Command({ Bucket: bucketName, Delimiter: "/" });
    const data = await r2Client.send(command).catch(err => {
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
          photos: rootPhotos.map(c => `${publicUrl}/${c.Key}`),
          color: "#F2E8E0",
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
      const objs = await r2Client.send(listCmd);
      const countObjs = objs.Contents ? objs.Contents.filter(c => !c.Key!.endsWith(".keep")) : [];
      const photos = countObjs.map(c => `${publicUrl}/${c.Key}`);

      albums.push({
        id: prefix,
        name: prefix.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        photos,
        color: i % 2 === 0 ? "#F2E8E0" : "#EDE5DC",
      });
      i++;
    }

    return albums;
  } catch (error) {
    console.error("Error fetching albums from Cloudflare R2:", error);
    return [];
  }
}

export async function createAlbumAction(name: string) {
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "No bucket configured" };

    // Format id: "Table 4" -> "table-4"
    const folderId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Upload a .keep file to force the folder to exist visibly in R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${folderId}/.keep`,
      Body: "",
    });

    await r2Client.send(command);

    revalidatePath("/photos");
    revalidatePath("/home");
    return { success: true, folderId };
  } catch (error: any) {
    console.error("Error creating folder in Cloudflare R2:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAlbumAction(albumId: string) {
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "No bucket configured" };

    const prefix = albumId === "general" ? "" : albumId + "/";
    const listCmd = new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix });
    const objs = await r2Client.send(listCmd);

    if (objs.Contents && objs.Contents.length > 0) {
      for (const obj of objs.Contents) {
        if (obj.Key) {
          const deleteCmd = new DeleteObjectCommand({ Bucket: bucketName, Key: obj.Key });
          await r2Client.send(deleteCmd);
        }
      }
    }

    revalidatePath("/home");
    revalidatePath("/photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting album in Cloudflare R2:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePhotoAction(photoUrl: string) {
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!bucketName || !publicUrl) return { success: false, error: "No bucket configured" };

    const baseUrl = `${publicUrl}/`;
    if (!photoUrl.startsWith(baseUrl)) return { success: false, error: "Invalid URL" };
    const fileKey = photoUrl.slice(baseUrl.length);

    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey });
    await r2Client.send(command);

    revalidatePath("/home");
    revalidatePath("/photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting photo in Cloudflare R2:", error);
    return { success: false, error: error.message };
  }
}
