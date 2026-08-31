import {
  FaCalendarCheck,
  FaUserTie,
  FaUserCog,
  FaQuestionCircle,
  FaShieldAlt,
  FaEye,
  FaLock,
  FaHeadset,
} from "react-icons/fa";

const CONTACT_REASON_CARDS = [
  {
    key: "booking",
    title: "Booking Support",
    desc: "Help with finding, booking, rescheduling or cancelling services.",
    icon: <FaCalendarCheck />,
  },
  {
    key: "provider",
    title: "Provider Support",
    desc: "Help providers manage bookings, availability and their Fixly experience.",
    icon: <FaUserTie />,
  },
  {
    key: "account",
    title: "Account Support",
    desc: "Help with account, profile and platform-related questions.",
    icon: <FaUserCog />,
  },
  {
    key: "general",
    title: "General Questions",
    desc: "Questions about Fixly, services and how the platform works.",
    icon: <FaQuestionCircle />,
  },
];

const TRUST_INDICATORS = [
  { key: "verified", label: "Verified Professionals", icon: <FaShieldAlt /> },
  {
    key: "transparent",
    label: "Transparent Service Experience",
    icon: <FaEye />,
  },
  { key: "secure", label: "Secure Booking", icon: <FaLock /> },
  { key: "support", label: "Customer Support", icon: <FaHeadset /> },
];

const ContactInfo = () => (
  <div className="fixly-contact-info">
    <h2 className="fixly-contact-info-title">
      Let's talk about what you need.
    </h2>
    <p className="fixly-contact-info-desc">
      Fixly connects customers with trusted service professionals for everyday
      home services — making discovery, booking, and service management simpler.
    </p>

    <div className="fixly-contact-reason-grid">
      {CONTACT_REASON_CARDS.map((card) => (
        <div className="fixly-contact-reason-card" key={card.key}>
          <span className="fixly-contact-reason-icon" aria-hidden="true">
            {card.icon}
          </span>
          <h3 className="fixly-contact-reason-title">{card.title}</h3>
          <p className="fixly-contact-reason-desc">{card.desc}</p>
        </div>
      ))}
    </div>

    <div className="fixly-contact-trust">
      <h3 className="fixly-contact-trust-title">
        Built around better service.
      </h3>
      <ul className="fixly-contact-trust-list">
        {TRUST_INDICATORS.map((item) => (
          <li key={item.key} className="fixly-contact-trust-item">
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ContactInfo;
