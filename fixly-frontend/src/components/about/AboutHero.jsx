import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaLock, FaTags } from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const FLOW_NODES = [
  "Customer",
  "Service Discovery",
  "Verified Provider",
  "Booking",
  "Service",
  "Review",
];

const TRUST_POINTS = [
  { key: "verified", label: "Verified Professionals", icon: <FaShieldAlt /> },
  { key: "secure", label: "Secure Booking", icon: <FaLock /> },
  { key: "pricing", label: "Transparent Pricing", icon: <FaTags /> },
];

const AboutHero = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  return (
    <section className="fa-hero" ref={ref}>
      <div className="fa-hero-glow" aria-hidden="true" />
      <div className={`fa-hero-inner ${visible ? "fa-visible" : ""}`}>
        <div className="fa-hero-copy">
          <h1 className="fa-hero-title">
            Making Home Services
            <br />
            <span className="fa-accent">Simple, Reliable &amp;</span>
            <br />
            <span className="fa-accent">Human.</span>
          </h1>
          <p className="fa-hero-sub">
            Fixly connects customers with trusted service professionals, making
            it easier to discover, book, manage and complete everyday services.
          </p>
          <div className="fa-hero-cta-row">
            <button
              type="button"
              className="fa-btn fa-btn-primary"
              onClick={() => navigate("/search")}>
              Find a Service
            </button>
            <button
              type="button"
              className="fa-btn fa-btn-secondary"
              onClick={() => navigate("/become-provider")}>
              Become a Provider
            </button>
          </div>
          <ul className="fa-hero-trust">
            {TRUST_POINTS.map((t) => (
              <li key={t.key} className="fa-hero-trust-item">
                <span aria-hidden="true">{t.icon}</span>
                {t.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="fa-hero-visual" aria-hidden="true">
          <div className="fa-flow-chain">
            {FLOW_NODES.map((node, i) => (
              <div
                key={node}
                className="fa-flow-node"
                style={{ "--fa-delay": `${i * 90}ms` }}>
                {node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
