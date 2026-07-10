"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/notifications/actions/mark-read.actions";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

export function NotificationsBell({
  profileId,
  initialNotifications,
}: {
  profileId: string;
  initialNotifications: Tables<"notifications">[];
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          setNotifications((current) => [
            payload.new as Tables<"notifications">,
            ...current,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  const nonLues = notifications.filter((n) => !n.read_at);

  function handleSelect(notification: Tables<"notifications">) {
    if (!notification.read_at) {
      setNotifications((current) =>
        current.map((n) =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      startTransition(() => {
        markNotificationReadAction(notification.id);
      });
    }
    const url = (notification.data as { url?: string } | null)?.url;
    if (url) router.push(url);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {nonLues.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
            >
              {nonLues.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium text-foreground">Notifications</span>
          {nonLues.length > 0 && (
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => {
                setNotifications((current) =>
                  current.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
                );
                startTransition(() => {
                  markAllNotificationsReadAction();
                });
              }}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        {notifications.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            Aucune notification.
          </p>
        )}
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={cn("flex-col items-start gap-0.5", !notification.read_at && "bg-secondary/50")}
            onSelect={() => handleSelect(notification)}
          >
            <span className="text-sm font-medium text-foreground">{notification.title}</span>
            {notification.body && (
              <span className="text-xs text-muted-foreground">{notification.body}</span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {new Date(notification.created_at).toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
