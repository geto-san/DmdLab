"use client";

import { useSidePanel } from "./side-panel-context";
import { SidePanel } from "./side-panel";
import { PanelForm } from "./panel-form";
import { ArticlePanelForm } from "./article-panel-form";
import { ContentPanelForm } from "./content-panel-form";
import { VideoEditorModal } from "./video-editor";

export function CmsPanel() {
  const { panel, closePanel } = useSidePanel();

  if (!panel) return null;

  const { collection, item, blockKey, redirectTo, onDeleted } = panel;
  const title = item?.id
    ? `Edit ${collection.replaceAll("-", " ")}`
    : `Add ${collection.replaceAll("-", " ")}`;

  if (collection === "video") {
    return (
      <VideoEditorModal
        video={{ _id: String(item?._id ?? ""), title: String(item?.title ?? "") }}
        onDeleted={onDeleted}
        onClose={closePanel}
      />
    );
  }

  if (collection === "article") {
    return (
      <SidePanel title={title} onClose={closePanel}>
        <ArticlePanelForm article={item} redirectTo={redirectTo} />
      </SidePanel>
    );
  }

  if (collection === "content") {
    return (
      <SidePanel title={title} onClose={closePanel}>
        <ContentPanelForm blockKey={blockKey as string} />
      </SidePanel>
    );
  }

  return (
    <SidePanel title={title} onClose={closePanel}>
      <PanelForm collection={collection} item={item} />
    </SidePanel>
  );
}
