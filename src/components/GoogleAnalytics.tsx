import Script from "next/script";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics 스크립트 */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-6JGSLZCTRZ"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-6JGSLZCTRZ');
        `}
      </Script>
    </>
  );
}
