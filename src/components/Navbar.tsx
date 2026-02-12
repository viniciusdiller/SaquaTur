import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Praias", to: "/praias" },
  { label: "Cultura", to: "/cultura" },
  { label: "Eventos", to: "/eventos" },
  { label: "Gastronomia", to: "/gastronomia" },
];

interface WeatherData {
  temperature?: number;
  waveHeight?: number;
}

export default function Navbar({ weather }: { weather?: WeatherData }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgClass = scrolled || !isHome
    ? "bg-primary/95 backdrop-blur-md shadow-lg py-3"
    : "bg-transparent py-5";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgClass}`}>
      <nav className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <Waves className="h-8 w-8" />
          <div>
            <span className="font-display text-xl font-bold tracking-wide">SAQUAREMA</span>
            <span className="block text-[10px] tracking-[0.2em] opacity-80 font-sans uppercase">Capital Nacional do Surf</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="relative text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium tracking-wide uppercase transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Utilities */}
        <div className="hidden md:flex items-center gap-4">
          {weather?.temperature !== undefined && (
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-primary-foreground text-xs font-medium">
              <span>☀ {weather.temperature}°C</span>
              <span className="opacity-60">|</span>
              <span>🌊 {weather.waveHeight?.toFixed(1) ?? "--"}m</span>
            </div>
          )}
          <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" aria-label="Buscar">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary/95 backdrop-blur-md"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-primary-foreground text-lg font-display tracking-wide uppercase"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {weather?.temperature !== undefined && (
                <li className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-primary-foreground text-sm">
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
