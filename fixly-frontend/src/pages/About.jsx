import AboutHero from "../components/about/AboutHero";
import WhyFixly from "../components/about/WhyFixly";
import FixlyDifference from "../components/about/FixlyDifference";
import HowFixlyWorks from "../components/about/HowFixlyWorks";
import SearchToService from "../components/about/SearchToService";
import TrustSafety from "../components/about/TrustSafety";
import AboutStats from "../components/about/AboutStats";
import CustomerExperience from "../components/about/CustomerExperience";
import ProviderExperience from "../components/about/ProviderExperience";
import MissionVision from "../components/about/MissionVision";
import ValuesSection from "../components/about/ValuesSection";
import EcosystemSection from "../components/about/EcosystemSection";
import AboutCTA from "../components/about/AboutCTA";
import HomeFooter from "../components/footer/HomeFooter";
import "../styles/fixly-about.css";

const About = () => {
  return (
    <main className="fixly-about">
      <AboutHero />
      <WhyFixly />
      <FixlyDifference />
      <HowFixlyWorks />
      <SearchToService />
      <TrustSafety />
      <AboutStats />
      <CustomerExperience />
      <ProviderExperience />
      <MissionVision />
      <ValuesSection />
      <EcosystemSection />
      <AboutCTA />
      <HomeFooter />
    </main>
  );
};

export default About;
