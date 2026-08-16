import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

// Managed Neon Auth instance. Base URL + cookie secret come from the Neon
// console; the neon_auth.* tables live in the same Postgres database.
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    sessionDataTtl: 300,
  },
});
