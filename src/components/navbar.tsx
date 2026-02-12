import Link from "next/link";
import { Waves } from "lucide-react";

const links = [
  { href: "/", label: "Início" },
  { href: "/gastronomia", label: "Gastronomia" },
  { href: "/cultura", label: "Cultura" }
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-primary/95 py-3 text-primary-foreground backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Waves className="h-7 w-7" />
          <div>
            <p className="font-display text-xl font-bold tracking-wide">SAQUAREMA</p>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">Capital Nacional do Surf</p>
          </div>
        </Link>
        <ul className="flex items-center gap-6 text-sm uppercase tracking-wide">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
