import "server-only";

import axios from "axios";

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.CLIENT_SECRET;

// Separate purpose from lib/youtube-oauth.ts (which connects the lab's own
// YouTube channel with offline/refresh access) — this flow only confirms an
// applicant's identity for the join-the-team form, one-shot, no stored
// tokens. Same Google Cloud OAuth client, different redirect URI and scope.
export function applyOauthRedirectUri() {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/api/apply/google/callback`;
}

export function applyOauthConfigured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

export function applyOauthAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    redirect_uri: applyOauthRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function verifyApplicantWithCode(code: string) {
  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      code,
      redirect_uri: applyOauthRedirectUri(),
      grant_type: "authorization_code",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  const accessToken = (tokenRes.data as { access_token: string }).access_token;

  const profileRes = await axios.get("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = profileRes.data as { email?: string; email_verified?: boolean; name?: string };

  if (!profile.email || !profile.email_verified) {
    throw new Error("Google did not report this email as verified.");
  }
  return { email: profile.email, name: profile.name || "" };
}
