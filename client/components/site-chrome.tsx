"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

// The admin sign-in screen is a standalone, chrome-free surface no site
// nav or footer, so it doesn't read as "part of the public site". Other
// /manage pages (e.g. the applications inbox) are part of the site and get
// the normal header/footer.
export function SiteChrome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/manage/login");

  if (isLogin) {
    return <main className="min-h-dvh">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
