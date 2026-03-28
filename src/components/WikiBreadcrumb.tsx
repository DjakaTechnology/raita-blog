import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function WikiBreadcrumb({ slugParts, titles, basePath = "" }: { slugParts: string[]; titles: Record<string, string>; basePath?: string }) {
  if (slugParts.length === 0) return null;

  const items: BreadcrumbItem[] = [{ label: "Wiki", href: basePath ? `${basePath}` : "/" }];

  let accumulated = "";
  for (const part of slugParts) {
    accumulated = accumulated ? `${accumulated}/${part}` : part;
    items.push({
      label: titles[accumulated] || part.replace(/-/g, " "),
      href: `${basePath}/${accumulated}`,
    });
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 && <span>/</span>}
          {i === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
