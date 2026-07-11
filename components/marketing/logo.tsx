import Image from "next/image";

import { cn } from "@/lib/utils";

const TAILLES = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
} as const;

/**
 * Icône (image) + texte "EventLink" rendu en Poppins — plutôt qu'une seule
 * image aplatie du logotype complet, qui devient floue/illisible une fois
 * réduite à la taille d'une barre de navigation.
 */
export function Logo({
  size = "md",
  className,
}: {
  size?: keyof typeof TAILLES;
  className?: string;
}) {
  const { icon, text } = TAILLES[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/brand/eventlink-icon.png"
        alt=""
        width={icon}
        height={icon}
        className="rounded-lg"
        priority
      />
      <span className={cn("font-semibold text-el-navy", text)}>
        Event<span className="text-el-gradient">Link</span>
      </span>
    </span>
  );
}
