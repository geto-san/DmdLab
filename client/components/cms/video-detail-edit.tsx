"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { EditItem } from "./edit-item";

export function VideoDetailEdit({
  video,
  children,
}: Readonly<{
  video: { _id: string; title: string };
  children: ReactNode;
}>) {
  const router = useRouter();
  return (
    <EditItem
      collection="video"
      item={{ _id: video._id, title: video.title }}
      onDeleted={() => router.push("/videos")}
    >
      {children}
    </EditItem>
  );
}
