import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWaveData } from "@/hooks/useWaveData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Waves, MapPin, ArrowRight, Filter } from "lucide-react";
import { motion } from "framer-motion";

const FILTER_OPTIONS = [
  { label: "Todas", value: "todas" },
  { label: "Para Surf", value: "surf" },
  { label: "Para Família", value: "família" },
  { label: "Acessível", value: "acessivel" },
];

export default function Praias() {
  const [activeFilter, setActiveFilter] = useState("todas");
  const { data: weather } = useWaveData();

  const { data: praias, isLoading } = useQuery({
    queryKey: ["praias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("praias")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      if (error) throw error;
      return data;
    },
  });

  const filtered = praias?.filter((p) => {
    if (activeFilter === "todas") return true;
    if (activeFilter === "acessivel") return p.acessivel;
    return p.filtros?.includes(activeFilter);
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar weather={weather ? { temperature: weather.temperature, waveHeight: weather.waveHeight } : undefined} />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground uppercase">
            Praias & Natureza
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            Descubra as praias que fazem de Saquarema a Capital Nacional do Surf
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-3">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-foreground border border-border hover:border-primary"
              }`}
            >
              {f.value === "todas" ? <Filter className="inline h-4 w-4 mr-1" /> : null}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Praias Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))
            : filtered?.map((praia, i) => (
                <PraiaCard key={praia.id} praia={praia} index={i} />
              ))}
        </div>
        {filtered?.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">Nenhuma praia encontrada com este filtro.</p>
        )}
      </section>

      <Footer />
    </div>
  );
}

function PraiaCard({ praia, index }: { praia: any; index: number }) {
  const { data: wave } = useWaveData(praia.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/praias/${praia.slug}`}
        className="group block rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Wave data badge */}
          {wave && (
            <div className="absolute top-3 right-3 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-primary-foreground text-xs font-medium flex items-center gap-1">
              <Waves className="h-3 w-3" />
              {wave.waveHeight.toFixed(1)}m
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            {praia.filtros?.map((f: string) => (
              <span key={f} className="rounded-md bg-restinga/20 text-restinga px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground uppercase group-hover:text-primary transition-colors">
                {praia.nome}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                <MapPin className="h-3 w-3" />
                <span>Saquarema, RJ</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
          </div>
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {praia.descricao_curta}
          </p>
          {wave && (
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>🌊 {wave.waveHeight.toFixed(1)}m</span>
              <span>💨 {wave.windSpeed.toFixed(0)}km/h</span>
              <span>🌡 {wave.temperature.toFixed(0)}°C</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
