import { Hero } from "@/components/hero";
import { pratosTipicos, restaurantes } from "@/lib/data";

export default function GastronomiaPage() {
  return (
    <>
      <Hero
        title="Gastronomia"
        subtitle="Explore restaurantes e pratos típicos com o sabor autêntico de Saquarema."
        image="/images/gastronomia.jpg"
      />

      <section className="container mx-auto py-14">
        <h2 className="font-display text-4xl uppercase text-primary">Restaurantes</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {restaurantes.map((restaurante) => (
            <article key={restaurante.nome} className="overflow-hidden rounded-lg border bg-card">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${restaurante.imagem})` }}
              />
              <div className="p-5">
                <h3 className="font-display text-2xl uppercase">{restaurante.nome}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{restaurante.descricao}</p>
                <button className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
                  Ver detalhes
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container mx-auto">
          <h2 className="font-display text-4xl uppercase">Pratos Típicos</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {pratosTipicos.map((prato) => (
              <li key={prato} className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-5">
                {prato}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
