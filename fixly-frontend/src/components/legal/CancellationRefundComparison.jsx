import { useScrollReveal } from "../../hooks/useScrollReveal";

const CancellationRefundComparison = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`frefund-compare ${visible ? "frefund-visible" : ""}`}>
      <div className="frefund-compare-col">
        <h4 className="frefund-compare-title">Cancellation</h4>
        <ul>
          <li>Stops or changes a booking</li>
          <li>Relates to booking status</li>
          <li>May happen before the service occurs</li>
          <li>Does not automatically determine a refund amount</li>
        </ul>
      </div>
      <div className="frefund-compare-vs" aria-hidden="true">
        VS
      </div>
      <div className="frefund-compare-col frefund-compare-col-accent">
        <h4 className="frefund-compare-title">Refund</h4>
        <ul>
          <li>Relates to returning eligible payment</li>
          <li>Depends on applicable refund rules</li>
          <li>May require an eligibility review</li>
          <li>May be processed separately from cancellation</li>
        </ul>
      </div>
    </div>
  );
};

export default CancellationRefundComparison;
