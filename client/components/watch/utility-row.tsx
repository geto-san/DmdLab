"use client";

import { useState } from "react";
import {
  Captions,
  Check,
  Code2,
  EllipsisVertical,
  ExternalLink,
  Image as ImageIcon,
  Share2,
} from "lucide-react";
import { usePlayer } from "./player-provider";
import { PopoverMenu } from "./popover-menu";

function IconButton({
  onClick,
  label,
  active,
  children,
}: Readonly<{
  onClick: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`flex size-9 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-accent2/50 bg-accent2/10 text-accent2"
          : "border-line text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function UtilityRow({ videoId }: Readonly<{ videoId: string }>) {
  const { ccOn, toggleCc } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  async function copyText(text: string, setFlag: (value: boolean) => void) {
    try {
      await navigator.clipboard.writeText(text);
      setFlag(true);
      setTimeout(() => setFlag(false), 2000);
    } catch {
      // Clipboard unavailable — nothing to recover.
    }
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="flex items-center gap-2">
      <IconButton onClick={toggleCc} label="Toggle captions" active={ccOn}>
        <Captions className="size-4.5" />
      </IconButton>

      <IconButton
        onClick={() => copyText(window.location.href, setCopied)}
        label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check className="size-4.5 text-accent2" /> : <Share2 className="size-4.5" />}
      </IconButton>

      <a
        href={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        target="_blank"
        rel="noreferrer"
        aria-label="Open thumbnail"
        title="Open thumbnail"
        className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
      >
        <ImageIcon className="size-4.5" />
      </a>

      <PopoverMenu
        trigger={<EllipsisVertical className="size-4.5" />}
        triggerLabel="More options"
        side="top"
        align="left"
        buttonClass={`flex size-9 items-center justify-center rounded-full border transition-colors ${
          embedCopied
            ? "border-accent2/50 bg-accent2/10 text-accent2"
            : "border-line text-muted hover:border-ink hover:text-ink"
        }`}
        items={[
          {
            label: "Open on YouTube",
            icon: <ExternalLink className="size-3.5" />,
            onSelect: () => window.open(youtubeUrl, "_blank", "noreferrer"),
          },
          {
            label: embedCopied ? "Embed copied" : "Copy embed code",
            icon: embedCopied ? <Check className="size-3.5" /> : <Code2 className="size-3.5" />,
            onSelect: () =>
              copyText(
                `<iframe src="https://www.youtube.com/embed/${videoId}" title="Video player" allowfullscreen></iframe>`,
                setEmbedCopied
              ),
          },
        ]}
      />
    </div>
  );
}
