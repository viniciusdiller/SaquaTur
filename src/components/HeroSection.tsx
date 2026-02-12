import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-saquarema.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-sm tracking-[0.3em] uppercase text-primary-foreground/80 font-sans"
        >
          Bem-vindo ao Templo do Surf
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground drop-shadow-lg uppercase leading-tight"
        >
          A Capital Nacional
          <br />
          <span className="text-accent">do Surf</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-primary-foreground/90 font-sans"
        >
          O encontro perfeito entre a adrenalina das ondas e a paz da natureza.
          Descubra o refúgio da Região dos Lagos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/praias"
            className="rounded-full bg-accent px-8 py-3 text-accent-foreground font-display text-lg font-semibold uppercase tracking-wide shadow-xl hover:scale-105 transition-transform"
          >
            Planeje sua Viagem
          </Link>
          <Link
            to="/praias"
            className="rounded-full border-2 border-primary-foreground/60 px-8 py-3 text-primary-foreground font-display text-lg uppercase tracking-wide hover:bg-primary-foreground/10 transition-colors"
          >
            Conheça as Praias
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="h-8 w-8 text-primary-foreground/60 animate-bounce-slow" />
      </div>
    </section>
  );
}
