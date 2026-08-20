"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { HERO_SLIDES } from "@/components/marketing/hero-slides";

const INTERVALLE_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || enPause) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, INTERVALLE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enPause]);

  function allerA(i: number) {
    setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length);
  }

  const slide = HERO_SLIDES[index];

  return (
    <div
      className="group relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl shadow-lg sm:aspect-[3/4] lg:max-w-none"
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
      onFocus={() => setEnPause(true)}
      onBlur={() => setEnPause(false)}
    >
      {/* Zone annoncée aux lecteurs d'écran, sans dupliquer visuellement la légende */}
      <p className="sr-only" aria-live="polite">
        {slide.categorie} — image {index + 1} sur {HERO_SLIDES.length}
      </p>

      {HERO_SLIDES.map((s, i) => {
        const SIcone = s.icone;
        return (
          <div
            key={s.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
          >
            {s.src ? (
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-el-gradient">
                <SIcone className="size-12 text-white/90" strokeWidth={1.5} />
                <span className="text-sm font-medium text-white/90">{s.categorie}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Légende, lisible sur photo comme sur repli dégradé */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-5 pt-10">
        <p className="text-sm font-medium text-white">{slide.categorie}</p>
      </div>

      {/* Précédent / suivant — discrets, visibles au survol/focus */}
      <button
        type="button"
        onClick={() => allerA(index - 1)}
        aria-label="Image précédente"
        className="absolute left-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-el-navy opacity-0 backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => allerA(index + 1)}
        aria-label="Image suivante"
        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-el-navy opacity-0 backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Indicateurs de position */}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => allerA(i)}
            aria-label={`Aller à l'image ${i + 1} : ${s.categorie}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}
