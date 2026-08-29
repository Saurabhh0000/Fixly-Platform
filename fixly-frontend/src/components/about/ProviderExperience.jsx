import { FaStar, FaCheckCircle, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ITEMS = [
  "Get discovered",
  "Receive bookings",
  "Manage availability",
  "Manage customers",
  "Complete services",
  "Build ratings",
  "Grow reputation",
];

const ProviderExperience = () => {
  const [headRef, headVisible] = useScrollReveal();
  const [dashRef, dashVisible] = useScrollReveal();

  return (
    <section className="fa-section fa-section-soft-green">
      <div className="fa-container fa-two-col fa-two-col-reverse">
        <div
          ref={dashRef}
          className={`fa-dash-mockup ${dashVisible ? "fa-visible" : ""}`}
          aria-hidden="true">
          <div className="fa-dash-header">
            <div>
              <p className="fa-dash-name">Rajesh Kumar</p>
              <span className="fa-verified-badge">
                <FaCheckCircle /> Verified Provider
              </span>
            </div>
          </div>

          <div className="fa-dash-row">
            <div className="fa-dash-stat">
              <span className="fa-dash-stat-value">8</span>
              <span className="fa-dash-stat-label">Today's Bookings</span>
            </div>
            <div className="fa-dash-stat">
              <span className="fa-dash-stat-value">₹42,500</span>
              <span className="fa-dash-stat-label">This Month</span>
            </div>
            <div className="fa-dash-stat">
              <span className="fa-dash-stat-value">
                <FaStar className="fa-dash-star" /> 4.8
              </span>
              <span className="fa-dash-stat-label">Rating</span>
            </div>
          </div>

          <div className="fa-dash-panel">
            <p className="fa-dash-panel-title">Upcoming Booking</p>
            <div className="fa-dash-booking-card">
              <p className="fa-dash-booking-service">AC Repair</p>
              <p className="fa-dash-booking-meta">Customer: Amit</p>
              <p className="fa-dash-booking-meta">
                <FaClock /> Today, 4:30 PM
              </p>
              <p className="fa-dash-booking-meta">
                <FaMapMarkerAlt /> New Delhi
              </p>
              <div className="fa-dash-booking-actions">
                <button type="button" className="fa-dash-btn-accept" disabled>
                  Accept
                </button>
                <button type="button" className="fa-dash-btn-view" disabled>
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="fa-dash-footer-row">
            <span>Completed: 126</span>
            <span>Mon–Sat, 9:00 AM–7:00 PM</span>
          </div>
        </div>

        <div>
          <span className="fa-eyebrow">For Providers</span>
          <h2
            ref={headRef}
            className={`fa-heading ${headVisible ? "fa-visible" : ""}`}>
            Your skills deserve better opportunities.
          </h2>
          <ul className="fa-feature-list">
            {ITEMS.map((item) => (
              <li key={item}>
                <FaCheckCircle aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProviderExperience;
