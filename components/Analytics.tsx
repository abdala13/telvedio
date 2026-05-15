"use client";
import Script from "next/script";

export function Analytics({ gaId, searchConsole }: { gaId?: string; searchConsole?: string }) {
  if (!gaId && !searchConsole) return null;
  return (
    <>
      {searchConsole && <meta name="google-site-verification" content={searchConsole} />}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
