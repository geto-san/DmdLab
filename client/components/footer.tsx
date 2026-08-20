import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="hairline-t mt-24 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-[1.6fr_1fr_1fr] sm:px-8">
        <div>
          <p className="font-display text-2xl tracking-tight">DM·Lab</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            DeepMinds Research Lab, Mbarara University of Science and Technology.
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
            © {new Date().getFullYear()} DeepMinds Research Lab. All rights reserved.
          </p>
          <a
            href="#"
            className="font-mono-x text-muted transition-colors hover:text-accent2"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
