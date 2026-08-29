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
  { label: "Verified Providers", icon: <FaShieldAlt /> },
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
      className={`fa-trust-card ${visible ? "fa-visible" : ""}`}
      style={{ "--fa-delay": `${index * 70}ms` }}>
      <span className="fa-trust-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="fa-trust-label">{item.label}</span>
    </div>
  );
};

const TrustSafety = () => (
  <section className="fa-section fa-section-dark">
    <div className="fa-container">
      <h2 className="fa-heading fa-heading-inverse fa-heading-center">
        Built around trust.
      </h2>
      <p className="fa-section-sub fa-sub-inverse">
        Fixly's core features are designed to make every booking safer and more
        transparent — for customers and providers alike.
      </p>
      <div className="fa-trust-grid">
        {TRUST_ITEMS.map((item, i) => (
          <TrustCard key={item.label} item={item} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default TrustSafety;
