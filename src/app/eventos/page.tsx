export default function EventosPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary px-4 pb-12 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-5xl font-bold uppercase text-primary-foreground md:text-6xl">
            Eventos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Acompanhe os principais eventos esportivos e culturais de Saquarema.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            [
              "Saquarema Pro",
              "Etapa mundial com os melhores surfistas do planeta.",
            ],
            ["Festival de Verão", "Música, cultura e gastronomia na orla."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
            ["Circuito de Vôlei", "Grandes torneios e eventos da CBV."],
          ].map(([titulo, desc]) => (
            <article
              key={titulo}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="font-display text-2xl uppercase text-primary">
                {titulo}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <h1>CADA MES UMA CAIXA COM CALENDÁRIO DE EVENTOS NO MES</h1>
    </div>
  );
}
