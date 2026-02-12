import { useEffect, useState } from "react";
import { UmbrellaIcon, CalendarDays, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  praias: number;
  eventos: number;
  newsletter: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ praias: 0, eventos: 0, newsletter: 0 });

  useEffect(() => {
    const load = async () => {
      const [p, e, n] = await Promise.all([
        supabase.from("praias").select("id", { count: "exact", head: true }),
        supabase.from("eventos").select("id", { count: "exact", head: true }),
        supabase.from("newsletter").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        praias: p.count ?? 0,
        eventos: e.count ?? 0,
        newsletter: n.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Praias", value: stats.praias, icon: UmbrellaIcon, color: "text-primary" },
    { label: "Eventos", value: stats.eventos, icon: CalendarDays, color: "text-secondary" },
    { label: "Newsletter", value: stats.newsletter, icon: Mail, color: "text-accent" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-2">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <span className="text-sm text-muted-foreground">{c.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
