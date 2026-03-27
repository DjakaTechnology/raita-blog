import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWikiPage, getAllWikiSlugs, getAllWikiPageMeta } from "@/lib/wiki";
import WikiBreadcrumb from "@/components/WikiBreadcrumb";
import TableExpander from "@/components/TableExpander";
import "../wiki-content.css";

export function generateStaticParams() {
  return getAllWikiSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWikiPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://raita.ai/wiki/${page.slug}` },
    openGraph: { title: page.title, description: page.description, type: "article", url: `https://raita.ai/wiki/${page.slug}` },
  };
}

export default async function WikiPageRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getWikiPage(slug);
  if (!page) notFound();

  const allPages = getAllWikiPageMeta();
  const titles: Record<string, string> = {};
  for (const p of allPages) {
    titles[p.slug] = p.title;
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 py-8">
      <WikiBreadcrumb slugParts={slug} titles={titles} />
      <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground mb-6" style={{ fontFamily: "var(--font-sans)" }}>
        {page.title}
      </h1>
      <div className="wiki-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      <TableExpander />
    </div>
  );
}
