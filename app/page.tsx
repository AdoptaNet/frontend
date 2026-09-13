import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DifferenceSection } from "@/components/landing/difference-section";
import { DualTabsSection } from "@/components/landing/dual-tabs-section";
import { FollowUpSection } from "@/components/landing/follow-up-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <DifferenceSection />
        <DualTabsSection />
        <FollowUpSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
