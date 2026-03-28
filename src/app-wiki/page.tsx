import type { Metadata } from "next";
import Link from "next/link";
import { getWikiTree } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Raita Wiki",
  description: "Documentation and knowledge base for Raita.",
  alternates: { canonical: "https://raita.ai/wiki/en" },
};

export default function WikiRootPage() {
  const sections = getWikiTree("en");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Wiki</h1>
      <p className="text-muted-foreground mb-8">Browse documentation by topic</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/en/${section.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all no-underline"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
            <span className="text-xs text-muted-foreground mt-3 block">
              {section.pages.length + section.children.length} items
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
