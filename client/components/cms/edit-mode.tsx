"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { authClient } from "@/lib/auth/client";

const EditModeContext = createContext<{
  enabled: boolean;
  isAdmin: boolean;
}>({ enabled: false, isAdmin: false });

export function EditModeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data: session } = authClient.useSession();
  const isAdmin =
    !!session?.user && (session.user as { role?: string | null }).role === "admin";

  // Edit mode is simply "is this an admin session" no toggle, on by
  // default whenever an admin is signed in.
  const value = useMemo(() => ({ enabled: isAdmin, isAdmin }), [isAdmin]);

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
