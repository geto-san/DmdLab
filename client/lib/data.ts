// Static fallback content merged against CMS blocks from the DB (see lib/content.ts).
// iconName values resolve through the allowlisted ICON_MAP in components/ui.tsx.

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  research?: string;
  education?: string;
  email?: string;
  image?: string;
};

export type TeamCategory = {
  name: string;
  members: TeamMember[];
};

export const TEAM_CATEGORIES: TeamCategory[] = [
  {
    name: "PI",
    members: [
      {
        name: "Dr. Elena Martinez",
        role: "Associate Professor, Dept. of Chemistry & Biochemistry",
        education: "PhD Computational Chemistry (Stanford, 2015), BS Chemistry (MIT, 2009)",
        research: "Machine learning for drug discovery, protein dynamics, molecular simulation methods",
        bio: "Dr. Martinez leads the Molecular Dynamics Lab with a focus on computational approaches to understand and predict protein-drug interactions. Her work has been recognized with the NSF CAREER Award and the ACS Division of Computers in Chemistry Young Investigator Award.",
        email: "e.martinez@university.edu",
        image: "https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  {
    name: "Postdocs",
    members: [
      {
        name: "Dr. James Chen",
        role: "Postdoctoral Researcher",
        education: "PhD UC Berkeley 2022",
        research: "Machine Learning & Drug Discovery",
        image: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Dr. Sarah Williams",
        role: "Postdoctoral Researcher",
        education: "PhD Cambridge 2023",
        research: "Molecular Simulation Methods",
        image: "https://images.pexels.com/photos/5905497/pexels-photo-5905497.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    name: "PhD Students",
    members: [
      {
        name: "Alex Rivera",
        role: "PhD Student (4th year)",
        research: "Protein folding mechanisms in neurodegenerative diseases",
        image: "https://images.pexels.com/photos/8942090/pexels-photo-8942090.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Maya Patel",
        role: "PhD Student (3rd year)",
        research: "Drug binding kinetics and optimization",
        image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Jordan Kim",
        role: "PhD Student (2nd year)",
        research: "Enzyme catalysis mechanisms",
        image: "https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Priya Sharma",
        role: "PhD Student (1st year)",
        research: "Antibody-antigen interactions",
        image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    name: "Undergraduates",
    members: [
      {
        name: "Sam Taylor",
        role: "Undergraduate (Senior, Chemistry)",
        research: "Machine learning model development",
        image: "https://images.pexels.com/photos/5905555/pexels-photo-5905555.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "Chris Anderson",
        role: "Undergraduate (Junior, CS)",
        research: "Building data pipeline infrastructure",
        image: "https://images.pexels.com/photos/5905529/pexels-photo-5905529.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
];

export const ALUMNI = [
  { name: "Dr. Michael Zhang", position: "Assistant Professor, University of Washington", year: "2024" },
  { name: "Dr. Lisa Johnson", position: "Senior Scientist, Pfizer", year: "2023" },
  { name: "Dr. Ahmed Hassan", position: "Postdoc, Max Planck Institute", year: "2022" },
];

export const LAB_MEMBERS = [
  "Martinez",
  "Chen",
  "Williams",
  "Rivera",
  "Patel",
  "Kim",
  "Sharma",
  "Taylor",
  "Zhang",
  "Johnson",
  "Hassan",
];

// Stats band on the homepage. "Researchers" and "Recorded Hours" are always
// computed live (member count from the DB, video hours from the YouTube API)
// and are never read from here or from the CMS payload. "Active Topics" has
// no source-of-truth table, so it stays an editable fallback that the
// "stats" content block can override via its `activeTopics` field.
export const STATS_ACTIVE_TOPICS_DEFAULT = { value: 15, suffix: "+" };

export const HERO = {
  eyebrow: "Deepminds Research Lab · MUST",
  title: { before: "AI Research that ", highlight: "Watches", after: ", Listens, and Translates." },
  description:
    "We are a multidisciplinary lab at MUST building applied ML solutions — from real-time wildlife conflict reporting to automated Sign Language translation.",
  primaryCta: { label: "Watch Lab Activities", to: "/videos" },
  secondaryCta: { label: "Meet the Team", to: "/team" },
};

export const FOOTER_LINKS = {
  explore: [{ label: "Videos", to: "/videos" }],
  about: [
    { label: "Team", to: "/team" },
    { label: "Contact", to: "/contact" },
  ],
};
