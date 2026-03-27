"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <Link href="https://raita.ai" className="flex items-center">
          <img src="/blog/favicon.webp" alt="Raita logo" className="w-8 h-8 rounded" />
          <span className="text-lg font-bold ml-2">Raita</span>
        </Link>
        <nav className="md:flex flex-row gap-2 items-center justify-center hidden">
          <Link href="https://raita.ai" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">Home</Link>
          <Link href="/blog" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-primary">Blog</Link>
          <Link href="/wiki" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">Wiki</Link>
        </nav>
        <button className="md:hidden inline p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-2">
          <Link href="https://raita.ai" className="px-4 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/blog" className="px-4 py-2 text-sm rounded-md hover:bg-muted text-primary" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/wiki" className="px-4 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Wiki</Link>
        </div>
      )}
    </div>
  );
}
