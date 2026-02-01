import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/database/category.model";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "EdMarket",
    template: "%s | EdMarket",
  },
  description: "Your one-stop shop for all your grocery needs.",
  openGraph: {
    title: {
      default: "EdMarket",
      template: "%s | EdMarket",
    },
    description: "Your one-stop shop for all your grocery needs.",
    siteName: "EdMarket",
    locale: "en_AU",
    type: "website",
    images: ["/EdMarket.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "EdMarket",
      template: "%s | EdMarket",
    },
    description: "Your one-stop shop for all your grocery needs.",
    images: ["/EdMarket.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await (async () => {
    await connectToDatabase();
    return await Category.find().lean();
  })();

  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <Providers>
          <Navbar categories={JSON.parse(JSON.stringify(categories))} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
