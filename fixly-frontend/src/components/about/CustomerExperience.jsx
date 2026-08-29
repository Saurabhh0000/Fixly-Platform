import {
  FaSearch,
  FaBalanceScale,
  FaCalendarCheck,
  FaTasks,
  FaExchangeAlt,
  FaBan,
  FaStar,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ITEMS = [
  { label: "Find the right service", icon: <FaSearch /> },
  { label: "Compare providers", icon: <FaBalanceScale /> },
  { label: "Choose your schedule", icon: <FaCalendarCheck /> },
  { label: "Manage your booking", icon: <FaTasks /> },
  { label: "Reschedule when plans change", icon: <FaExchangeAlt /> },
  { label: "Cancel when necessary", icon: <FaBan /> },
  { label: "Share your experience", icon: <FaStar /> },
];

const CustomerExperience = () => {
  const [headRef, headVisible] = useScrollReveal();
  const [mockRef, mockVisible] = useScrollReveal();

  return (
    <section className="fa-section fa-section-light">
      <div className="fa-container fa-two-col">
        <div>
          <h2
            ref={headRef}
            className={`fa-heading ${headVisible ? "fa-visible" : ""}`}>
            Your home. Your schedule. Your choice.
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
        <div
          ref={mockRef}
          className={`fa-phone-mockup ${mockVisible ? "fa-visible" : ""}`}
          aria-hidden="true">
          <div className="fa-phone-notch" />
          <div className="fa-phone-screen">
            <div className="fa-phone-card" />
            <div className="fa-phone-card fa-phone-card-short" />
            <div className="fa-phone-card" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerExperience;
