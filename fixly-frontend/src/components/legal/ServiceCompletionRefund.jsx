import { useScrollReveal } from "../../hooks/useScrollReveal";

const SCENARIOS = [
  { title: "Provider Unable to Complete" },
  { title: "Customer Unable to Proceed" },
  { title: "Service Interrupted" },
];

const STEPS = ["Situation", "Booking status", "Review", "Applicable outcome"];

const ScenarioFlow = ({ title, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`frefund-completion-card ${visible ? "frefund-visible" : ""}`}
      style={{ "--frefund-delay": `${index * 80}ms` }}>
      <h4>{title}</h4>
      <ol className="frefund-completion-steps">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="frefund-completion-note">[Applicable Refund Rule]</p>
    </div>
  );
};

const ServiceCompletionRefund = () => (
  <div className="frefund-completion-grid">
    {SCENARIOS.map((s, i) => (
      <ScenarioFlow title={s.title} index={i} key={s.title} />
    ))}
  </div>
);

export default ServiceCompletionRefund;
