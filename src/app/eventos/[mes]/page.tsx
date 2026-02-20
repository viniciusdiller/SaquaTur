import { dadosDosMeses } from "@/lib/eventos";
import { notFound } from "next/navigation";
import MesClient from "./MesClient";

export async function generateStaticParams() {
  const meses = Object.keys(dadosDosMeses);
  return meses.map((mes) => ({
    mes: mes,
  }));
}

interface MesPageProps {
  params: {
    mes: string;
  };
}

export default function MesPage({ params }: MesPageProps) {
  const mesAtual = dadosDosMeses[params.mes];

  if (!mesAtual) {
    notFound();
  }

  return <MesClient mesAtual={mesAtual} />;
}
