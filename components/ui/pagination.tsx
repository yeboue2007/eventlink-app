import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * Pagination basée sur des liens (Server Component friendly) : chaque page
 * est une URL (`hrefForPage`), pas un état client. Utiliser un composant
 * client séparé si une pagination purement côté client est nécessaire.
 */
function Pagination({
  page,
  totalPages,
  hrefForPage,
  className,
}: {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <PaginationLink
        href={hrefForPage(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="size-4" />
      </PaginationLink>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex size-9 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <PaginationLink key={p} href={hrefForPage(p)} isActive={p === page}>
            {p}
          </PaginationLink>
        )
      )}

      <PaginationLink
        href={hrefForPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight className="size-4" />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  isActive,
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { isActive?: boolean; disabled?: boolean }) {
  if (disabled) {
    return (
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "pointer-events-none opacity-40",
          className
        )}
      >
        {props.children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "ghost", size: "icon" }),
        className
      )}
      {...props}
    />
  );
}

function getPageList(current: number, total: number): (number | "…")[] {
  const delta = 1;
  const range: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    } else if (range.at(-1) !== "…") {
      range.push("…");
    }
  }
  return range;
}

export { Pagination };
