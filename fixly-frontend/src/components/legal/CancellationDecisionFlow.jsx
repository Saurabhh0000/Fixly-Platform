import { FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const CancellationDecisionFlow = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} className={`fcxl-decision ${visible ? "fcxl-visible" : ""}`}>
      <div className="fcxl-decision-start">Customer wants to cancel</div>
      <FaArrowRight className="fcxl-decision-arrow" aria-hidden="true" />
      <div className="fcxl-decision-question">Is the service completed?</div>
      <div className="fcxl-decision-branches">
        <div className="fcxl-decision-branch fcxl-decision-branch-no">
          <span className="fcxl-decision-branch-label">Yes</span>
          <span className="fcxl-decision-branch-icon" aria-hidden="true">
            <FaTimesCircle />
          </span>
          <p>Cannot be cancelled</p>
        </div>
        <div className="fcxl-decision-branch fcxl-decision-branch-yes">
          <span className="fcxl-decision-branch-label">No</span>
          <p>Continue to booking status evaluation</p>
          <p className="fcxl-decision-sub">
            → Cancellation rules applied based on current status
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationDecisionFlow;
