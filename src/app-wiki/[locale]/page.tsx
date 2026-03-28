import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getWikiTree, WIKI_LOCALES } from "@/lib/wiki";
import type { WikiLocale } from "@/lib/wiki";

const labels: Record<WikiLocale, { title: string; subtitle: string; items: string }> = {
  en: { title: "Wiki", subtitle: "Browse documentation by topic", items: "items" },
  id: { title: "Wiki", subtitle: "Jelajahi dokumentasi berdasarkan topik", items: "item" },
};

export function generateStaticParams() {
  return WIKI_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Raita Wiki (Indonesia)" : "Raita Wiki",
    description: isId ? "Dokumentasi dan panduan lengkap untuk Raita." : "Documentation and knowledge base for Raita.",
    alternates: { canonical: `https://raita.ai/wiki/${locale}` },
  };
}

export default async function WikiLocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!WIKI_LOCALES.includes(locale as WikiLocale)) notFound();
  const loc = locale as WikiLocale;

  const sections = getWikiTree(loc);
  const l = labels[loc];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">{l.title}</h1>
      <p className="text-muted-foreground mb-8">{l.subtitle}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${locale}/${section.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all no-underline"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
            <span className="text-xs text-muted-foreground mt-3 block">
              {section.pages.length + section.children.length} {l.items}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
