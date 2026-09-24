import Script from "next/script";

// Opt-in Google Analytics 4 loader. Renders nothing unless NEXT_PUBLIC_GA_ID
// is set (see .env.example), so it's safe by default and never blocks
// render — scripts load with "afterInteractive" so they don't delay first
// paint. Addresses the "Implement an Analytics Tool" recommendation without
// hardcoding a tracking ID that isn't ours to ship.
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
