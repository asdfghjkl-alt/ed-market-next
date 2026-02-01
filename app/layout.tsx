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

export const metadata: Metadata = {
  title: "EdMarket",
  description: "Your one-stop shop for all your grocery needs.",
};

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
