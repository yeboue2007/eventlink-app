"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const CLE_REPORT = "eventlink_install_dismissed_until";
const DUREE_REPORT_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours avant de re-proposer

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function estDejaInstallee(): boolean {
  if (typeof window === "undefined") return false;
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari expose ce flag ; pas de beforeinstallprompt sur iOS de toute façon.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return standalone;
}

function estReporte(): boolean {
  if (typeof window === "undefined") return false;
  const valeur = localStorage.getItem(CLE_REPORT);
  if (!valeur) return false;
  return Date.now() < Number(valeur);
}

export function InstallPromptBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (estDejaInstallee() || estReporte()) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function handleAppInstalled() {
      setVisible(false);
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "dismissed") {
      localStorage.setItem(CLE_REPORT, String(Date.now() + DUREE_REPORT_MS));
    }
    setVisible(false);
    setPromptEvent(null);
  }

  function handleDismiss() {
    localStorage.setItem(CLE_REPORT, String(Date.now() + DUREE_REPORT_MS));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Installer l'application EventLink"
      className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-2xl bg-el-navy px-4 py-3 shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-el-gradient">
        <Download className="size-5 text-white" />
      </div>
      <div className="flex-1 text-sm text-white">
        <p className="font-medium">Installer EventLink</p>
        <p className="text-white/70">Accès rapide depuis votre écran d&apos;accueil</p>
      </div>
      <Button size="sm" variant="primary" onClick={handleInstall}>
        Installer
      </Button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Fermer"
        className="shrink-0 rounded-full p-1 text-white/60 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
