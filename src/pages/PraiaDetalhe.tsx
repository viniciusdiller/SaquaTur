import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWaveData } from "@/hooks/useWaveData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Waves, Wind, Thermometer, Compass, CheckCircle, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PraiaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const { data: wave, isLoading: waveLoading } = useWaveData(slug, true);
  const { data: navWeather } = useWaveData();

  const { data: praia, isLoading } = useQuery({
    queryKey: ["praia", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("praias")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Build hourly chart data (next 48h)
  const chartData = wave?.hourly
    ? wave.hourly.time.slice(0, 48).map((t, i) => ({
        hora: new Date(t).getHours() + "h",
        ondas: wave.hourly!.waveHeight[i],
        vento: wave.hourly!.windSpeed[i],
        temp: wave.hourly!.temperature[i],
      }))
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!praia) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Praia não encontrada</h1>
          <Link to="/praias" className="text-primary mt-4 inline-block hover:underline">
            ← Voltar para Praias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar weather={navWeather ? { temperature: navWeather.temperature, waveHeight: navWeather.waveHeight } : undefined} />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl">
          <Link to="/praias" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm mb-4">
            <ArrowLeft className="h-4 w-4" /> Voltar para Praias
          </Link>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground uppercase">
            {praia.nome}
          </h1>
          <p className="mt-2 text-primary-foreground/80">{praia.descricao_curta}</p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Current conditions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <ConditionCard
            icon={<Waves className="h-5 w-5 text-secondary" />}
            label="Ondas"
            value={waveLoading ? "..." : `${wave?.waveHeight.toFixed(1)}m`}
          />
          <ConditionCard
            icon={<Compass className="h-5 w-5 text-secondary" />}
            label="Período"
            value={waveLoading ? "..." : `${wave?.wavePeriod.toFixed(0)}s`}
          />
          <ConditionCard
            icon={<Wind className="h-5 w-5 text-accent" />}
            label="Vento"
            value={waveLoading ? "..." : `${wave?.windSpeed.toFixed(0)} km/h`}
          />
          <ConditionCard
            icon={<Thermometer className="h-5 w-5 text-accent" />}
            label="Temperatura"
            value={waveLoading ? "..." : `${wave?.temperature.toFixed(0)}°C`}
          />
        </div>

        {/* Wave chart */}
        {chartData.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground uppercase mb-4">
              Previsão 48h — Altura das Ondas
            </h2>
            <div className="bg-card border border-border rounded-xl p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(179.5, 100%, 21.6%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(179.5, 100%, 21.6%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hora" tick={{ fontSize: 10 }} interval={5} />
                  <YAxis tick={{ fontSize: 10 }} unit="m" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="ondas"
                    stroke="hsl(179.5, 100%, 21.6%)"
                    fill="url(#waveGrad)"
                    strokeWidth={2}
                    name="Ondas (m)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground uppercase mb-4">
            Sobre a Praia
          </h2>
          <p className="text-muted-foreground leading-relaxed">{praia.descricao}</p>
        </div>

        {/* Info prática */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground uppercase mb-4">
            Informações Práticas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Dificuldade" value={praia.dificuldade ?? "N/A"} />
            <InfoBool label="Estacionamento" value={praia.estacionamento} />
            <InfoBool label="Quiosques" value={praia.quiosques} />
            <InfoBool label="Acessível" value={praia.acessivel} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ConditionCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-display text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-xs text-muted-foreground uppercase">{label}</p>
      <p className="font-medium text-foreground capitalize mt-1">{value}</p>
    </div>
  );
}

function InfoBool({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="rounded-lg bg-muted p-3 flex items-center gap-2">
      {value ? (
        <CheckCircle className="h-4 w-4 text-restinga" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
      <div>
        <p className="text-xs text-muted-foreground uppercase">{label}</p>
        <p className="font-medium text-foreground text-sm mt-0.5">{value ? "Sim" : "Não"}</p>
      </div>
    </div>
  );
}
