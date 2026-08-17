// Creates (or re-syncs) the admin user used to sign in at /manage.
//
// The account is created through the Neon Auth service (so the password is
// hashed with the same scheme Better Auth expects), then its role is set to
// 'admin' directly in the neon_auth schema. Idempotent: re-running with an
// existing email just ensures the role is 'admin'.
//
// Usage:
//   ADMIN_PASSWORD=secret npm run create-admin
//   npm run create-admin -- "a-strong-password"
import { neon } from "@neondatabase/serverless";
import { loadEnv } from "./load-env";

loadEnv();

const BASE_URL = process.env.NEON_AUTH_BASE_URL;
const EMAIL = process.env.ADMIN_EMAIL;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

async function main() {
  const password = process.argv[2] || process.env.ADMIN_PASSWORD;
  if (!BASE_URL) {
    console.error("NEON_AUTH_BASE_URL not set in client/.env");
    process.exit(1);
  }
  if (!EMAIL) {
    console.error("ADMIN_EMAIL not set in client/.env");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("Provide a password (min 8 chars):\n  npm run create-admin -- \"your-password\"");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set in client/.env");
    process.exit(1);
  }

  const res = await fetch(`${BASE_URL}/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: APP_URL },
    body: JSON.stringify({ email: EMAIL, password, name: "Admin", callbackURL: APP_URL }),
  });
  const data = (await res.json().catch(() => null)) as
    | { code?: string; message?: string }
    | null;
  const alreadyExists =
    data?.code === "USER_ALREADY_EXISTS" ||
    String(data?.message || "").toLowerCase().includes("already exists");
  if (!res.ok && !alreadyExists) {
    console.error("Sign-up failed:", data?.message || res.statusText);
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!);
  const result =
    await sql`update neon_auth.user set role = 'admin' where email = ${EMAIL} returning email`;
  if (result.length === 0) {
    console.warn("Role update matched 0 rows — the account may not be created yet.");
  }
  console.log(`Admin role ensured for ${EMAIL} (updated ${result.length} row(s)).`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
