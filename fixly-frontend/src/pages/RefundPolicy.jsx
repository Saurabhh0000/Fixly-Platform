import { useEffect, useMemo } from "react";
import ReadingProgress from "../components/legal/ReadingProgress";
import RefundHero from "../components/legal/RefundHero";
import RefundSummary from "../components/legal/RefundSummary";
import RefundLifecycle from "../components/legal/RefundLifecycle";
import RefundSidebar from "../components/legal/RefundSidebar";
import TermsSection from "../components/legal/TermsSection";
import RefundContact from "../components/legal/RefundContact";
import RefundCTA from "../components/legal/RefundCTA";
import HomeFooter from "../components/footer/HomeFooter";
import { REFUND_SECTIONS, REFUND_POLICY_CONFIG } from "../data/legalContent";
import { useScrollSpy } from "../hooks/useScrollSpy";
import "../styles/fixly-refund.css";

const RefundPolicy = () => {
  const sectionIds = useMemo(() => REFUND_SECTIONS.map((s) => s.id), []);
  const { activeId, progress } = useScrollSpy(sectionIds);

  useEffect(() => {
    document.title = "Refund Policy | Fixly";
    const meta = document.querySelector('meta[name="description"]');
    const prevContent = meta?.getAttribute("content");
    if (meta) {
      meta.setAttribute(
        "content",
        "Learn how Fixly handles refund eligibility, cancellations, service issues, refund processing, and refund-related support.",
      );
    }
    return () => {
      document.title = "Fixly";
      if (meta && prevContent) meta.setAttribute("content", prevContent);
    };
  }, []);

  return (
    <main className="fixly-refund">
      <ReadingProgress progress={progress} />
      <RefundHero
        effectiveDate={REFUND_POLICY_CONFIG.effectiveDate}
        lastUpdated={REFUND_POLICY_CONFIG.lastUpdated}
      />
      <RefundSummary />
      <RefundLifecycle />

      <div className="frefund-container frefund-layout">
        <RefundSidebar activeId={activeId} />
        <div className="frefund-content">
          {REFUND_SECTIONS.map((section) => (
            <TermsSection section={section} key={section.id} />
          ))}
        </div>
      </div>

      <RefundContact />
      <RefundCTA />
      <HomeFooter />
    </main>
  );
};

export default RefundPolicy;
