"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { EditItem } from "@/components/cms/edit-item";
import type { PlaylistEntry } from "./types";

function InfoInner({ video, showHeart = true }: Readonly<{ video: PlaylistEntry; showHeart?: boolean }>) {
  const [expanded, setExpanded] = useState(false);
  const long = video.description.trim().length > 160;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video._id}`;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="mb-2 font-mono-x text-muted">
          <span className="text-accent2">{video.category}</span> ·{" "}
          {new Date(video.uploadDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <h1 className="font-display text-xl leading-snug tracking-tight sm:text-3xl">{video.title}</h1>
        {video.description.trim() && (
          <div className="mt-2">
            <p
              className={`text-sm leading-relaxed text-muted ${
                expanded ? "" : "line-clamp-2 whitespace-pre-line"
              }`}
            >
              {video.description}
            </p>
            {long && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="mt-1 inline-flex items-center gap-1 font-mono-x text-accent2 transition-colors hover:text-ink"
              >
                {expanded ? (
                  <>
                    Less <ChevronUp className="size-3" />
                  </>
                ) : (
                  <>
                    More <ChevronDown className="size-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {showHeart && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Like on YouTube"
          title="Like on YouTube"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
        >
          <Heart className="size-4.5" />
        </a>
      )}
    </div>
  );
}

export function InfoBar({ video, editable }: Readonly<{ video: PlaylistEntry; editable?: boolean }>) {
  if (editable) {
    return (
      <EditItem collection="video" item={{ _id: video._id, title: video.title }} redirectTo="/videos">
        <div className="border-t border-line bg-surface px-5 py-4 sm:px-7 sm:py-6">
          <InfoInner video={video} showHeart={false} />
        </div>
      </EditItem>
    );
  }
  return (
    <div className="border-t border-line bg-surface px-5 py-4 sm:px-7 sm:py-6">
      <InfoInner video={video} />
    </div>
  );
}
