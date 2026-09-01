import {
  FaBan,
  FaUserTie,
  FaExclamationCircle,
  FaTools,
  FaCopy,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const SCENARIOS = [
  {
    title: "Booking Cancelled",
    icon: <FaBan />,
    text: "A cancelled booking may be eligible for a refund depending on the applicable cancellation and refund rules.",
  },
  {
    title: "Provider Unable to Complete Service",
    icon: <FaUserTie />,
    text: "A provider-side inability to complete the service may be reviewed for refund eligibility.",
  },
  {
    title: "Service Not Delivered",
    icon: <FaExclamationCircle />,
    text: "If a paid service was not delivered, contact support so the booking can be reviewed.",
  },
  {
    title: "Service Partially Completed",
    icon: <FaTools />,
    text: "Partial completion of a service may require individual review before a decision is reached.",
  },
  {
    title: "Duplicate or Incorrect Payment",
    icon: <FaCopy />,
    text: "Payment-related issues, such as duplicate charges, may be reviewed through the appropriate support process.",
  },
];

const ScenarioCard = ({ item, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`frefund-scenario-card ${visible ? "frefund-visible" : ""}`}
      style={{ "--frefund-delay": `${index * 70}ms` }}>
      <span className="frefund-scenario-icon" aria-hidden="true">
        {item.icon}
      </span>
      <h4>{item.title}</h4>
      <p>{item.text}</p>
    </div>
  );
};

const RefundScenarioCards = () => (
  <div className="frefund-scenario-grid">
    {SCENARIOS.map((item, i) => (
      <ScenarioCard item={item} index={i} key={item.title} />
    ))}
  </div>
);

export default RefundScenarioCards;
