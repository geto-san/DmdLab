import "server-only";

import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { youtubeOauth } from "@/db/schema";

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.CLIENT_SECRET;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

// The `youtube` scope covers upload, metadata edits, deletes, thumbnails,
// and playlist management for the account that completes the OAuth flow.
export const YOUTUBE_SCOPES = ["https://www.googleapis.com/auth/youtube"];

export function oauthRedirectUri() {
  return process.env.YOUTUBE_REDIRECT_URI || `${APP_URL}/api/videos/oauth/callback`;
}

export function youtubeOauthConfigured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

export function oauthAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    redirect_uri: oauthRedirectUri(),
    response_type: "code",
    scope: YOUTUBE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getStoredToken() {
  const [row] = await db.select().from(youtubeOauth).limit(1);
  return row ?? null;
}

async function exchangeTokens(params: Record<string, string>) {
  const res = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      ...params,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return res.data as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

export async function connectYouTubeWithCode(code: string) {
  const tokens = await exchangeTokens({
    code,
    redirect_uri: oauthRedirectUri(),
    grant_type: "authorization_code",
  });
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Reconnect and grant consent again."
    );
  }

  const me = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    params: { part: "snippet", mine: "true" },
  });

  const existing = await getStoredToken();
  if (existing) await db.delete(youtubeOauth).where(eq(youtubeOauth.id, existing.id));

  const [row] = await db
    .insert(youtubeOauth)
    .values({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: new Date(Date.now() + (tokens.expires_in - 60) * 1000),
      channelId: me.data.items?.[0]?.id ?? null,
      channelTitle: me.data.items?.[0]?.snippet?.title ?? null,
    })
    .returning();
  return row;
}

export async function getAccessToken(): Promise<string> {
  const row = await getStoredToken();
  if (!row) throw new Error("YouTube account not connected");

  if (new Date(row.tokenExpiry).getTime() > Date.now() + 60_000) {
    return row.accessToken;
  }

  const tokens = await exchangeTokens({
    refresh_token: row.refreshToken,
    grant_type: "refresh_token",
  });
  const [updated] = await db
    .update(youtubeOauth)
    .set({
      accessToken: tokens.access_token,
      tokenExpiry: new Date(Date.now() + (tokens.expires_in - 60) * 1000),
      updatedAt: new Date(),
    })
    .where(eq(youtubeOauth.id, row.id))
    .returning();
  return updated.accessToken;
}

export async function disconnectYouTube() {
  const row = await getStoredToken();
  if (row) {
    try {
      await axios.post(
        "https://oauth2.googleapis.com/revoke",
        new URLSearchParams({ token: row.refreshToken }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
    } catch {
      // ignore revoke failures; the local token is removed regardless
    }
    await db.delete(youtubeOauth).where(eq(youtubeOauth.id, row.id));
  }
}
