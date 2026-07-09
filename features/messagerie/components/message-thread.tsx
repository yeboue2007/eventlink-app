"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageAction } from "@/features/messagerie/actions/send-message.actions";
import type { MessageAvecAuteur } from "@/features/messagerie/queries/list-messages";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function MessageThread({
  demandeId,
  offreId,
  currentUserId,
  initialMessages,
  revalidateBasePath,
}: {
  demandeId: string;
  offreId: string;
  currentUserId: string;
  initialMessages: MessageAvecAuteur[];
  revalidateBasePath: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [state, formAction, isPending] = useActionState(
    sendMessageAction.bind(null, demandeId, offreId, revalidateBasePath),
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Écoute en temps réel des nouveaux messages de cette offre (Supabase Realtime).
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:offre:${offreId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `offre_id=eq.${offreId}` },
        (payload) => {
          const nouveauMessage = payload.new as MessageAvecAuteur;
          setMessages((current) =>
            current.some((m) => m.id === nouveauMessage.id)
              ? current
              : [...current, nouveauMessage]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [offreId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!state?.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Aucun message pour le moment. Lancez la conversation.
          </p>
        )}
        {messages.map((message) => {
          const estMoi = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={cn("flex flex-col", estMoi ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  estMoi
                    ? "bg-el-gradient text-white"
                    : "bg-card text-foreground border border-border"
                )}
              >
                {message.content}
              </div>
              <span className="mt-0.5 text-xs text-muted-foreground">
                {message.profiles?.full_name ?? "Utilisateur"} ·{" "}
                {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form ref={formRef} action={formAction} className="flex gap-2">
        <Input
          name="content"
          placeholder="Écrire un message…"
          autoComplete="off"
          required
        />
        <Button type="submit" variant="primary" disabled={isPending}>
          Envoyer
        </Button>
      </form>
      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}
