import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Dev By Lukes",
  description: "Showcasing developers named Luke from around the world",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <Script
        async
        strategy="afterInteractive"
        id="google-analytics"
        src="https://www.googletagmanager.com/gtag/js?id=G-DC16T3K5M5"
      />
      <Script
        async
        strategy="afterInteractive"
        id="google-analytics"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17496950280"
      />
      <Script id="google-analytics2" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag('config', 'AW-17496950280');
          gtag("config", "G-DC16T3K5M5");
        `}
      </Script>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
