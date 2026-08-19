import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/data";
import { Marquee } from "./marquee";

export function Footer() {
  return (
    <footer className="hairline-t mt-24 bg-surface">
      <Marquee
        className="border-b border-line py-5"
        items={[
          "Vibe Coding",
          "Quantum Computing",
          "Prompt Engineering",
          "Natural Language Processing",
          "Statistics",
        ]}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-2">
          <p className="font-display text-3xl tracking-tight">DM·Lab</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A multidisciplinary AI research lab building applied machine learning —
            from real-time wildlife conflict reporting to automated Sign Language
            translation.
          </p>
        </div>

        {[
          { title: "Explore", links: FOOTER_LINKS.explore },
          { title: "Lab", links: FOOTER_LINKS.about },
        ].map((col) => (
          <div key={col.title}>
            <p className="mb-4 font-mono-x text-muted">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-sm text-ink transition-colors hover:text-accent2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="hairline-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="font-mono-x text-muted">
            © {new Date().getFullYear()} DeepMinds Research Lab
          </p>
          <p className="font-mono-x text-muted">Built with Next.js · Mongo · Cloudinary</p>
        </div>
      </div>
    </footer>
  );
}
