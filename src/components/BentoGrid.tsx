import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import itaunaSurf from "@/assets/itauna-surf.jpg";
import igrejaNazare from "@/assets/igreja-nazare.jpg";
import gastronomia from "@/assets/gastronomia.jpg";
import voleiCbv from "@/assets/volei-cbv.jpg";
import temploRock from "@/assets/templo-rock.jpg";

const experiences = [
  {
    title: "Itaúna: O Maracanã do Surf",
    description: "Ondas de classe mundial e etapas da WSL",
    image: itaunaSurf,
    link: "/praias/itauna",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Igreja de Nazaré",
    description: "Fé e história desde 1630",
    image: igrejaNazare,
    link: "/cultura",
    span: "md:row-span-2",
  },
  {
    title: "Gastronomia Caiçara",
    description: "Sabores do mar na sua mesa",
    image: gastronomia,
    link: "/gastronomia",
    span: "md:col-span-2",
  },
  {
    title: "Vôlei CBV",
    description: "Casa das seleções campeãs",
    image: voleiCbv,
    link: "/esportes",
    span: "",
  },
  {
    title: "Templo do Rock",
    description: "O legado de Serguei vive aqui",
    image: temploRock,
    link: "/cultura",
    span: "",
  },
];

export default function BentoGrid() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground uppercase text-center mb-4">
          Experiências Únicas
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Descubra o que faz de Saquarema um destino inesquecível
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {experiences.map((exp) => (
            <Link
              key={exp.title}
              to={exp.link}
              className={`group relative overflow-hidden rounded-2xl min-h-[220px] ${exp.span}`}
            >
              <img
                src={exp.image}
                alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:from-black/80" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl md:text-2xl font-bold text-white uppercase">
                  {exp.title}
                </h3>
                <p className="text-white/80 text-sm mt-1">{exp.description}</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-6 w-6 text-accent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
