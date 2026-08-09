// Seeds a handful of sample Articles + Announcements so the entry (Lobby)
// page and its endpoints have something real to return during local
// testing. Reads MONGO_URI / DB_NAME from server/.env — same connection
// server.js uses.
//
// Usage:
//   node seed.js          # adds sample docs (keeps existing data)
//   node seed.js --reset  # wipes Article + Announcement + Content first
//
// Safe to point at a dedicated local/dev database (see DB_NAME in
// .env.example) — avoid running --reset against a real prod DB.
require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');
const Announcement = require('./models/Announcement');
const Content = require('./models/Content');

const sampleArticles = [
  {
    title: 'Welcome to DeepMinds Research Lab',
    description: 'An introduction to what the lab works on and why.',
    content: 'Full article body goes here...',
    author: 'Lab Admin',
    category: 'General',
    tags: ['intro'],
  },
  {
    title: 'WildWatch: Reporting Human-Wildlife Conflict',
    description: 'How the WildWatch sighting tool helps communities report incidents.',
    content: 'Full article body goes here...',
    author: 'Lab Admin',
    category: 'Research',
    tags: ['wildwatch', 'hwc'],
  },
  {
    title: 'Uganda Sign Language Avatar: Progress Update',
    description: 'Latest progress translating speech/text into an animated avatar.',
    content: 'Full article body goes here...',
    author: 'Lab Admin',
    category: 'Research',
    tags: ['sign-language', 'ml'],
  },
];

const sampleAnnouncements = [
  { title: 'Site backend is live', body: 'Public API endpoints are now serving real data.' },
  { title: 'New research articles posted', body: 'Check the Articles page for the latest updates.' },
];

// CMS content blocks mirroring the homepage defaults. Edit these through the
// /admin panel (Content section) to dictate what the frontend shows.
const sampleContent = [
  {
    key: 'hero',
    section: 'home',
    title: 'Hero section',
    enabled: true,
    payload: {
      eyebrow: 'Deepminds Research Lab · MUST',
      title: { before: 'AI Research that ', highlight: 'Watches', after: ', Listens, and Translates.' },
      description: 'We are a multidisciplinary lab at MUST building applied ML solutions — from real-time wildlife conflict reporting to automated Sign Language translation.',
      primaryCta: { label: 'Explore Research', to: '/articles' },
      secondaryCta: { label: 'Watch Lab Activities', to: '/videos' },
      stats: [
        { value: '15+', label: 'Active Projects' },
        { value: '500+', label: 'Recorded Hours' },
      ],
    },
  },
  {
    key: 'stats',
    section: 'home',
    title: 'Lab stats band',
    enabled: true,
    payload: {
      stats: [
        { label: 'Researchers', value: 12, suffix: '' },
        { label: 'Publications', value: 47, suffix: '' },
        { label: 'Projects', value: 5, suffix: '' },
        { label: 'Funding', value: 2.3, suffix: 'M' },
      ],
    },
  },
  {
    key: 'featured-projects',
    section: 'home',
    title: 'Featured projects',
    enabled: true,
    payload: {
      heading: 'Featured Projects',
      cta: { label: 'Browse Portfolio', to: '/research' },
      projects: [
        {
          title: 'AI-Driven Drug Discovery Platform',
          status: 'Active',
          slug: 'ai-driven-drug-discovery-platform',
          iconName: 'sparkles',
          description: 'Developing deep learning models to predict drug-target binding affinity, reducing the time and cost of early-stage drug discovery by 75%.',
          image: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
        {
          title: 'Understanding Protein Misfolding in Neurodegenerative Diseases',
          status: 'Active',
          slug: 'protein-misfolding-neurodegenerative-diseases',
          iconName: 'brain',
          description: 'Investigating the molecular mechanisms of protein aggregation in Alzheimer\'s and Parkinson\'s diseases using advanced molecular dynamics simulations.',
          image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
        {
          title: 'Novel Therapeutic Targets for Cancer Treatment',
          status: 'Active',
          slug: 'novel-therapeutic-targets-cancer',
          iconName: 'target',
          description: 'Identifying and validating novel protein-protein interactions in cancer signaling pathways using computational screening and experimental validation.',
          image: 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
      ],
    },
  },
];

async function main() {
  const reset = process.argv.includes('--reset');
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set — copy .env.example to .env first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || undefined });
  console.log('Connected to', mongoose.connection.name);

  if (reset) {
    await Article.deleteMany({});
    await Announcement.deleteMany({});
    await Content.deleteMany({});
    console.log('Cleared existing Articles + Announcements + Content');
  }

  const articles = await Article.insertMany(sampleArticles);
  const announcements = await Announcement.insertMany(sampleAnnouncements);
  const contentBlocks = await Content.insertMany(sampleContent);

  console.log(`Inserted ${articles.length} articles, ${announcements.length} announcements, ${contentBlocks.length} content blocks`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
