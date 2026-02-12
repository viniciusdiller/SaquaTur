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

type Evento = Tables<"eventos">;

const empty: Partial<Evento> = {
  titulo: "", descricao: "", data_inicio: "", local: "", tipo: "geral", ativo: true, destaque: false,
};

export default function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [editing, setEditing] = useState<Partial<Evento> | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("eventos").select("*").order("data_inicio", { ascending: false });
    if (data) setEventos(data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.titulo || !editing?.data_inicio) {
      toast.error("Título e data são obrigatórios.");
      return;
    }
    setSaving(true);
    const payload = {
      titulo: editing.titulo,
      descricao: editing.descricao ?? "",
      data_inicio: editing.data_inicio,
      data_fim: editing.data_fim || null,
      local: editing.local || null,
      tipo: editing.tipo || "geral",
      ativo: editing.ativo ?? true,
      destaque: editing.destaque ?? false,
    };
    if (editing.id) {
      const { error } = await supabase.from("eventos").update(payload).eq("id", editing.id);
      if (error) toast.error("Erro ao salvar."); else toast.success("Evento atualizado!");
    } else {
      const { error } = await supabase.from("eventos").insert(payload);
      if (error) toast.error("Erro ao criar."); else toast.success("Evento criado!");
    }
    setSaving(false);
    setOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    await supabase.from("eventos").delete().eq("id", id);
    toast.success("Evento removido.");
    load();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Eventos</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" />Novo Evento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Editar" : "Novo"} Evento</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div><Label>Título</Label><Input value={editing.titulo ?? ""} onChange={(e) => setEditing({ ...editing, titulo: e.target.value })} /></div>
                <div><Label>Descrição</Label><Textarea rows={3} value={editing.descricao ?? ""} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Data Início</Label><Input type="datetime-local" value={editing.data_inicio ?? ""} onChange={(e) => setEditing({ ...editing, data_inicio: e.target.value })} /></div>
                  <div><Label>Data Fim</Label><Input type="datetime-local" value={editing.data_fim ?? ""} onChange={(e) => setEditing({ ...editing, data_fim: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Local</Label><Input value={editing.local ?? ""} onChange={(e) => setEditing({ ...editing, local: e.target.value })} /></div>
                  <div><Label>Tipo</Label><Input value={editing.tipo ?? ""} onChange={(e) => setEditing({ ...editing, tipo: e.target.value })} /></div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={editing.ativo ?? true} onCheckedChange={(v) => setEditing({ ...editing, ativo: v })} /><Label>Ativo</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editing.destaque ?? false} onCheckedChange={(v) => setEditing({ ...editing, destaque: v })} /><Label>Destaque</Label></div>
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
              <th className="text-left p-3 font-medium text-muted-foreground">Título</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Local</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-3 font-medium">{e.titulo}</td>
                <td className="p-3 text-muted-foreground">{formatDate(e.data_inicio)}</td>
                <td className="p-3 text-muted-foreground">{e.local ?? "—"}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${e.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {e.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(e); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {eventos.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum evento cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
