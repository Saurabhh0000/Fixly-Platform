import HowItWorksHero from "../components/howItWorks/HowItWorksHero";
import JourneySwitcher from "../components/howItWorks/JourneySwitcher";
import TrustSection from "../components/howItWorks/TrustSection";
import FAQ from "../components/howItWorks/FAQ";
import HowItWorksCTA from "../components/howItWorks/HowItWorksCTA";
import HomeFooter from "../components/footer/HomeFooter";
import "../styles/fixly-how-it-works.css";

const HowItWorks = () => {
  return (
    <main className="fixly-how-it-works">
      <HowItWorksHero />
      <JourneySwitcher />
      <TrustSection />
      <FAQ />
      <HowItWorksCTA />
      <HomeFooter />
    </main>
  );
};

export default HowItWorks;
