import {
  FaSearch,
  FaHandPointer,
  FaCalendarCheck,
  FaTools,
  FaStar,
  FaUserPlus,
  FaIdCard,
  FaInbox,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const CUSTOMER_STEPS = [
  { n: "01", label: "Discover", icon: <FaSearch /> },
  { n: "02", label: "Choose", icon: <FaHandPointer /> },
  { n: "03", label: "Book", icon: <FaCalendarCheck /> },
  { n: "04", label: "Get Service", icon: <FaTools /> },
  { n: "05", label: "Review", icon: <FaStar /> },
];

const PROVIDER_STEPS = [
  { n: "01", label: "Register", icon: <FaUserPlus /> },
  { n: "02", label: "Get Verified", icon: <FaIdCard /> },
  { n: "03", label: "Receive Booking", icon: <FaInbox /> },
  { n: "04", label: "Complete Service", icon: <FaCheckCircle /> },
  { n: "05", label: "Grow Reputation", icon: <FaChartLine /> },
];

const TimelineStep = ({ step, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <li
      ref={ref}
      className={`fa-timeline-step ${visible ? "fa-visible" : ""}`}
      style={{ "--fa-delay": `${index * 90}ms` }}>
      <span className="fa-timeline-num">{step.n}</span>
      <span className="fa-timeline-icon" aria-hidden="true">
        {step.icon}
      </span>
      <span className="fa-timeline-label">{step.label}</span>
    </li>
  );
};

const HowFixlyWorks = () => (
  <section className="fa-section fa-section-light">
    <div className="fa-container">
      <h2 className="fa-heading fa-heading-center">How Fixly Works</h2>

      <div className="fa-timeline-block">
        <h3 className="fa-timeline-title">For Customers</h3>
        <ol className="fa-timeline">
          {CUSTOMER_STEPS.map((s, i) => (
            <TimelineStep key={s.label} step={s} index={i} />
          ))}
        </ol>
      </div>

      <div className="fa-timeline-block">
        <h3 className="fa-timeline-title">For Providers</h3>
        <ol className="fa-timeline">
          {PROVIDER_STEPS.map((s, i) => (
            <TimelineStep key={s.label} step={s} index={i} />
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default HowFixlyWorks;
