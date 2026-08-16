"use client";

import { createAuthClient } from "@neondatabase/auth/next";

// Browser-side Neon Auth client. The base URL defaults to this origin's
// /api/auth, which proxies to the Neon Auth service via the handler at
// app/api/auth/[...path]/route.ts.
export const authClient = createAuthClient();
