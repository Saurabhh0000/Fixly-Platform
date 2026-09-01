import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const CancellationCTA = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  return (
    <section className="fcxl-cta" ref={ref}>
      <div
        className={`fcxl-container fcxl-cta-inner ${visible ? "fcxl-visible" : ""}`}>
        <h2 className="fcxl-cta-heading">
          Clear policies create better experiences.
        </h2>
        <p className="fcxl-cta-sub">
          Fixly is designed to make service bookings simple, transparent, and
          predictable for both customers and professionals.
        </p>
        <div className="fcxl-cta-row">
          <button
            type="button"
            className="fcxl-btn fcxl-btn-primary"
            onClick={() => navigate("/search")}>
            Find a Service
          </button>
          <button
            type="button"
            className="fcxl-btn fcxl-btn-secondary"
            onClick={() => navigate("/become-provider")}>
            Become a Provider
          </button>
        </div>
      </div>
    </section>
  );
};

export default CancellationCTA;
