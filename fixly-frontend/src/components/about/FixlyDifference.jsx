import {
  FaSearch,
  FaTags,
  FaCalendarCheck,
  FaExchangeAlt,
  FaTasks,
  FaStar,
  FaInbox,
  FaToggleOn,
  FaCheckDouble,
  FaKey,
  FaMedal,
  FaChartBar,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const CUSTOMER_FEATURES = [
  { label: "Search services", icon: <FaSearch /> },
  { label: "View pricing", icon: <FaTags /> },
  { label: "Book appointments", icon: <FaCalendarCheck /> },
  { label: "Cancel or reschedule", icon: <FaExchangeAlt /> },
  { label: "Manage bookings", icon: <FaTasks /> },
  { label: "Leave ratings & reviews", icon: <FaStar /> },
];

const PROVIDER_FEATURES = [
  { label: "Receive customer requests", icon: <FaInbox /> },
  { label: "Manage availability", icon: <FaToggleOn /> },
  { label: "Accept bookings", icon: <FaCheckDouble /> },
  { label: "Verify service with OTP", icon: <FaKey /> },
  { label: "Build ratings", icon: <FaMedal /> },
  { label: "Grow reputation", icon: <FaChartBar /> },
];

const DifferenceCard = ({ eyebrow, title, tagline, features, tone }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`fa-diff-card fa-diff-${tone} ${visible ? "fa-visible" : ""}`}>
      <span className="fa-diff-eyebrow">{eyebrow}</span>
      <h3 className="fa-diff-title">{title}</h3>
      <p className="fa-diff-tagline">{tagline}</p>
      <ul className="fa-diff-list">
        {features.map((f) => (
          <li key={f.label}>
            <span aria-hidden="true">{f.icon}</span>
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FixlyDifference = () => {
  const [headRef, headVisible] = useScrollReveal();
  return (
    <section className="fa-section fa-section-soft-green">
      <div className="fa-container">
        <h2
          ref={headRef}
          className={`fa-heading fa-heading-center ${headVisible ? "fa-visible" : ""}`}>
          One platform. Two sides. One better experience.
        </h2>
        <div className="fa-diff-grid">
          <DifferenceCard
            eyebrow="Customers"
            title="Discover services without the uncertainty."
            tagline="Everything you need to find and book the right professional."
            features={CUSTOMER_FEATURES}
            tone="customer"
          />
          <DifferenceCard
            eyebrow="Providers"
            title="Turn your skills into a growing service business."
            tagline="Tools to manage requests, availability, and reputation."
            features={PROVIDER_FEATURES}
            tone="provider"
          />
        </div>
      </div>
    </section>
  );
};

export default FixlyDifference;
