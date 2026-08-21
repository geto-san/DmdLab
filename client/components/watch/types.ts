export type PlaylistEntry = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  author?: string;
  uploadDate: string;
  category: string;
  views?: string;
  likes?: string;
  durationLabel?: string | null;
  durationSeconds?: number;
};

export type CommentRow = {
  id: number;
  videoId: string;
  name: string;
  body: string;
  createdAt: string;
};
