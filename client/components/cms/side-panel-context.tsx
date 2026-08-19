"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type PanelState = {
  collection: string;
  item: Record<string, unknown> | null;
  blockKey?: string;
  redirectTo?: string;
  onDeleted?: () => void;
};

const SidePanelContext = createContext<{
  panel: PanelState | null;
  openPanel: (state: PanelState) => void;
  closePanel: () => void;
}>({ panel: null, openPanel: () => {}, closePanel: () => {} });

export function SidePanelProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [panel, setPanel] = useState<PanelState | null>(null);

  const openPanel = useCallback((state: PanelState) => setPanel(state), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const value = useMemo(() => ({ panel, openPanel, closePanel }), [panel, openPanel, closePanel]);

  return <SidePanelContext.Provider value={value}>{children}</SidePanelContext.Provider>;
}

export function useSidePanel() {
  return useContext(SidePanelContext);
}
