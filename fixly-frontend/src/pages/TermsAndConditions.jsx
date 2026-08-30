import { useMemo } from "react";
import ReadingProgress from "../components/legal/ReadingProgress";
import TermsHero from "../components/legal/TermsHero";
import TermsSummary from "../components/legal/TermsSummary";
import TermsSidebar from "../components/legal/TermsSidebar";
import TermsSection from "../components/legal/TermsSection";
import TermsContact from "../components/legal/TermsContact";
import HomeFooter from "../components/footer/HomeFooter";
import { TERMS_SECTIONS, TERMS_METADATA } from "../data/legalContent";
import { useScrollSpy } from "../hooks/useScrollSpy";
import "../styles/fixly-terms.css";

const TermsAndConditions = () => {
  const sectionIds = useMemo(
    () => TERMS_SECTIONS.map((section) => section.id),
    [],
  );

  const { activeId, progress } = useScrollSpy(sectionIds);

  return (
    <main className="fixly-terms">
      <ReadingProgress progress={progress} />

      <TermsHero
        effectiveDate={TERMS_METADATA.effectiveDate}
        lastUpdated={TERMS_METADATA.lastUpdated}
      />

      <TermsSummary />

      <div className="fterms-container fterms-layout">
        <TermsSidebar activeId={activeId} />

        <div className="fterms-content">
          {TERMS_SECTIONS.map((section) => (
            <TermsSection section={section} key={section.id} />
          ))}
        </div>
      </div>

      <TermsContact />

      <HomeFooter />
    </main>
  );
};

export default TermsAndConditions;
