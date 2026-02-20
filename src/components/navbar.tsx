"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Waves, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "Praias", to: "/praias" },
  { label: "Cultura", to: "/cultura" },
  { label: "Eventos", to: "/eventos" },
  { label: "Gastronomia", to: "/gastronomia" },
  { label: "Serviços Para o Turista", to: "/servicos" },
  { label: "Explore Saqua", to: "https://meidesaqua.saquarema.rj.gov.br/" },
];

interface WeatherData {
  temperature?: number;
  waveHeight?: number;
}

export function Navbar({ weather }: { weather?: WeatherData }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgClass =
    scrolled || !isHome
      ? "bg-primary/95 backdrop-blur-md shadow-lg py-3"
      : "bg-transparent py-5";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${bgClass}`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary-foreground"
        >
          <Waves className="h-8 w-8" />
          <div>
            <span className="font-display text-xl font-bold tracking-wide">
              SAQUAREMA
            </span>
            <span className="block text-[10px] font-sans uppercase tracking-[0.2em] opacity-80">
              Capital Nacional do Surf
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                href={link.to}
                className="relative text-sm font-medium uppercase tracking-wide text-primary-foreground/90 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all hover:text-primary-foreground hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          {weather?.temperature !== undefined && (
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground">
              <span>☀ {weather.temperature}°C</span>
              <span className="opacity-60">|</span>
              <span>🌊 {weather.waveHeight?.toFixed(1) ?? "--"}m</span>
            </div>
          )}
          <button
            className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <button
          className="text-primary-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-lg uppercase tracking-wide text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {weather?.temperature !== undefined && (
                <li className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
                  <span>☀ {weather.temperature}°C</span>
                  <span>|</span>
                  <span>🌊 {weather.waveHeight?.toFixed(1) ?? "--"}m</span>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
