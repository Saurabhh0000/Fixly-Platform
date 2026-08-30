import { useMemo } from "react";
import ReadingProgress from "../components/legal/ReadingProgress";
import TermsHero from "../components/legal/TermsHero";
import TermsSummary from "../components/legal/TermsSummary";
import TermsSidebar from "../components/legal/TermsSidebar";
import TermsSection from "../components/legal/TermsSection";
import TermsContact from "../components/legal/TermsContact";
import HomeFooter from "../components/footer/HomeFooter";
import { TERMS_SECTIONS } from "../data/legalContent";
import { useScrollSpy } from "../hooks/useScrollSpy";
import "../styles/fixly-terms.css";

// Placeholders — not real dates. Replace when Terms are finalized.
const EFFECTIVE_DATE = "[Effective Date]";
const LAST_UPDATED = "[Last Updated]";

const TermsAndConditions = () => {
  const sectionIds = useMemo(() => TERMS_SECTIONS.map((s) => s.id), []);
  const { activeId, progress } = useScrollSpy(sectionIds);

  return (
    <main className="fixly-terms">
      <ReadingProgress progress={progress} />
      <TermsHero effectiveDate={EFFECTIVE_DATE} lastUpdated={LAST_UPDATED} />
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
