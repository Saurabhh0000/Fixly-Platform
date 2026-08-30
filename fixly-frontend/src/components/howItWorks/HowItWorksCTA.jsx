import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const HowItWorksCTA = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  return (
    <section className="fhiw-section fhiw-section-cta" ref={ref}>
      <div
        className={`fhiw-container fhiw-cta-inner ${visible ? "fhiw-visible" : ""}`}>
        <h2 className="fhiw-cta-heading">
          Ready to make your next service simpler?
        </h2>
        <p className="fhiw-cta-sub">
          Find the right professional or turn your skills into your next
          opportunity.
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
    </section>
  );
};

export default HowItWorksCTA;
