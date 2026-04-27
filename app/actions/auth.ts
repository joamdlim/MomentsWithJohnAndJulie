"use server";
import { login, logout, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerAction(username: string, password: string) {
  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return { success: false, error: "Username already taken" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword }
    });

    await login({ id: user.id, username: user.username });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginAction(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return { success: false, error: "User not found" };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { success: false, error: "Invalid password" };

    await login({ id: user.id, username: user.username });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction() {
  await logout();
  revalidatePath("/");
}

export async function getCurrentUserAction() {
  const session = await getSession();
  return session?.user || null;
}
