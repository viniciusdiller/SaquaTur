import { Link } from "react-router-dom";
import { Waves, Instagram, Facebook, Youtube, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter").insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.info("Este e-mail já está cadastrado!");
      } else {
        toast.error("Erro ao cadastrar. Tente novamente.");
      }
    } else {
      toast.success("Inscrição realizada com sucesso! 🌊");
      setEmail("");
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="h-7 w-7" />
              <span className="font-display text-xl font-bold">SAQUAREMA</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Prefeitura Municipal de Saquarema
              <br />
              Secretaria de Turismo
              <br />
              <span className="text-xs opacity-60">
                Capital Nacional do Surf — Região dos Lagos, RJ
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wide mb-4 text-accent">Explorar</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/praias" className="hover:text-primary-foreground transition-colors">Praias</Link></li>
              <li><Link to="/cultura" className="hover:text-primary-foreground transition-colors">Cultura & História</Link></li>
              <li><Link to="/eventos" className="hover:text-primary-foreground transition-colors">Eventos</Link></li>
              <li><Link to="/gastronomia" className="hover:text-primary-foreground transition-colors">Gastronomia</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wide mb-4 text-accent">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Transparência</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wide mb-4 text-accent">Conecte-se</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-primary-foreground/60 mb-2">Receba as ondas no seu e-mail</p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 rounded-l-full bg-primary-foreground/10 border-0 px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-r-full bg-accent px-4 py-2 text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Prefeitura Municipal de Saquarema. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
