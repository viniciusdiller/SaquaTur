import { Waves, Wind, Thermometer, Calendar, Compass } from "lucide-react";
import { useWaveData } from "@/hooks/useWaveData";

function getWindLabel(deg: number) {
  const dirs = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
}

function getWeatherLabel(code: number) {
  if (code <= 1) return "☀ Céu limpo";
  if (code <= 3) return "⛅ Parcialmente nublado";
  if (code <= 48) return "☁ Nublado";
  if (code <= 67) return "🌧 Chuva";
  return "⛈ Tempestade";
}

export default function LiveSection() {
  const { data, isLoading, isError } = useWaveData();

  // Next event countdown (Saquarema Pro 2026)
  const eventDate = new Date("2026-06-15T08:00:00Z");
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return (
    <section className="bg-foreground py-16 px-4">
      <div className="container mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground uppercase text-center mb-2">
          Saquarema Ao Vivo
        </h2>
        <p className="text-center text-primary-foreground/60 font-handwritten text-xl mb-10">
          Dados em tempo real das condições do mar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Wave Forecast */}
          <div className="rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 p-6">
            <div className="flex items-center gap-2 text-secondary mb-4">
              <Waves className="h-5 w-5" />
              <span className="font-display uppercase text-sm tracking-wide">Previsão de Surf</span>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-8 bg-primary-foreground/10 rounded animate-pulse" />
                <div className="h-4 bg-primary-foreground/10 rounded animate-pulse w-2/3" />
              </div>
            ) : isError ? (
              <p className="text-primary-foreground/50 text-sm">Dados indisponíveis</p>
            ) : (
              <>
                <p className="text-4xl font-display font-bold text-primary-foreground">
                  {data!.waveHeight.toFixed(1)}m
                </p>
                <div className="mt-3 space-y-1.5 text-primary-foreground/70 text-sm">
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span>Direção: {getWindLabel(data!.waveDirection)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱</span>
                    <span>Período: {data!.wavePeriod.toFixed(0)}s</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Weather */}
          <div className="rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 p-6">
            <div className="flex items-center gap-2 text-accent mb-4">
              <Thermometer className="h-5 w-5" />
              <span className="font-display uppercase text-sm tracking-wide">Clima Agora</span>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-8 bg-primary-foreground/10 rounded animate-pulse" />
                <div className="h-4 bg-primary-foreground/10 rounded animate-pulse w-2/3" />
              </div>
            ) : isError ? (
              <p className="text-primary-foreground/50 text-sm">Dados indisponíveis</p>
            ) : (
              <>
                <p className="text-4xl font-display font-bold text-primary-foreground">
                  {data!.temperature.toFixed(0)}°C
                </p>
                <div className="mt-3 space-y-1.5 text-primary-foreground/70 text-sm">
                  <p>{getWeatherLabel(data!.weatherCode)}</p>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    <span>Vento: {data!.windSpeed.toFixed(0)} km/h {getWindLabel(data!.windDirection)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Next Event */}
          <div className="rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 p-6">
            <div className="flex items-center gap-2 text-restinga mb-4">
              <Calendar className="h-5 w-5" />
              <span className="font-display uppercase text-sm tracking-wide">Próximo Evento</span>
            </div>
            <p className="text-4xl font-display font-bold text-primary-foreground">
              {daysLeft} <span className="text-lg">dias</span>
            </p>
            <p className="mt-3 text-primary-foreground/70 text-sm">
              para o <strong className="text-accent">Saquarema Pro 2026</strong>
            </p>
            <p className="text-primary-foreground/50 text-xs mt-1">WSL Championship Tour</p>
          </div>
        </div>
      </div>
    </section>
  );
}
