import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const RefundCTA = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();
  return (
    <section className="frefund-cta" ref={ref}>
      <div
        className={`frefund-container frefund-cta-inner ${visible ? "frefund-visible" : ""}`}>
        <h2 className="frefund-cta-heading">
          Simple bookings. Clear policies.
        </h2>
        <p className="frefund-cta-sub">
          Fixly is designed to make service experiences more transparent for
          customers and professionals.
        </p>
        <div className="frefund-cta-row">
          <button
            type="button"
            className="frefund-btn frefund-btn-primary"
            onClick={() => navigate("/search")}>
            Find a Service
          </button>
          <button
            type="button"
            className="frefund-btn frefund-btn-secondary"
            onClick={() => navigate("/become-provider")}>
            Become a Provider
          </button>
        </div>
      </div>
    </section>
  );
};

export default RefundCTA;
