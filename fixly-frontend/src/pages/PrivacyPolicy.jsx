import { useMemo } from "react";
import ReadingProgress from "../components/legal/ReadingProgress";
import PrivacyHero from "../components/legal/PrivacyHero";
import PrivacySummary from "../components/legal/PrivacySummary";
import PrivacySidebar from "../components/legal/PrivacySidebar";
import TermsSection from "../components/legal/TermsSection";
import PrivacyContact from "../components/legal/PrivacyContact";
import HomeFooter from "../components/footer/HomeFooter";
import { PRIVACY_SECTIONS, PRIVACY_METADATA } from "../data/legalContent";
import { useScrollSpy } from "../hooks/useScrollSpy";
import "../styles/fixly-privacy.css";

const PrivacyPolicy = () => {
  const sectionIds = useMemo(() => PRIVACY_SECTIONS.map((s) => s.id), []);
  const { activeId, progress } = useScrollSpy(sectionIds);

  return (
    <main className="fixly-privacy">
      <ReadingProgress progress={progress} />
      <PrivacyHero
        effectiveDate={PRIVACY_METADATA.effectiveDate}
        lastUpdated={PRIVACY_METADATA.lastUpdated}
      />
      <PrivacySummary />

      <div className="fprivacy-container fprivacy-layout">
        <PrivacySidebar activeId={activeId} />
        <div className="fprivacy-content">
          {PRIVACY_SECTIONS.map((section) => (
            <TermsSection section={section} key={section.id} />
          ))}
        </div>
      </div>

      <PrivacyContact />
      <HomeFooter />
    </main>
  );
};

export default PrivacyPolicy;
