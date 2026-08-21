import { pgTable, text, timestamp, integer, jsonb, boolean, index } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  author: text("author").notNull().default("Unknown"),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  category: text("category").notNull().default("General"),
  views: integer("views").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  image: text("image"),
  imagePublicId: text("image_public_id"),
});

export const announcements = pgTable("announcements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
});

export const members = pgTable("members", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  role: text("role"),
  bio: text("bio"),
  photo: text("photo"),
  photoPublicId: text("photo_public_id"),
  category: text("category").notNull().default("Researchers"),
  alumni: boolean("alumni").notNull().default(false),
  location: text("location"),
  experience: text("experience"),
  // Not shown publicly used only to notify members when articles,
  // research, or publications are added/updated. See lib/notify-members.ts.
  email: text("email"),
  linkedin: text("linkedin"),
  github: text("github"),
  otherUrl: text("other_url"),
});

export const applications = pgTable("applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message"),
  reviewed: boolean("reviewed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const about = pgTable("about", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: text("content"),
  author: text("author").notNull().default("Unknown"),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  tags: text("tags").array().notNull().default([]),
});

export const videos = pgTable("videos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  description: text("description"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

export const videoClicks = pgTable(
  "video_clicks",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    fromVideoId: text("from_video_id").notNull(),
    toVideoId: text("to_video_id").notNull(),
    userAgent: text("user_agent"),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("video_clicks_from_to_idx").on(table.fromVideoId, table.toVideoId)]
);

export const videoComments = pgTable(
  "video_comments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    videoId: text("video_id").notNull(),
    name: text("name").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("video_comments_video_idx").on(table.videoId, table.createdAt)]
);

export const youtubeOauth = pgTable("youtube_oauth", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiry: timestamp("token_expiry", { withTimezone: true }).notNull(),
  channelId: text("channel_id"),
  channelTitle: text("channel_title"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: text("key").notNull().unique(),
  section: text("section").notNull().default("general"),
  value: jsonb("value"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contentBlocks = pgTable("content_blocks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: text("key").notNull().unique(),
  section: text("section").notNull(),
  title: text("title"),
  enabled: boolean("enabled").notNull().default(true),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
