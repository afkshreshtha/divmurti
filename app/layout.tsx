import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Jaipur Murti Bhandar – Handcrafted Marble Deity Idols",
  description:
    "Discover sacred handcrafted marble idols of Hindu deities like Krishna, Shiva, Ganesh, and more. Perfect for homes, temples, and gifts.",
  keywords:
    "marble murti, deity idols, hindu god statues, marble god idols, handmade idols, JaipurMurtiBhandar",
  authors: [{ name: "JaipurMurtiBhandar" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Jaipur Murti Bhandar – Handcrafted Marble Idols",
    description:
      "Elegant and devotional marble deity idols for your home and temple.",
    url: "https://JaipurMurtiBhandar.vercel.app", // Update with your actual domain
    siteName: "Divmurti",
    images: [
      {
        url: "https://divmurti.vercel.app/og-image.jpg", // Optional: a nice image for social media
        width: 1200,
        height: 630,
        alt: "JaipurMurtiBhandar – Handcrafted Marble Idols",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
