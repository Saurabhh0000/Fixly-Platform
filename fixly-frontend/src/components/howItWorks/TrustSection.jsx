import {
  FaShieldAlt,
  FaLock,
  FaTags,
  FaKey,
  FaStar,
  FaHeadset,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const TRUST_ITEMS = [
  { label: "Verified Professionals", icon: <FaShieldAlt /> },
  { label: "Secure Booking", icon: <FaLock /> },
  { label: "Transparent Pricing", icon: <FaTags /> },
  { label: "OTP Verification", icon: <FaKey /> },
  { label: "Ratings & Reviews", icon: <FaStar /> },
  { label: "Customer Support", icon: <FaHeadset /> },
];

const TrustCard = ({ item, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`fhiw-trust-card ${visible ? "fhiw-visible" : ""}`}
      style={{ "--fhiw-delay": `${index * 70}ms` }}
      tabIndex={0}>
      <span className="fhiw-trust-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="fhiw-trust-label">{item.label}</span>
    </div>
  );
};

const TrustSection = () => (
  <section className="fhiw-section fhiw-section-dark">
    <div className="fhiw-container">
      <h2 className="fhiw-heading fhiw-heading-inverse fhiw-heading-center">
        Built around trust at every step.
      </h2>
      <div className="fhiw-trust-grid">
        {TRUST_ITEMS.map((item, i) => (
          <TrustCard key={item.label} item={item} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
