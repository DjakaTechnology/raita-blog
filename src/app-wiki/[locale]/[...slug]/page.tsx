import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getWikiPage, getAllWikiSlugs, getAllWikiPageMeta, getWikiSection, getWikiPageList, WIKI_LOCALES } from "@/lib/wiki";
import type { WikiLocale } from "@/lib/wiki";
import WikiBreadcrumb from "@/components/WikiBreadcrumb";
import TableExpander from "@/components/TableExpander";
import ImageLightbox from "@/components/ImageLightbox";
import CodeCopyButton from "@/components/CodeCopyButton";
import "../../wiki-content.css";

const i18n: Record<WikiLocale, { prev: string; next: string }> = {
  en: { prev: "← Previous", next: "Next →" },
  id: { prev: "← Sebelumnya", next: "Selanjutnya →" },
};

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  for (const locale of WIKI_LOCALES) {
    for (const slug of getAllWikiSlugs(locale)) {
      params.push({ locale, slug: slug.split("/") });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getWikiPage(slug, locale as WikiLocale);
  if (!page) return {};
  const pageUrl = `https://raita.ai/wiki/${locale}/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${page.title} | Raita Wiki`,
      description: page.description,
      type: "article",
      url: pageUrl,
      siteName: "Raita Wiki",
      images: [{ url: "https://raita.ai/wiki/og-wiki.png", width: 1200, height: 630, alt: "Raita Wiki" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | Raita Wiki`,
      description: page.description,
      images: ["https://raita.ai/wiki/og-wiki.png"],
    },
  };
}

export default async function WikiPageRoute({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!WIKI_LOCALES.includes(rawLocale as WikiLocale)) notFound();
  const locale = rawLocale as WikiLocale;

  const page = await getWikiPage(slug, locale);
  if (!page) notFound();

  const labels = i18n[locale];
  const localePrefix = `/${locale}`;

  const allPages = getAllWikiPageMeta(locale);
  const titles: Record<string, string> = {};
  for (const p of allPages) {
    titles[p.slug] = p.title;
  }

  const section = getWikiSection(slug.join("/"), locale);

  const pageList = getWikiPageList(locale);
  const currentSlug = slug.join("/");
  const currentIndex = pageList.findIndex((p) => p.slug === currentSlug);
  const prev = currentIndex > 0 ? pageList[currentIndex - 1] : null;
  const next = currentIndex < pageList.length - 1 ? pageList[currentIndex + 1] : null;

  return (
    <div className="max-w-[680px] mx-auto px-6 py-8">
      <WikiBreadcrumb slugParts={slug} titles={titles} basePath={localePrefix} />
      <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground mb-6" style={{ fontFamily: "var(--font-sans)" }}>
        {page.title}
      </h1>
      {page.content && (
        <div className="wiki-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      )}
      {section && (section.pages.length > 0 || section.children.length > 0) && (
        <div className="mt-8 space-y-3">
          {section.pages.map((p) => (
            <Link
              key={p.slug}
              href={`${localePrefix}/${p.slug}`}
              className="group block rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all no-underline"
            >
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              {p.description && (
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              )}
            </Link>
          ))}
          {section.children.map((child) => (
            <Link
              key={child.slug}
              href={`${localePrefix}/${child.slug}`}
              className="group block rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all no-underline"
            >
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {child.title}
              </h3>
              {child.description && (
                <p className="text-sm text-muted-foreground mt-1">{child.description}</p>
              )}
              <span className="text-xs text-muted-foreground mt-2 block">
                {child.pages.length + child.children.length} items
              </span>
            </Link>
          ))}
        </div>
      )}

      {(prev || next) && (
        <nav className="mt-12 flex items-stretch gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              href={`${localePrefix}/${prev.slug}`}
              className="group flex-1 flex flex-col items-start rounded-lg border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all no-underline"
            >
              <span className="text-xs text-muted-foreground mb-1">{labels.prev}</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`${localePrefix}/${next.slug}`}
              className="group flex-1 flex flex-col items-end text-right rounded-lg border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all no-underline"
            >
              <span className="text-xs text-muted-foreground mb-1">{labels.next}</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      )}

      <TableExpander />
      <CodeCopyButton />
      <ImageLightbox />
    </div>
  );
}
