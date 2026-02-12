import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Subscriber = Tables<"newsletter">;

export default function AdminNewsletter() {
  const [subs, setSubs] = useState<Subscriber[]>([]);

  const load = async () => {
    const { data } = await supabase.from("newsletter").select("*").order("created_at", { ascending: false });
    if (data) setSubs(data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este inscrito?")) return;
    await supabase.from("newsletter").delete().eq("id", id);
    toast.success("Inscrito removido.");
    load();
  };

  const exportCSV = () => {
    const csv = ["Email,Nome,Data"].concat(
      subs.map((s) => `${s.email},${s.nome ?? ""},${new Date(s.created_at).toLocaleDateString("pt-BR")}`)
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-saquarema.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Newsletter</h1>
        <Button variant="outline" onClick={exportCSV} disabled={subs.length === 0}>
          <Download className="h-4 w-4 mr-2" />Exportar CSV
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">E-mail</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium">{s.email}</td>
                <td className="p-3 text-muted-foreground">{s.nome ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {subs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum inscrito.</td></tr>}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{subs.length} inscrito(s) no total</p>
    </div>
  );
}
