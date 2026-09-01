import {
  FaFileAlt,
  FaSearch,
  FaCheckCircle,
  FaPaperPlane,
  FaCreditCard,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  { label: "Cancellation Requested", icon: <FaFileAlt /> },
  { label: "Eligibility Checked", icon: <FaSearch /> },
  { label: "Refund Determined", icon: <FaCheckCircle /> },
  { label: "Refund Initiated", icon: <FaPaperPlane /> },
  { label: "Payment Provider Processing", icon: <FaCreditCard /> },
];

const RefundTimeline = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <ol
      ref={ref}
      className={`fcxl-refund-timeline ${visible ? "fcxl-visible" : ""}`}>
      {STEPS.map((step, i) => (
        <li
          key={step.label}
          className="fcxl-refund-step"
          style={{ "--fcxl-delay": `${i * 90}ms` }}>
          <span className="fcxl-refund-step-icon" aria-hidden="true">
            {step.icon}
          </span>
          <span className="fcxl-refund-step-label">{step.label}</span>
        </li>
      ))}
    </ol>
  );
};

export default RefundTimeline;
