import { useEffect, useMemo } from "react";
import ReadingProgress from "../components/legal/ReadingProgress";
import CancellationHero from "../components/legal/CancellationHero";
import CancellationSummary from "../components/legal/CancellationSummary";
import CancellationTimeline from "../components/legal/CancellationTimeline";
import CancellationSidebar from "../components/legal/CancellationSidebar";
import TermsSection from "../components/legal/TermsSection";
import CancellationContact from "../components/legal/CancellationContact";
import CancellationCTA from "../components/legal/CancellationCTA";
import HomeFooter from "../components/footer/HomeFooter";
import {
  CANCELLATION_SECTIONS,
  CANCELLATION_METADATA,
} from "../data/legalContent";
import { useScrollSpy } from "../hooks/useScrollSpy";
import "../styles/fixly-cancellation.css";

const CancellationPolicy = () => {
  const sectionIds = useMemo(() => CANCELLATION_SECTIONS.map((s) => s.id), []);
  const { activeId, progress } = useScrollSpy(sectionIds);

  useEffect(() => {
    document.title = "Cancellation Policy | Fixly";
    const meta = document.querySelector('meta[name="description"]');
    const prevContent = meta?.getAttribute("content");
    if (meta) {
      meta.setAttribute(
        "content",
        "Learn how Fixly handles booking cancellations, rescheduling, missed appointments, charges, refunds, and support.",
      );
    }
    return () => {
      document.title = "Fixly";
      if (meta && prevContent) meta.setAttribute("content", prevContent);
    };
  }, []);

  return (
    <main className="fixly-cancellation">
      <ReadingProgress progress={progress} />
      <CancellationHero
        effectiveDate={CANCELLATION_METADATA.effectiveDate}
        lastUpdated={CANCELLATION_METADATA.lastUpdated}
      />
      <CancellationSummary />
      <CancellationTimeline />

      <div className="fcxl-container fcxl-layout">
        <CancellationSidebar activeId={activeId} />
        <div className="fcxl-content">
          {CANCELLATION_SECTIONS.map((section) => (
            <TermsSection section={section} key={section.id} />
          ))}
        </div>
      </div>

      <CancellationContact />
      <CancellationCTA />
      <HomeFooter />
    </main>
  );
};

export default CancellationPolicy;
