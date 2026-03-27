"use client";

import { useState } from "react";
import Link from "next/link";
import type { WikiSection } from "@/lib/types";

function SidebarSection({ section, currentSlug, depth = 0 }: { section: WikiSection; currentSlug: string; depth?: number }) {
  const [expanded, setExpanded] = useState(
    currentSlug.startsWith(section.slug)
  );
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
          href={`/${section.slug}`}
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
              href={`/${page.slug}`}
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
            <SidebarSection key={child.slug} section={child} currentSlug={currentSlug} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WikiSidebar({ sections, currentSlug }: { sections: WikiSection[]; currentSlug: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        fixed lg:sticky top-0 left-0 z-10 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto p-4 pt-20 transition-transform
        lg:translate-x-0 lg:block
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={`text-sm font-semibold py-1.5 px-2 rounded transition-colors ${
              currentSlug === "" ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"
            }`}
          >
            Wiki Home
          </Link>
          <div className="mt-2 flex flex-col gap-1">
            {sections.map((section) => (
              <SidebarSection key={section.slug} section={section} currentSlug={currentSlug} />
            ))}
          </div>
        </nav>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[9] bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
