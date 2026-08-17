// Static fallback content merged against CMS blocks from the DB (see lib/content.ts).
// iconName values resolve through the allowlisted ICON_MAP in components/ui.tsx.

export const RESEARCH_PROJECTS = [
  {
    title: "AI-Driven Drug Discovery Platform",
    slug: "ai-driven-drug-discovery-platform",
    status: "Active",
    duration: "2023–2026",
    team: ["Dr. Martinez (PI)", "Dr. Chen (Lead)", "Maya Patel", "Sam Taylor"],
    funding: "NSF CAREER Award ($500,000)",
    description:
      "Developing deep learning models to predict drug-target binding affinity, reducing the time and cost of early-stage drug discovery by 75%. Our platform has screened over 2 million compounds and identified 15 promising candidates currently in preclinical testing.",
    image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800",
    iconName: "sparkles",
  },
  {
    title: "Understanding Protein Misfolding in Neurodegenerative Diseases",
    slug: "protein-misfolding-neurodegenerative-diseases",
    status: "Active",
    duration: "2022–2025",
    team: ["Dr. Martinez (PI)", "Dr. Williams (Lead)", "Alex Rivera", "Jordan Kim"],
    funding: "NIH R01 ($1.2M)",
    description:
      "Investigating the molecular mechanisms of protein aggregation in Alzheimer's and Parkinson's diseases using advanced molecular dynamics simulations. Our work has revealed novel intermediate states in the aggregation pathway that could serve as therapeutic targets.",
    image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800",
    iconName: "brain",
  },
  {
    title: "Novel Therapeutic Targets for Cancer Treatment",
    slug: "novel-therapeutic-targets-cancer",
    status: "Active",
    duration: "2024–2027",
    team: ["Dr. Martinez (PI)", "Maya Patel (Lead)", "Priya Sharma"],
    funding: "American Cancer Society Research Grant ($400,000)",
    description:
      "Identifying and validating novel protein-protein interactions in cancer signaling pathways. Using computational screening and experimental validation, we've discovered 3 new druggable targets currently being evaluated by pharmaceutical partners.",
    image: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800",
    iconName: "target",
  },
  {
    title: "Computational Methods for Antibody Design",
    slug: "computational-methods-antibody-design",
    status: "In Planning",
    duration: "2025–2028",
    team: ["Dr. Martinez (PI)", "Dr. Chen", "Priya Sharma"],
    funding: "Proposal submitted to DOE",
    description:
      "Developing next-generation computational tools for rational antibody design, enabling faster and more effective therapeutic antibody development for infectious diseases and cancer immunotherapy.",
    image: "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800",
    iconName: "wrench",
  },
];

export const PUBLICATIONS = [
  {
    year: 2024,
    title: "Deep Learning Approaches for Predicting Protein-Drug Binding Affinity",
    slug: "deep-learning-protein-drug-binding",
    authors: "Chen, J., Patel, M., Martinez, E.",
    journal: "Nature Communications 15, 2847",
    doi: "10.1038/s41467-024-xxxxx",
    citations: 45,
    featured: true,
  },
  {
    year: 2024,
    title: "Conformational Dynamics of α-Synuclein in Parkinson's Disease",
    slug: "conformational-dynamics-alpha-synuclein",
    authors: "Rivera, A., Williams, S., Kim, J., Martinez, E.",
    journal: "Biophysical Journal 116(4), 823-834",
    doi: "10.1016/j.bpj.2024.xxxxx",
    citations: 23,
    featured: false,
  },
  {
    year: 2024,
    title: "Computational Identification of Cancer Drug Targets",
    slug: "computational-identification-cancer-drug-targets",
    authors: "Sharma, P., Martinez, E.",
    journal: "ACS Chemical Biology 19(3), 445-456",
    doi: "10.1021/acschembio.xxxxx",
    citations: 12,
    featured: false,
  },
  {
    year: 2023,
    title: "Machine Learning-Guided Drug Discovery: A Computational Framework",
    slug: "machine-learning-guided-drug-discovery",
    authors: "Martinez, E., Chen, J., Zhang, M.",
    journal: "Nature Reviews Drug Discovery 22, 687-702",
    doi: "10.1038/s41573-023-xxxxx",
    citations: 156,
    featured: true,
  },
];

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

export const ARTICLE_CATEGORIES = [
  "Research",
  "Announcement",
  "Publication",
  "Event",
  "Tutorial",
  "General",
];

export const STATS = [
  { label: "Researchers", value: 12, suffix: "" },
  { label: "Publications", value: 47, suffix: "" },
  { label: "Projects", value: 5, suffix: "" },
  { label: "Funding", value: 2.3, suffix: "M" },
];

export const HERO = {
  eyebrow: "Deepminds Research Lab · MUST",
  title: { before: "AI Research that ", highlight: "Watches", after: ", Listens, and Translates." },
  description:
    "We are a multidisciplinary lab at MUST building applied ML solutions — from real-time wildlife conflict reporting to automated Sign Language translation.",
  primaryCta: { label: "Explore Research", to: "/articles" },
  secondaryCta: { label: "Watch Lab Activities", to: "/videos" },
  stats: [
    { value: "15+", label: "Active Projects" },
    { value: "500+", label: "Recorded Hours" },
  ],
};

export const FEATURED_PROJECTS = {
  heading: "Featured Projects",
  cta: { label: "Browse Portfolio", to: "/research" },
  projects: [
    {
      title: "AI-Driven Drug Discovery Platform",
      status: "Active",
      slug: "ai-driven-drug-discovery-platform",
      iconName: "sparkles",
      description:
        "Developing deep learning models to predict drug-target binding affinity, reducing the time and cost of early-stage drug discovery by 75%.",
      image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Understanding Protein Misfolding in Neurodegenerative Diseases",
      status: "Active",
      slug: "protein-misfolding-neurodegenerative-diseases",
      iconName: "brain",
      description:
        "Investigating the molecular mechanisms of protein aggregation in Alzheimer's and Parkinson's diseases using advanced molecular dynamics simulations.",
      image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Novel Therapeutic Targets for Cancer Treatment",
      status: "Active",
      slug: "novel-therapeutic-targets-cancer",
      iconName: "target",
      description:
        "Identifying and validating novel protein-protein interactions in cancer signaling pathways using computational screening and experimental validation.",
      image: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
};

export const FOOTER_LINKS = {
  explore: [
    { label: "Articles", to: "/articles" },
    { label: "Videos", to: "/videos" },
    { label: "Research", to: "/research" },
    { label: "Publications", to: "/publications" },
  ],
  about: [
    { label: "Team", to: "/team" },
    { label: "Contact", to: "/contact" },
  ],
};
