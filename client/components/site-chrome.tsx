"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

// The /manage area (admin sign-in) is a standalone, chrome-free surface —
// no site nav or footer, so it doesn't read as "part of the public site".
export function SiteChrome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isManage = pathname?.startsWith("/manage");

  if (isManage) {
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
