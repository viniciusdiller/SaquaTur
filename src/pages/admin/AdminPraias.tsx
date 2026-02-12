import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Praia = Tables<"praias">;

const empty: Partial<Praia> = {
  nome: "", slug: "", descricao_curta: "", descricao: "",
  latitude: -22.92, longitude: -42.51, ativo: true,
};

export default function AdminPraias() {
  const [praias, setPraias] = useState<Praia[]>([]);
  const [editing, setEditing] = useState<Partial<Praia> | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("praias").select("*").order("ordem");
    if (data) setPraias(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.nome || !editing?.slug) {
      toast.error("Nome e slug são obrigatórios.");
      return;
    }
    setSaving(true);
    if (editing.id) {
      const { error } = await supabase.from("praias").update({
        nome: editing.nome,
        slug: editing.slug,
        descricao_curta: editing.descricao_curta ?? "",
        descricao: editing.descricao ?? "",
        latitude: editing.latitude ?? -22.92,
        longitude: editing.longitude ?? -42.51,
        ativo: editing.ativo ?? true,
      }).eq("id", editing.id);
      if (error) toast.error("Erro ao salvar."); else toast.success("Praia atualizada!");
    } else {
      const { error } = await supabase.from("praias").insert({
        nome: editing.nome,
        slug: editing.slug,
        descricao_curta: editing.descricao_curta ?? "",
        descricao: editing.descricao ?? "",
        latitude: editing.latitude ?? -22.92,
        longitude: editing.longitude ?? -42.51,
        ativo: editing.ativo ?? true,
      });
      if (error) toast.error("Erro ao criar."); else toast.success("Praia criada!");
    }
    setSaving(false);
    setOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    await supabase.from("praias").delete().eq("id", id);
    toast.success("Praia removida.");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Praias</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" />Nova Praia</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Nova"} Praia</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nome</Label><Input value={editing.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
                  <div><Label>Slug</Label><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                </div>
                <div><Label>Descrição curta</Label><Input value={editing.descricao_curta ?? ""} onChange={(e) => setEditing({ ...editing, descricao_curta: e.target.value })} /></div>
                <div><Label>Descrição</Label><Textarea rows={4} value={editing.descricao ?? ""} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Latitude</Label><Input type="number" step="any" value={editing.latitude ?? ""} onChange={(e) => setEditing({ ...editing, latitude: parseFloat(e.target.value) })} /></div>
                  <div><Label>Longitude</Label><Input type="number" step="any" value={editing.longitude ?? ""} onChange={(e) => setEditing({ ...editing, longitude: parseFloat(e.target.value) })} /></div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.ativo ?? true} onCheckedChange={(v) => setEditing({ ...editing, ativo: v })} />
                  <Label>Ativa</Label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Salvando..." : "Salvar"}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Slug</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {praias.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.nome}</td>
                <td className="p-3 text-muted-foreground">{p.slug}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {p.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {praias.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhuma praia cadastrada.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
