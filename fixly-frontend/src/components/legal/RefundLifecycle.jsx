import {
  FaWallet,
  FaClipboardList,
  FaExclamationTriangle,
  FaSearch,
  FaGavel,
  FaPaperPlane,
  FaCreditCard,
  FaUser,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  { n: "01", label: "Payment Made", icon: <FaWallet /> },
  { n: "02", label: "Booking Created", icon: <FaClipboardList /> },
  {
    n: "03",
    label: "Cancellation / Service Issue",
    icon: <FaExclamationTriangle />,
  },
  { n: "04", label: "Eligibility Review", icon: <FaSearch /> },
  { n: "05", label: "Refund Decision", icon: <FaGavel /> },
  { n: "06", label: "Refund Initiated", icon: <FaPaperPlane /> },
  { n: "07", label: "Payment Processing", icon: <FaCreditCard /> },
  { n: "08", label: "Customer Receives Refund", icon: <FaUser /> },
];

const Node = ({ step, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <li
      ref={ref}
      className={`frefund-lifecycle-node ${visible ? "frefund-visible" : ""}`}
      style={{ "--frefund-delay": `${index * 70}ms` }}>
      <span className="frefund-lifecycle-num">{step.n}</span>
      <span className="frefund-lifecycle-icon" aria-hidden="true">
        {step.icon}
      </span>
      <span className="frefund-lifecycle-label">{step.label}</span>
    </li>
  );
};

const RefundLifecycle = () => (
  <section className="frefund-lifecycle-section">
    <div className="frefund-container">
      <h2 className="frefund-heading frefund-heading-center">
        The refund lifecycle
      </h2>
      <ol className="frefund-lifecycle">
        {STEPS.map((step, i) => (
          <Node step={step} index={i} key={step.label} />
        ))}
      </ol>
    </div>
  </section>
);

export default RefundLifecycle;
