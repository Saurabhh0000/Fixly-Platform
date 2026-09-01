import { FaArrowDown } from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const RefundEligibilityTree = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`frefund-tree ${visible ? "frefund-visible" : ""}`}>
      <div className="frefund-tree-node frefund-tree-root">Refund Request</div>
      <FaArrowDown className="frefund-tree-arrow" aria-hidden="true" />
      <div className="frefund-tree-node">Was the booking cancelled?</div>
      <div className="frefund-tree-split">
        <div className="frefund-tree-branch">
          <span className="frefund-tree-branch-tag">Yes</span>
          <p>Continue to service status</p>
        </div>
        <div className="frefund-tree-branch frefund-tree-branch-muted">
          <span className="frefund-tree-branch-tag">No</span>
          <p>Reviewed separately</p>
        </div>
      </div>
      <FaArrowDown className="frefund-tree-arrow" aria-hidden="true" />
      <div className="frefund-tree-node">Was the service completed?</div>
      <div className="frefund-tree-split">
        <div className="frefund-tree-branch frefund-tree-branch-muted">
          <span className="frefund-tree-branch-tag">Yes</span>
          <p>Reviewed for eligibility</p>
        </div>
        <div className="frefund-tree-branch">
          <span className="frefund-tree-branch-tag">No</span>
          <p>Continue to applicable rule</p>
        </div>
      </div>
      <FaArrowDown className="frefund-tree-arrow" aria-hidden="true" />
      <div className="frefund-tree-node frefund-tree-result">
        Applicable Rule → Refund Decision
      </div>
    </div>
  );
};

export default RefundEligibilityTree;
