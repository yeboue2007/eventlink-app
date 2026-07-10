import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            size === "sm" ? "size-4" : "size-6",
            n <= rating ? "fill-el-gold text-el-gold" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}
