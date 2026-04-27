import { cookies } from "next/headers";
import crypto from "crypto";

const DEVICE_ID_COOKIE = "device_id";

export async function getDeviceId(): Promise<string> {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get(DEVICE_ID_COOKIE)?.value;

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    // In a real app, you might want to set this in middleware or a route handler
    // to ensure it's set before rendering, but setting it here works for Server Actions.
    // However, cookies().set() is only available in Server Actions or Route Handlers.
    // If this is called from a Server Component during render, we can't set cookies.
    // We'll handle setting it in the client or actions if needed.
  }

  return deviceId;
}
