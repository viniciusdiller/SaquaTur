import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <>
      <Hero
        title="Saquarema"
        subtitle="Descubra praias, cultura e sabores únicos da capital nacional do surf."
        image="/images/hero-saquarema.jpg"
      />
      <section className="container mx-auto grid gap-6 py-14 md:grid-cols-3">
        {[
          ["Praias", "Do mar de Itaúna às lagoas, natureza vibrante em todos os cantos."],
          ["Cultura", "História caiçara, fé, música e tradição em constante movimento."],
          ["Gastronomia", "Sabores do mar e receitas típicas com identidade local."]
        ].map(([titulo, texto]) => (
          <article key={titulo} className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-display text-2xl uppercase text-primary">{titulo}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{texto}</p>
          </article>
        ))}
      </section>
    </>
  );
}
