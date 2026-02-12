import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import LiveSection from "@/components/LiveSection";
import Footer from "@/components/Footer";
import { useWaveData } from "@/hooks/useWaveData";

const Index = () => {
  const { data } = useWaveData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar weather={data ? { temperature: data.temperature, waveHeight: data.waveHeight } : undefined} />
      <main>
        <HeroSection />
        <BentoGrid />
        <LiveSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
