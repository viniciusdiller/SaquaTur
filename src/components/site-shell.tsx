"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { useWaveData } from "@/hooks/useWaveData";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { data } = useWaveData();

  return (
    <>
      <Navbar weather={{ temperature: data.temperature, waveHeight: data.waveHeight }} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
