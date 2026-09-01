import {
  FaCheckCircle,
  FaPaperPlane,
  FaCreditCard,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  { label: "Refund Approved", icon: <FaCheckCircle /> },
  { label: "Refund Initiated", icon: <FaPaperPlane /> },
  { label: "Payment Processor", icon: <FaCreditCard /> },
  { label: "Bank / Payment Network", icon: <FaUniversity /> },
  { label: "Customer Account", icon: <FaUser /> },
];

const RefundProcessingTimeline = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <ol
      ref={ref}
      className={`frefund-processing ${visible ? "frefund-visible" : ""}`}>
      {STEPS.map((step, i) => (
        <li
          key={step.label}
          className="frefund-processing-step"
          style={{ "--frefund-delay": `${i * 90}ms` }}>
          <span className="frefund-processing-icon" aria-hidden="true">
            {step.icon}
          </span>
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
  );
};

export default RefundProcessingTimeline;
