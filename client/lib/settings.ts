import "server-only";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";

// ── Types ────────────────────────────────────────────────────────────────────

export type NavLink = { label: string; to: string };

export type FooterLinkGroup = { title: string; links: NavLink[] };

export type AlumniEntry = {
  name: string;
  position: string;
  year: string;
};

export type SiteSettings = {
  nav: NavLink[];
  footerLinks: FooterLinkGroup[];
  footerDescription: string;
  footerCopyright: string;
  footerTechCredit: string;
  alumni: AlumniEntry[];
  articleCategories: string[];
  homepageMarquee: string[];
  footerMarquee: string[];
  homepageCta: { eyebrow: string; heading: string; highlight: string; buttonLabel: string };
};

// ── Defaults (used when no DB row exists) ─────────────────────────────────────

const DEFAULTS: SiteSettings = {
  nav: [
    { label: "Articles", to: "/articles" },
    { label: "Videos", to: "/videos" },
    { label: "Research", to: "/research" },
    { label: "Publications", to: "/publications" },
    { label: "Team", to: "/team" },
  ],
  footerLinks: [
    {
      title: "Explore",
      links: [
        { label: "Articles", to: "/articles" },
        { label: "Videos", to: "/videos" },
        { label: "Research", to: "/research" },
        { label: "Publications", to: "/publications" },
      ],
    },
    {
      title: "Lab",
      links: [
        { label: "Team", to: "/team" },
      ],
    },
  ],
  footerDescription:
    "A multidisciplinary AI research lab building applied machine learning — from real-time wildlife conflict reporting to automated Sign Language translation.",
  footerCopyright: "DeepMinds Research Lab",
  footerTechCredit: "Built with Next.js · Postgres · Cloudinary",
  alumni: [
    { name: "Dr. Michael Zhang", position: "Assistant Professor, University of Washington", year: "2024" },
    { name: "Dr. Lisa Johnson", position: "Senior Scientist, Pfizer", year: "2023" },
    { name: "Dr. Ahmed Hassan", position: "Postdoc, Max Planck Institute", year: "2022" },
  ],
  articleCategories: ["Research", "Announcement", "Publication", "Event", "Tutorial", "General"],
  homepageMarquee: [
    "Quantum Computing",
    "Prompt Engineering",
    "Natural Language Processing",
    "Statistics",
  ],
  footerMarquee: [
    "Vibe Coding",
    "Quantum Computing",
    "Prompt Engineering",
    "Natural Language Processing",
    "Statistics",
  ],
  homepageCta: {
    eyebrow: "Lab activities",
    heading: "Watch what we're working on",
    highlight: "working on",
    buttonLabel: "Open video library",
  },
};

// ── DB fetch ──────────────────────────────────────────────────────────────────

async function fetchSettingsMap(): Promise<Map<string, unknown>> {
  try {
    const rows = await db
      .select({ key: siteSettings.key, value: siteSettings.value })
      .from(siteSettings);
    const map = new Map<string, unknown>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }
    return map;
  } catch (err) {
    console.warn("Settings fetch failed, using defaults:", (err as Error).message);
    return new Map();
  }
}

function get<T>(map: Map<string, unknown>, key: keyof SiteSettings, fallback: T): T {
  const raw = map.get(key);
  if (raw === undefined || raw === null) return fallback;
  return raw as T;
}

// ── Public API ────────────────────────────────────────────────────────────────

let cached: SiteSettings | null = null;

export async function getSettings(): Promise<SiteSettings> {
  if (cached) return cached;
  const map = await fetchSettingsMap();
  cached = {
    nav: get(map, "nav", DEFAULTS.nav),
    footerLinks: get(map, "footerLinks", DEFAULTS.footerLinks),
    footerDescription: get(map, "footerDescription", DEFAULTS.footerDescription),
    footerCopyright: get(map, "footerCopyright", DEFAULTS.footerCopyright),
    footerTechCredit: get(map, "footerTechCredit", DEFAULTS.footerTechCredit),
    alumni: get(map, "alumni", DEFAULTS.alumni),
    articleCategories: get(map, "articleCategories", DEFAULTS.articleCategories),
    homepageMarquee: get(map, "homepageMarquee", DEFAULTS.homepageMarquee),
    footerMarquee: get(map, "footerMarquee", DEFAULTS.footerMarquee),
    homepageCta: get(map, "homepageCta", DEFAULTS.homepageCta),
  };
  return cached;
}

export function resetSettingsCache() {
  cached = null;
}

export { DEFAULTS as SETTINGS_DEFAULTS };
