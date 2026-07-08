import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

function Loader({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
    >
      <Loader2 className="size-4 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
      <span className="sr-only">Chargement en cours</span>
    </span>
  );
}

function FullPageLoader({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Loader label={label} />
    </div>
  );
}

export { Loader, FullPageLoader };
