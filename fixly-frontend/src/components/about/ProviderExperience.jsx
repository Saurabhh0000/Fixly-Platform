import {
  FaBullhorn,
  FaInbox,
  FaToggleOn,
  FaUsers,
  FaCheckCircle,
  FaMedal,
  FaChartLine,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ITEMS = [
  { label: "Get discovered", icon: <FaBullhorn /> },
  { label: "Receive bookings", icon: <FaInbox /> },
  { label: "Manage availability", icon: <FaToggleOn /> },
  { label: "Manage customers", icon: <FaUsers /> },
  { label: "Complete services", icon: <FaCheckCircle /> },
  { label: "Build ratings", icon: <FaMedal /> },
  { label: "Grow reputation", icon: <FaChartLine /> },
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
          <div className="fa-dash-row">
            <div className="fa-dash-stat" />
            <div className="fa-dash-stat" />
            <div className="fa-dash-stat" />
          </div>
          <div className="fa-dash-panel" />
        </div>
        <div>
          <h2
            ref={headRef}
            className={`fa-heading ${headVisible ? "fa-visible" : ""}`}>
            Your skills deserve better opportunities.
          </h2>
          <ul className="fa-feature-list">
            {ITEMS.map((item) => (
              <li key={item.label}>
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProviderExperience;
