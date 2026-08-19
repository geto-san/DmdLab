import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { EditModeProvider } from "@/components/cms/edit-mode";
import { SidePanelProvider } from "@/components/cms/side-panel-context";
import { CmsPanel } from "@/components/cms/cms-panel";
import { SiteChrome } from "@/components/site-chrome";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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

export const metadata: Metadata = {
  title: {
    default: "DeepMinds Research Lab",
    template: "%s · DeepMinds Research Lab",
  },
  description:
    "AI research lab at MUST — Quantum Computing.",
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
      </body>
    </html>
  );
}
