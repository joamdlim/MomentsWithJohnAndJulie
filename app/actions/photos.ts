"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";
import { getSession } from "@/lib/auth";

/**
 * ✅ Performance fix: replaced noStore() with unstable_cache + revalidateTag.
 * Previously every page load triggered a fresh DB query for every user simultaneously.
 * Now results are cached for 10 seconds and explicitly invalidated on mutations.
 */
export const getAlbumPhotos = unstable_cache(
  async (albumId: string): Promise<{url: string, fileKey: string, id: string, votes: number, userId: string | null}[]> => {
    try {
      const dbAlbum = await prisma.album.findUnique({ where: { slug: albumId } });
      if (!dbAlbum) return [];

      const dbPhotos = await prisma.photo.findMany({
        where: { albumId: dbAlbum.id },
        orderBy: { createdAt: "desc" },
      });

      return dbPhotos.map((p: any) => ({
        id: p.id,
        url: p.url,
        fileKey: p.fileKey,
        votes: p.votes,
        userId: p.userId,
      }));
    } catch (error) {
      console.error("Error fetching album photos:", error);
      return [];
    }
  },
  ["album-photos"],
  { revalidate: 10, tags: ["album-photos"] }
);

export const getAlbums = unstable_cache(
  async (currentUserId?: string) => {
    try {
      const dbAlbums = await prisma.album.findMany({
        include: {
          _count: {
            select: { photos: true },
          },
          photos: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { url: true },
          },
          voteRecords: currentUserId
            ? {
                where: { userId: currentUserId },
                take: 1,
              }
            : false,
        },
        orderBy: { createdAt: "desc" },
      });

      return dbAlbums.map((album: any) => ({
        id: album.slug,
        name: album.name,
        count: album._count.photos,
        photos: album.photos.map((p: any) => p.url),
        coverUrl: album.coverUrl,
        votes: album.votes,
        isOwner: currentUserId ? album.userId === currentUserId : false,
        hasVoted: album.voteRecords && album.voteRecords.length > 0,
      }));
    } catch (error) {
      console.error("Error listing albums:", error);
      return [];
    }
  },
  ["albums-list"],
  { revalidate: 10, tags: ["albums"] }
);

// Thin wrapper so callers don't need to pass userId directly
export async function getAlbumsAction() {
  const session = await getSession();
  return getAlbums(session?.user?.id);
}

export async function createAlbumAction(name: string, coverUrl?: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Please login to create a folder." };
    const userId = session.user.id;

    const existing = await prisma.album.findFirst({ where: { userId } });
    if (existing) return { success: false, error: "You can only create one folder." };

    const slug =
      name.toLowerCase().trim().replace(/ /g, "-") +
      "-" +
      Math.random().toString(36).substring(7);

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "R2 bucket not configured." };

    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${slug}/.keep`,
      Body: "",
    });
    await r2Client.send(command);

    await prisma.album.create({
      data: { slug, name, userId, coverUrl },
    });

    revalidateTag("albums"); // ✅ Targeted cache invalidation
    return { success: true, folderId: slug };
  } catch (error: any) {
    console.error("Error creating folder:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAlbumCoverAction(albumId: string, coverUrl: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Authentication required." };
    const userId = session.user.id;

    const dbAlbum = await prisma.album.findUnique({ where: { slug: albumId } });
    if (!dbAlbum) return { success: false, error: "Album not found." };
    if (dbAlbum.userId !== userId)
      return { success: false, error: "You don't have permission to update this bouquet." };

    await prisma.album.update({
      where: { id: dbAlbum.id },
      data: { coverUrl },
    });

    revalidateTag("albums");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating cover:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAlbumAction(albumId: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Authentication required." };
    const userId = session.user.id;

    const dbAlbum = await prisma.album.findUnique({
      where: { slug: albumId },
      include: { photos: true },
    });

    if (!dbAlbum) return { success: false, error: "Album not found." };
    if (dbAlbum.userId !== userId)
      return { success: false, error: "You don't have permission to delete this bouquet." };

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) return { success: false, error: "R2 bucket not configured." };

    for (const photo of dbAlbum.photos) {
      const delCmd = new DeleteObjectCommand({ Bucket: bucketName, Key: photo.fileKey });
      await r2Client.send(delCmd);
    }

    const delKeep = new DeleteObjectCommand({ Bucket: bucketName, Key: `${albumId}/.keep` });
    await r2Client.send(delKeep);

    await prisma.album.delete({ where: { id: dbAlbum.id } });

    revalidateTag("albums");
    revalidateTag("album-photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting album:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePhotoAction(photoId: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Authentication required." };
    const userId = session.user.id;

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { album: true },
    });

    if (!photo) return { success: false, error: "Photo not found." };

    if (photo.userId !== userId && photo.album.userId !== userId) {
      return { success: false, error: "You don't have permission to delete this photo." };
    }

    const bucketName = process.env.R2_BUCKET_NAME;
    if (bucketName) {
      const delCmd = new DeleteObjectCommand({ Bucket: bucketName, Key: photo.fileKey });
      await r2Client.send(delCmd);
    }

    await prisma.photo.delete({ where: { id: photoId } });

    revalidateTag("albums");
    revalidateTag("album-photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting photo:", error);
    return { success: false, error: error.message };
  }
}

export async function voteAlbumAction(albumId: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Please login to vote." };
    const userId = session.user.id;

    const dbAlbum = await prisma.album.findUnique({ where: { slug: albumId } });
    if (!dbAlbum) return { success: false, error: "Album not found." };

    const existingVote = await prisma.vote.findUnique({ where: { userId } });

    if (existingVote) {
      if (existingVote.albumId === dbAlbum.id) {
        await prisma.$transaction([
          prisma.vote.delete({ where: { id: existingVote.id } }),
          prisma.album.update({ where: { id: dbAlbum.id }, data: { votes: { decrement: 1 } } }),
        ]);
      } else {
        await prisma.$transaction([
          prisma.album.update({ where: { id: existingVote.albumId }, data: { votes: { decrement: 1 } } }),
          prisma.vote.update({ where: { id: existingVote.id }, data: { albumId: dbAlbum.id } }),
          prisma.album.update({ where: { id: dbAlbum.id }, data: { votes: { increment: 1 } } }),
        ]);
      }
    } else {
      await prisma.$transaction([
        prisma.vote.create({ data: { userId, albumId: dbAlbum.id } }),
        prisma.album.update({ where: { id: dbAlbum.id }, data: { votes: { increment: 1 } } }),
      ]);
    }

    revalidateTag("albums");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
