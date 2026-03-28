import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getWikiPage, getAllWikiSlugs, getAllWikiPageMeta, getWikiSection, getWikiPageList } from "@/lib/wiki";
import type { WikiLocale } from "@/lib/wiki";
import WikiBreadcrumb from "@/components/WikiBreadcrumb";
import TableExpander from "@/components/TableExpander";
import ImageLightbox from "@/components/ImageLightbox";
import CodeCopyButton from "@/components/CodeCopyButton";
import "../wiki-content.css";

function parseLocaleSlug(rawSlug: string[]): { locale: WikiLocale; slug: string[] } {
  if (rawSlug[0] === "id") {
    return { locale: "id", slug: rawSlug.slice(1) };
  }
  return { locale: "en", slug: rawSlug };
}

export function generateStaticParams() {
  const enSlugs = getAllWikiSlugs("en").map((slug) => ({
    slug: slug.split("/"),
  }));
  const idSlugs = getAllWikiSlugs("id").map((slug) => ({
    slug: ["id", ...slug.split("/")],
  }));
  return [...enSlugs, ...idSlugs];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const { locale, slug } = parseLocaleSlug(rawSlug);
  const page = await getWikiPage(slug, locale);
  if (!page) return {};
  const urlPrefix = locale === "en" ? "/wiki" : "/wiki/id";
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://raita.ai${urlPrefix}/${page.slug}` },
    openGraph: { title: page.title, description: page.description, type: "article", url: `https://raita.ai${urlPrefix}/${page.slug}` },
  };
}

export default async function WikiPageRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: rawSlug } = await params;
  const { locale, slug } = parseLocaleSlug(rawSlug);
  const page = await getWikiPage(slug, locale);
  if (!page) notFound();

  const linkPrefix = locale === "en" ? "" : "/id";
  const prevLabel = locale === "en" ? "← Previous" : "← Sebelumnya";
  const nextLabel = locale === "en" ? "Next →" : "Selanjutnya →";

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
      <WikiBreadcrumb slugParts={slug} titles={titles} basePath={linkPrefix} />
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
              href={`${linkPrefix}/${p.slug}`}
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
              href={`${linkPrefix}/${child.slug}`}
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
              href={`${linkPrefix}/${prev.slug}`}
              className="group flex-1 flex flex-col items-start rounded-lg border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all no-underline"
            >
              <span className="text-xs text-muted-foreground mb-1">{prevLabel}</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`${linkPrefix}/${next.slug}`}
              className="group flex-1 flex flex-col items-end text-right rounded-lg border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all no-underline"
            >
              <span className="text-xs text-muted-foreground mb-1">{nextLabel}</span>
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
