import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "Google Client ID is not configured" }, { status: 500 });
  }

  const scope = "openid profile email";
  
  // Create the authorization URL
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("access_type", "online");

  return NextResponse.redirect(authUrl.toString());
}
