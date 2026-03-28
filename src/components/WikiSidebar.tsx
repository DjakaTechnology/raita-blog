"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { WikiSection, WikiPageMeta } from "@/lib/types";

function flattenSections(sections: WikiSection[]): WikiPageMeta[] {
  const results: WikiPageMeta[] = [];
  for (const section of sections) {
    results.push({ slug: section.slug, title: section.title, description: section.description, order: section.order });
    for (const page of section.pages) {
      results.push(page);
    }
    results.push(...flattenSections(section.children));
  }
  return results;
}

function isActive(currentSlug: string, sectionSlug: string) {
  return currentSlug === sectionSlug || currentSlug.startsWith(sectionSlug + "/");
}

function SidebarSection({ section, currentSlug, linkPrefix = "", depth = 0 }: { section: WikiSection; currentSlug: string; linkPrefix?: string; depth?: number }) {
  const [expanded, setExpanded] = useState(
    isActive(currentSlug, section.slug)
  );

  // Auto-expand when navigating into this section
  useEffect(() => {
    if (isActive(currentSlug, section.slug)) {
      setExpanded(true);
    }
  }, [currentSlug, section.slug]);
  const hasChildren = section.children.length > 0 || section.pages.length > 0;

  return (
    <div className={depth > 0 ? "ml-3 border-l border-border pl-3" : ""}>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 rounded hover:bg-muted transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <Link
          href={`${linkPrefix}/${section.slug}`}
          className={`text-sm py-1 px-1 rounded transition-colors flex-1 ${
            currentSlug === section.slug
              ? "text-primary font-medium bg-primary/10"
              : "text-foreground hover:text-primary hover:bg-muted"
          }`}
        >
          {section.title}
        </Link>
      </div>
      {expanded && (
        <div className="mt-1 flex flex-col gap-0.5">
          {section.pages.map((page) => (
            <Link
              key={page.slug}
              href={`${linkPrefix}/${page.slug}`}
              className={`text-sm py-1 px-1 ml-4 rounded transition-colors ${
                currentSlug === page.slug
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {page.title}
            </Link>
          ))}
          {section.children.map((child) => (
            <SidebarSection key={child.slug} section={child} currentSlug={currentSlug} linkPrefix={linkPrefix} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WikiSidebar({ sections }: { sections: WikiSection[] }) {
  const pathname = usePathname();
  // Extract locale from /wiki/en/... or /wiki/id/...
  const localeMatch = pathname.match(/^\/wiki\/(en|id)(?:\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "en";
  const isIndonesian = locale === "id";
  const currentSlug = pathname.replace(/^\/wiki\/(?:en|id)\/?/, "").replace(/^\//, "").replace(/\/$/, "");
  const linkPrefix = `/${locale}`;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const allPages = flattenSections(sections);
  const searchResults = query.length >= 2
    ? allPages.filter((p) => {
        const q = query.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      })
    : [];

  return (
    <>
      <button
        className="lg:hidden fixed bottom-4 right-4 z-20 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside className={`
        fixed lg:sticky top-0 left-0 z-10 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto p-4 pt-14 transition-transform
        lg:translate-x-0 lg:block
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="relative mb-3">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search wiki..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {query.length >= 2 ? (
          <div className="flex flex-col gap-0.5">
            {searchResults.length === 0 && (
              <p className="text-xs text-muted-foreground px-2 py-2">No results found</p>
            )}
            {searchResults.map((page) => (
              <Link
                key={page.slug}
                href={`${linkPrefix}/${page.slug}`}
                onClick={() => setQuery("")}
                className={`text-sm py-1.5 px-2 rounded transition-colors ${
                  currentSlug === page.slug
                    ? "text-primary font-medium bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {page.title}
                {page.description && (
                  <span className="block text-xs text-muted-foreground truncate">{page.description}</span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <nav className="flex flex-col gap-1">
            <Link
              href={`/${locale}`}
              className={`text-sm font-semibold py-1.5 px-2 rounded transition-colors ${
                currentSlug === "" ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"
              }`}
            >
              Wiki Home
            </Link>
            <div className="flex gap-1 mt-1 mb-1">
              <Link
                href="/en"
                className={`text-xs px-2 py-1 rounded transition-colors ${!isIndonesian ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
              >
                EN
              </Link>
              <Link
                href="/id"
                className={`text-xs px-2 py-1 rounded transition-colors ${isIndonesian ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
              >
                ID
              </Link>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {sections.map((section) => (
                <SidebarSection key={section.slug} section={section} currentSlug={currentSlug} linkPrefix={linkPrefix} />
              ))}
            </div>
          </nav>
        )}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[9] bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
