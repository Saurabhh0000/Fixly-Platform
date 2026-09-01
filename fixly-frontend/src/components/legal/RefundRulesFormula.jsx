import { useScrollReveal } from "../../hooks/useScrollReveal";

const FACTORS = [
  "Booking status",
  "Cancellation timing",
  "Service status",
  "Applicable policy",
  "Payment status",
];

const RefundRulesFormula = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`frefund-formula ${visible ? "frefund-visible" : ""}`}>
      {FACTORS.map((f, i) => (
        <span key={f} className="frefund-formula-item">
          {f}
          {i < FACTORS.length - 1 && (
            <span className="frefund-formula-plus">+</span>
          )}
        </span>
      ))}
      <span className="frefund-formula-equals">=</span>
      <span className="frefund-formula-result">Refund Outcome</span>
      <div className="frefund-formula-placeholders">
        <span>[Refund Percentage]</span>
        <span>[Applicable Deduction]</span>
        <span>[Cancellation Charge]</span>
        <span>[Other Applicable Adjustment]</span>
      </div>
    </div>
  );
};

export default RefundRulesFormula;
