import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSearch,
  FaTools,
  FaUserTie,
  FaCalendarCheck,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const FLOW = [
  { label: "Customer", icon: <FaUser /> },
  { label: "Search", icon: <FaSearch /> },
  { label: "Service", icon: <FaTools /> },
  { label: "Provider", icon: <FaUserTie /> },
  { label: "Booking", icon: <FaCalendarCheck /> },
  { label: "Completion", icon: <FaCheckCircle /> },
  { label: "Review", icon: <FaStar /> },
];

const HowItWorksHero = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  return (
    <section className="fhiw-hero">
      <div className="fhiw-hero-glow" aria-hidden="true" />
      <div
        ref={ref}
        className={`fhiw-hero-inner ${visible ? "fhiw-visible" : ""}`}>
        <div className="fhiw-hero-copy">
          <h1 className="fhiw-hero-title">How Fixly Works</h1>
          <p className="fhiw-hero-sub">
            From finding the right professional to completing your service,
            Fixly makes every step simple, transparent and reliable.
          </p>
          <div className="fhiw-hero-cta-row">
            <button
              type="button"
              className="fhiw-btn fhiw-btn-primary"
              onClick={() => navigate("/search")}>
              Find a Service
            </button>
            <button
              type="button"
              className="fhiw-btn fhiw-btn-secondary"
              onClick={() => navigate("/become-provider")}>
              Become a Provider
            </button>
          </div>
        </div>

        <div className="fhiw-hero-visual" aria-hidden="true">
          <div className="fhiw-flow-chain">
            {FLOW.map((node, i) => (
              <div
                key={node.label}
                className="fhiw-flow-node"
                style={{ "--fhiw-delay": `${i * 90}ms` }}>
                <span className="fhiw-flow-icon">{node.icon}</span>
                {node.label}
              </div>
            ))}
          </div>
          <div className="fhiw-floating-badge fhiw-floating-badge-1">
            <FaCheckCircle /> Booking Confirmed
          </div>
          <div className="fhiw-floating-badge fhiw-floating-badge-2">
            <FaStar /> 4.9 Rating
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHero;
