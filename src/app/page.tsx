import { AuroraBackground } from "@/components/main/hero/AuroraBackground";
import { HeroContent } from "@/components/main/hero/HeroContent";

export default function Home() {
  return (
    <AuroraBackground
      className="flex min-h-screen flex-col"
      variant="custom"
      colors={["hsla(35, 85%, 50%, 0.35)", "hsla(340, 70%, 45%, 0.2)", "transparent"]}
      speed={0.6}
      blobCount={6}
      childrenClassName="flex flex-1 flex-col"
    >
      <HeroContent />
    </AuroraBackground>
  );
}
