"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Tables } from "@/lib/supabase/database.types";

export function StatsChart({ data }: { data: Tables<"platform_stats_daily">[] }) {
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    "Revenus (FCFA)": d.revenus_fcfa,
    Demandes: d.nb_demandes,
    Offres: d.nb_offres,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e1e4ee" />
        <XAxis dataKey="date" fontSize={12} stroke="#6b6580" />
        <YAxis fontSize={12} stroke="#6b6580" />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e1e4ee",
            fontSize: 13,
          }}
        />
        <Line type="monotone" dataKey="Revenus (FCFA)" stroke="#ff8a00" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Demandes" stroke="#6a3ec9" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Offres" stroke="#e94e8b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
