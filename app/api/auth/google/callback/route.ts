import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?error=google_auth_failed", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    console.error("Missing Google Client ID or Secret");
    return NextResponse.redirect(new URL("/?error=server_configuration_error", request.url));
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.text();
      console.error("Failed to exchange token:", errData);
      return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // 2. Fetch user profile
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL("/?error=profile_fetch_failed", request.url));
    }

    const profile = await userResponse.json();
    const googleId = profile.id;
    const email = profile.email;
    const name = profile.name || email.split("@")[0];

    // 3. Find or create user
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // Create a unique username
      let baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!baseUsername) baseUsername = "user";
      
      let newUsername = baseUsername;
      let counter = 1;
      
      // Ensure unique username
      while (await prisma.user.findUnique({ where: { username: newUsername } })) {
        newUsername = `${baseUsername}${counter}`;
        counter++;
      }

      user = await prisma.user.create({
        data: {
          username: newUsername,
          googleId,
          // No password field
        },
      });
    }

    // 4. Log the user in
    await login({ id: user.id, username: user.username });

    // 5. Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return NextResponse.redirect(new URL("/?error=internal_server_error", request.url));
  }
}
