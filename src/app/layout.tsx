import type { Metadata } from "next";
import { Black_Ops_One, Oswald, IBM_Plex_Mono, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-ops-one",
});

const oswald = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const TAGLINE = "Log Reps, Chase PRs, and Compete With Friends";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Nickels & Dimes",
  url: "https://nickelsanddimes.app",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description: TAGLINE,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nickelsanddimes.app"),
  title: "Nickels & Dimes",
  description: TAGLINE,
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nickels & Dimes",
  },
  openGraph: {
    title: "Nickels & Dimes",
    description: TAGLINE,
    siteName: "Nickels & Dimes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nickels & Dimes",
    description: TAGLINE,
    site: "@WWolfson97",
    creator: "@WWolfson97",
  },
};

export const viewport = {
  themeColor: "#8C6FF0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${blackOpsOne.variable} ${oswald.variable} ${ibmPlexMono.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-dvh font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-6BBLY66WJF" />}
    </html>
  );
}
