import { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaBroom,
  FaWrench,
  FaBolt,
  FaSnowflake,
} from "react-icons/fa";
import { useActiveStep } from "../../hooks/useScrollReveal";

const FEATURES = [
  "Find the right service",
  "Compare providers",
  "Choose your schedule",
  "Manage your booking",
  "Reschedule when plans change",
  "Cancel when necessary",
  "Share your experience",
];

const CATEGORIES = [
  { label: "Cleaning", icon: <FaBroom /> },
  { label: "Plumbing", icon: <FaWrench /> },
  { label: "Electrical", icon: <FaBolt /> },
  { label: "AC Repair", icon: <FaSnowflake /> },
];

const SCREENS = [
  { key: "search", label: "Search" },
  { key: "results", label: "Results" },
  { key: "booking", label: "Booking" },
  { key: "review", label: "Review" },
];

const CustomerExperience = () => {
  const { activeStep, setStepRef } = useActiveStep(SCREENS.length);
  const [tapStep, setTapStep] = useState(null);
  const screen = SCREENS[tapStep ?? activeStep].key;

  return (
    <section className="fa-section fa-section-light">
      <div className="fa-container fa-two-col">
        <div>
          <span className="fa-eyebrow">For Customers</span>
          <h2 className="fa-heading">Your home. Your schedule. Your choice.</h2>
          <ul className="fa-feature-list">
            {FEATURES.map((f) => (
              <li key={f}>
                <FaCheckCircle aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          {/* Scroll-linked (desktop) / tap-linked (all) screen triggers */}
          <div
            className="fa-mock-steps"
            role="tablist"
            aria-label="Customer app screens">
            {SCREENS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                ref={setStepRef(i)}
                data-step-index={i}
                role="tab"
                aria-selected={screen === s.key}
                className={`fa-mock-step-btn ${screen === s.key ? "fa-mock-step-active" : ""}`}
                onClick={() => setTapStep(i)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============ PHONE MOCKUP ============ */}
        <div className="fa-phone-mockup" aria-hidden="true">
          <div className="fa-phone-notch" />
          <div className="fa-phone-screen">
            {screen === "search" && (
              <>
                <div className="fa-phone-header">Find a service</div>
                <div className="fa-phone-search">
                  <FaSearch />
                  <span>Search for a service...</span>
                </div>
                <div className="fa-phone-location">
                  <FaMapMarkerAlt />
                  New Delhi
                </div>
                <div className="fa-phone-cat-grid">
                  {CATEGORIES.map((c) => (
                    <div className="fa-phone-cat" key={c.label}>
                      <span>{c.icon}</span>
                      {c.label}
                    </div>
                  ))}
                </div>
              </>
            )}

            {screen === "results" && (
              <>
                <div className="fa-phone-header">AC Repair</div>
                <div className="fa-provider-mini-card">
                  <div className="fa-provider-mini-top">
                    <span className="fa-verified-badge">
                      <FaCheckCircle /> Verified
                    </span>
                    <span className="fa-mini-rating">
                      <FaStar /> 4.8
                    </span>
                  </div>
                  <p className="fa-provider-mini-name">
                    Sunrise Cooling Services
                  </p>
                  <p className="fa-provider-mini-meta">
                    ₹499 onwards · Available Today
                  </p>
                </div>
                <div className="fa-provider-mini-card fa-provider-mini-card-muted">
                  <div className="fa-provider-mini-top">
                    <span className="fa-verified-badge">
                      <FaCheckCircle /> Verified
                    </span>
                    <span className="fa-mini-rating">
                      <FaStar /> 4.6
                    </span>
                  </div>
                  <p className="fa-provider-mini-name">CoolFix Technicians</p>
                  <p className="fa-provider-mini-meta">
                    ₹549 onwards · Tomorrow
                  </p>
                </div>
              </>
            )}

            {screen === "booking" && (
              <>
                <div className="fa-phone-header">Booking Confirmed</div>
                <div className="fa-booking-confirm-card">
                  <span className="fa-verified-badge fa-verified-badge-lg">
                    <FaCheckCircle /> Confirmed
                  </span>
                  <p className="fa-booking-confirm-service">AC Repair</p>
                  <p className="fa-booking-confirm-meta">Today · 4:30 PM</p>
                  <p className="fa-booking-confirm-meta">
                    Sunrise Cooling Services
                  </p>
                  <p className="fa-booking-confirm-price">₹499</p>
                </div>
              </>
            )}

            {screen === "review" && (
              <>
                <div className="fa-phone-header">Rate your service</div>
                <div className="fa-review-card">
                  <p className="fa-provider-mini-name">
                    Sunrise Cooling Services
                  </p>
                  <div className="fa-review-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <p className="fa-review-comment">
                    "Quick and professional service."
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerExperience;
