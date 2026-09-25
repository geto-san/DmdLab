import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { EditModeProvider } from "@/components/cms/edit-mode";
import { SidePanelProvider } from "@/components/cms/side-panel-context";
import { CmsPanel } from "@/components/cms/cms-panel";
import { SiteChrome } from "@/components/site-chrome";
import { Analytics } from "@/components/analytics";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dmd-lab-ochre.vercel.app";
const SITE_NAME = "DeepMinds Research Lab";
const SITE_DESCRIPTION =
  "DeepMinds Research Lab is a multidisciplinary AI research lab at MUST, building real-time wildlife conflict reporting and Sign Language translation tools.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DeepMinds Research Lab | Applied AI Research at MUST",
    template: "%s · DeepMinds Research Lab",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "DeepMinds Research Lab",
    "MUST",
    "Mbarara University of Science and Technology",
    "AI research lab",
    "applied machine learning",
    "wildlife conflict reporting",
    "Sign Language translation",
    "natural language processing",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "DeepMinds Research Lab | Applied AI Research at MUST",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepMinds Research Lab | Applied AI Research at MUST",
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/icon.svg",
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

// Organization structured data (schema.org). This is the "Identity Schema"
// GEO/On-Page recommendation: it tells search engines and LLMs who runs
// this site, its parent institution, and how to find it. Kept as a plain
// <script> tag since next/metadata has no first-class JSON-LD field.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "DM·Lab",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SITE_DESCRIPTION,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Mbarara University of Science and Technology",
    alternateName: "MUST",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mbarara",
    addressCountry: "UG",
  },
  areaServed: "UG",
  knowsAbout: [
    "Machine Learning",
    "Natural Language Processing",
    "Quantum Computing",
    "Prompt Engineering",
    "Statistics",
    "Sign Language Translation",
  ],
};

// Local Business structured data (schema.org) — the literal "LocalBusiness"
// type the audit's Local SEO section names, kept separate from the
// Organization block above. Street address and phone are left out rather
// than filled with placeholders: neither is public information we have, and
// a fabricated address/phone in structured data is worse for SEO/trust than
// omitting it. Add them here (as `streetAddress` and `telephone`) once real
// values exist.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/icon.svg`,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mbarara",
    addressCountry: "UG",
  },
  areaServed: "UG",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${instrument.variable} ${inter.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <EditModeProvider>
            <SidePanelProvider>
              <SiteChrome>{children}</SiteChrome>
              <CmsPanel />
            </SidePanelProvider>
          </EditModeProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
