// Seeds sample Articles, Announcements, CMS Content blocks, and Team Members
// so the public site and its endpoints have something real to render during
// local testing. Reads DATABASE_URL from client/.env.
//
// Usage:
//   npm run seed          # adds sample docs (keeps existing data)
//   npm run seed:reset    # wipes Article + Announcement + Content + Members first
import { articles, announcements, contentBlocks, members } from "../db/schema";
import { TEAM_CATEGORIES } from "../lib/data";
import { loadEnv } from "./load-env";

loadEnv();

const sampleArticles = [
  {
    title: "Welcome to DeepMinds Research Lab",
    description: "An introduction to what the lab works on and why.",
    content: "Full article body goes here...",
    author: "Lab Admin",
    category: "General",
    tags: ["intro"],
  },
  {
    title: "WildWatch: Reporting Human-Wildlife Conflict",
    description: "How the WildWatch sighting tool helps communities report incidents.",
    content: "Full article body goes here...",
    author: "Lab Admin",
    category: "Research",
    tags: ["wildwatch", "hwc"],
  },
  {
    title: "Uganda Sign Language Avatar: Progress Update",
    description: "Latest progress translating speech/text into an animated avatar.",
    content: "Full article body goes here...",
    author: "Lab Admin",
    category: "Research",
    tags: ["sign-language", "ml"],
  },
];

const sampleAnnouncements = [
  { title: "Site backend is live", body: "Public API endpoints are now serving real data." },
  { title: "New research articles posted", body: "Check the Articles page for the latest updates." },
];

const sampleContent = [
  {
    key: "hero",
    section: "home",
    title: "Hero section",
    enabled: true,
    payload: {
      eyebrow: "Deepminds Research Lab · MUST",
      title: {
        before: "AI Research that ",
        highlight: "Watches",
        after: ", Listens, and Translates.",
      },
      description:
        "We are a multidisciplinary lab at MUST building applied ML solutions — from real-time wildlife conflict reporting to automated Sign Language translation.",
      primaryCta: { label: "Explore Research", to: "/articles" },
      secondaryCta: { label: "Watch Lab Activities", to: "/videos" },
      stats: [
        { value: "15+", label: "Active Projects" },
        { value: "500+", label: "Recorded Hours" },
      ],
    },
  },
  {
    key: "stats",
    section: "home",
    title: "Lab stats band",
    enabled: true,
    payload: {
      stats: [
        { label: "Researchers", value: 12, suffix: "" },
        { label: "Publications", value: 47, suffix: "" },
        { label: "Projects", value: 5, suffix: "" },
        { label: "Funding", value: 2.3, suffix: "M" },
      ],
    },
  },
];

const sampleMembers = TEAM_CATEGORIES.flatMap((category) =>
  category.members.map((m) => ({
    name: m.name,
    role: m.role,
    bio: m.bio || m.research || m.education || null,
    photo: m.image || null,
    category: category.name,
  }))
);

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set — copy client/.env.example to client/.env first.");
    process.exit(1);
  }

  const { db } = await import("../db");

  const reset = process.argv.includes("--reset");
  if (reset) {
    await db.delete(articles);
    await db.delete(announcements);
    await db.delete(contentBlocks);
    await db.delete(members);
    console.log("Cleared existing Articles + Announcements + Content + Members");
  }

  const articleRows = await db.insert(articles).values(sampleArticles).returning();
  const announcementRows = await db.insert(announcements).values(sampleAnnouncements).returning();
  const contentRows = await db.insert(contentBlocks).values(sampleContent).returning();
  const memberRows = await db.insert(members).values(sampleMembers).returning();

  console.log(
    `Inserted ${articleRows.length} articles, ${announcementRows.length} announcements, ${contentRows.length} content blocks, ${memberRows.length} members`
  );
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
