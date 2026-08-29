import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const AboutCTA = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  return (
    <section className="fa-section fa-section-cta" ref={ref}>
      <div
        className={`fa-container fa-cta-inner ${visible ? "fa-visible" : ""}`}>
        <h2 className="fa-cta-heading">
          Ready to experience a simpler way to get things done?
        </h2>
        <p className="fa-cta-sub">
          For customers looking for reliable help and professionals ready to
          grow.
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
      </div>
    </section>
  );
};

export default AboutCTA;
