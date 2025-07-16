import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MJSON - JSON File Merger & Transformer",
  description: "Merge and transform JSON files with ease. Advanced JSON field mapping tool with syntax highlighting and export options.",
  keywords: ["JSON", "merger", "transformer", "field mapping", "data processing", "file converter"],
  authors: [{ name: "MJSON Team" }],
  creator: "MJSON",
  publisher: "MJSON",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo mjson rounded.svg",
    apple: "/logo mjson rounded.svg",
    shortcut: "/logo mjson rounded.svg",
  },
  openGraph: {
    title: "MJSON - JSON File Merger & Transformer",
    description: "Merge and transform JSON files with ease. Advanced JSON field mapping tool with syntax highlighting and export options.",
    url: "https://mjson.vercel.app",
    siteName: "MJSON",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MJSON - JSON File Merger & Transformer",
    description: "Merge and transform JSON files with ease. Advanced JSON field mapping tool with syntax highlighting and export options.",
    creator: "@mjson",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
