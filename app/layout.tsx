import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ADD THESE LINES: choose a stable site URL for metadataBase (best for SEO)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  // ADD THIS LINE: required so canonical + OG URLs become absolute
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "True Tax Cost | State Tax Comparison Calculator + Social Security Value Calculator",
    template: "%s | True Tax Cost",
  },
  description:
    "Two calculators: compare state income tax and property tax when moving between U.S. states, and estimate Social Security value versus investing OASDI contributions.",

  openGraph: {
    title:
      "True Tax Cost | State Tax Comparison Calculator + Social Security Value Calculator",
    description:
      "Compare state income tax and property tax by state, and estimate Social Security value versus investing. Tools for relocation and retirement planning.",
    type: "website",
    siteName: "True Tax Cost",
    locale: "en_US",
    url: "/",
  },

  twitter: {
    card: "summary",
    title:
      "True Tax Cost | State Tax Comparison Calculator + Social Security Value Calculator",
    description:
      "Compare state taxes and estimate Social Security value versus investing. Tools for relocation and retirement planning.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
