import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WikiSidebar from "@/components/WikiSidebar";
import { getWikiTree } from "@/lib/wiki";
import type { WikiLocale } from "@/lib/wiki";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Raita Wiki",
    template: "%s | Raita Wiki",
  },
  description: "Documentation and knowledge base for Raita.",
  metadataBase: new URL("https://raita.ai"),
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sectionsByLocale = {
    en: getWikiTree("en"),
    id: getWikiTree("id"),
  };

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Header />
        <div className="flex min-h-screen">
          <WikiSidebar sectionsByLocale={sectionsByLocale} />
          <main className="flex-1 lg:ml-0">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
