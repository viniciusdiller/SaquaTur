import { Hero } from "@/components/hero";
import { eventosCulturais } from "@/lib/data";

export default function CulturaPage() {
  return (
    <>
      <Hero
        title="Cultura"
        subtitle="História, arte e tradições que constroem a identidade de Saquarema."
        image="/images/igreja-nazare.jpg"
      />

      <section className="container mx-auto py-14">
        <h2 className="font-display text-4xl uppercase text-primary">Eventos Culturais</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {eventosCulturais.map((evento) => (
            <article key={evento} className="rounded-lg border bg-card p-6">
              <h3 className="font-display text-2xl uppercase">{evento}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Programação com música, dança, gastronomia e valorização da cultura local.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="container mx-auto grid gap-6 md:grid-cols-2">
          <article className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-3xl uppercase text-primary">História de Saquarema</h2>
            <p className="mt-3 text-muted-foreground">
              Das tradições caiçaras ao título de Capital Nacional do Surf, Saquarema reúne patrimônio
              histórico, religiosidade e contato intenso com o mar.
            </p>
          </article>
          <article className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-3xl uppercase text-primary">Destaques Visuais</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["/images/hero-saquarema.jpg", "/images/volei-cbv.jpg", "/images/templo-rock.jpg", "/images/itauna-surf.jpg"].map((imagem) => (
                <div
                  key={imagem}
                  className="h-28 rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url(${imagem})` }}
                />
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
