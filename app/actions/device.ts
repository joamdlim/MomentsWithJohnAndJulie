"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

const DEVICE_ID_COOKIE = "device_id";

export async function getOrCreateDeviceId(): Promise<string> {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get(DEVICE_ID_COOKIE)?.value;

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    // Set cookie to expire in 10 years
    cookieStore.set(DEVICE_ID_COOKIE, deviceId, {
      maxAge: 60 * 60 * 24 * 365 * 10,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return deviceId;
}

export async function getDeviceIdServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_ID_COOKIE)?.value || null;
}
