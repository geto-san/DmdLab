"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth/client";

const STORAGE_KEY = "dmdlab:edit-mode";

const EditModeContext = createContext<{
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  isAdmin: boolean;
}>({ enabled: false, setEnabled: () => {}, isAdmin: false });

export function EditModeProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const isAdmin =
    !!session?.user && (session.user as { role?: string | null }).role === "admin";
  const [wanted, setWantedState] = useState(false);

  useEffect(() => {
    setWantedState(localStorage.getItem(STORAGE_KEY) === "on");
  }, []);

  const setEnabled = (v: boolean) => {
    setWantedState(v);
    localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
  };

  // A stale "on" flag (or a shared browser) must never surface admin-only
  // controls to a visitor whose session isn't actually an admin session.
  const enabled = isAdmin && wanted;

  return (
    <EditModeContext.Provider value={{ enabled, setEnabled, isAdmin }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
