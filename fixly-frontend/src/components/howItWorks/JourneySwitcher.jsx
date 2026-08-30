import { useState } from "react";
import {
  FaSearch,
  FaBalanceScale,
  FaCalendarCheck,
  FaCalendarDay,
  FaTools,
  FaKey,
  FaStar,
  FaUserPlus,
  FaIdCard,
  FaClock,
  FaInbox,
  FaCheckCircle,
  FaCheckDouble,
  FaChartLine,
} from "react-icons/fa";

const CUSTOMER_STEPS = [
  { n: "01", label: "Discover a Service", icon: <FaSearch /> },
  { n: "02", label: "Compare Professionals", icon: <FaBalanceScale /> },
  { n: "03", label: "Choose a Schedule", icon: <FaCalendarDay /> },
  { n: "04", label: "Book the Service", icon: <FaCalendarCheck /> },
  { n: "05", label: "Get the Work Done", icon: <FaTools /> },
  { n: "06", label: "Verify Completion", icon: <FaKey /> },
  { n: "07", label: "Leave a Review", icon: <FaStar /> },
];

const PROVIDER_STEPS = [
  { n: "01", label: "Create Your Profile", icon: <FaUserPlus /> },
  { n: "02", label: "Get Verified", icon: <FaIdCard /> },
  { n: "03", label: "Set Availability", icon: <FaClock /> },
  { n: "04", label: "Receive Requests", icon: <FaInbox /> },
  { n: "05", label: "Accept Bookings", icon: <FaCheckCircle /> },
  { n: "06", label: "Complete Services", icon: <FaCheckDouble /> },
  { n: "07", label: "Build Your Reputation", icon: <FaChartLine /> },
];

const JourneySwitcher = () => {
  const [tab, setTab] = useState("customer");
  const steps = tab === "customer" ? CUSTOMER_STEPS : PROVIDER_STEPS;

  return (
    <section className="fhiw-section fhiw-section-light">
      <div className="fhiw-container">
        <h2 className="fhiw-heading fhiw-heading-center">
          Choose your journey
        </h2>

        <div
          className="fhiw-tabs"
          role="tablist"
          aria-label="Choose your journey">
          <button
            type="button"
            role="tab"
            id="fhiw-tab-customer"
            aria-selected={tab === "customer"}
            aria-controls="fhiw-tabpanel"
            className={`fhiw-tab-btn ${tab === "customer" ? "fhiw-tab-active" : ""}`}
            onClick={() => setTab("customer")}>
            Customer
          </button>
          <button
            type="button"
            role="tab"
            id="fhiw-tab-provider"
            aria-selected={tab === "provider"}
            aria-controls="fhiw-tabpanel"
            className={`fhiw-tab-btn ${tab === "provider" ? "fhiw-tab-active" : ""}`}
            onClick={() => setTab("provider")}>
            Provider
          </button>
        </div>

        <div
          id="fhiw-tabpanel"
          role="tabpanel"
          aria-labelledby={
            tab === "customer" ? "fhiw-tab-customer" : "fhiw-tab-provider"
          }
          key={tab}
          className="fhiw-journey-grid fhiw-journey-fade">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className="fhiw-journey-card"
              style={{ "--fhiw-delay": `${i * 60}ms` }}>
              <span className="fhiw-journey-num">{step.n}</span>
              <span className="fhiw-journey-icon" aria-hidden="true">
                {step.icon}
              </span>
              <span className="fhiw-journey-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySwitcher;
