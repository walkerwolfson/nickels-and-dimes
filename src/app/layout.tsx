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

export const metadata: Metadata = {
  title: "Nickels & Dimes",
  description: "Calisthenics rep tracking — log, clubs, PRs, history.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nickels & Dimes",
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
      <body className="min-h-dvh font-body antialiased">{children}</body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-6BBLY66WJF" />}
    </html>
  );
}
