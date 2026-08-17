"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlugZap, Unplug } from "lucide-react";
import { api } from "./api";
import { useEditMode } from "./edit-mode";
import { Skeleton } from "@/components/skeleton";

type Status = {
  configured: boolean;
  connected: boolean;
  channelTitle: string | null;
};

export function VideoConnect() {
  const { enabled } = useEditMode();
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    api<Status>("/videos/oauth/status")
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [enabled]);

  if (!enabled) return null;

  if (!status) {
    return <Skeleton className="h-9 w-48 rounded-full" />;
  }

  if (!status.connected) {
    return (
      // eslint-disable-next-line @next/next/no-html-link-for-pages -- OAuth kickoff must be a full-page nav
      <a
        href="/api/videos/oauth"
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent2/60 px-4 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10"
        title={
          status.configured
            ? "Authorize the site to manage the lab's YouTube channel"
            : "Set GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET to connect"
        }
      >
        <PlugZap className="size-3.5" />
        {status.configured ? "Connect YouTube account" : "YouTube OAuth not configured"}
      </a>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-line px-4 py-2 font-mono-x text-xs text-muted">
      Connected: <strong className="text-ink">{status.channelTitle}</strong>
      <button
        type="button"
        onClick={async () => {
          setBusy(true);
          try {
            await api("/videos/oauth", { method: "POST" });
            setStatus({ configured: status.configured, connected: false, channelTitle: null });
            router.refresh();
          } finally {
            setBusy(false);
          }
        }}
        className="inline-flex items-center gap-1.5 text-accent2 transition-colors hover:text-ink"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Unplug className="size-3.5" />}
        Disconnect
      </button>
    </span>
  );
}
