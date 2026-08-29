import { useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaTools,
  FaCalendarCheck,
  FaWallet,
  FaStar,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";
import { useScrollProgress } from "../../hooks/useScrollReveal";

const NODES = [
  {
    key: "customers",
    label: "Customers",
    desc: "Discover and book trusted services.",
    icon: <FaUsers />,
    angle: 0,
  },
  {
    key: "providers",
    label: "Providers",
    desc: "Manage bookings and grow reputation.",
    icon: <FaUserTie />,
    angle: 45,
  },
  {
    key: "services",
    label: "Services",
    desc: "Categories spanning everyday home needs.",
    icon: <FaTools />,
    angle: 90,
  },
  {
    key: "bookings",
    label: "Bookings",
    desc: "Requests, scheduling and status tracking.",
    icon: <FaCalendarCheck />,
    angle: 135,
  },
  {
    key: "payments",
    label: "Payments",
    desc: "Priced clearly per completed service.",
    icon: <FaWallet />,
    angle: 180,
  },
  {
    key: "ratings",
    label: "Ratings",
    desc: "Feedback that builds provider trust.",
    icon: <FaStar />,
    angle: 225,
  },
  {
    key: "support",
    label: "Support",
    desc: "Help when a booking needs attention.",
    icon: <FaHeadset />,
    angle: 270,
  },
  {
    key: "verification",
    label: "Verification",
    desc: "OTP-based confirmation of completed work.",
    icon: <FaShieldAlt />,
    angle: 315,
  },
];

const RADIUS = 210;
const CENTER = 260;

function nodePosition(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

const EcosystemSection = () => {
  const [ref, progress] = useScrollProgress();
  const [activeNode, setActiveNode] = useState(null);

  return (
    <section className="fa-section fa-section-dark" ref={ref}>
      <div className="fa-container">
        <h2 className="fa-heading fa-heading-inverse fa-heading-center">
          More than a booking page — an ecosystem.
        </h2>
        <p className="fa-section-sub fa-sub-inverse">
          Every part of Fixly is connected: a booking touches providers,
          payments, ratings and support all at once.
        </p>

        {/* ============ DESKTOP: SVG radial diagram ============ */}
        <div className="fa-ecosystem-desktop" aria-hidden="true">
          <svg
            viewBox="0 0 520 520"
            className="fa-ecosystem-svg"
            style={{ "--fa-line-progress": progress }}>
            {NODES.map((node) => {
              const pos = nodePosition(node.angle);
              const isActive = activeNode === node.key;
              return (
                <line
                  key={node.key}
                  x1={CENTER}
                  y1={CENTER}
                  x2={pos.x}
                  y2={pos.y}
                  className={`fa-ecosystem-line ${isActive ? "fa-ecosystem-line-active" : ""}`}
                />
              );
            })}
            <circle
              cx={CENTER}
              cy={CENTER}
              r="54"
              className="fa-ecosystem-center-circle"
            />
          </svg>

          <div
            className="fa-ecosystem-center-label"
            style={{ left: CENTER, top: CENTER }}>
            Fixly
          </div>

          {NODES.map((node) => {
            const pos = nodePosition(node.angle);
            return (
              <button
                key={node.key}
                type="button"
                className={`fa-ecosystem-node-btn ${activeNode === node.key ? "fa-ecosystem-node-active" : ""}`}
                style={{ left: pos.x, top: pos.y }}
                onMouseEnter={() => setActiveNode(node.key)}
                onMouseLeave={() => setActiveNode(null)}
                onFocus={() => setActiveNode(node.key)}
                onBlur={() => setActiveNode(null)}
                aria-label={`${node.label}: ${node.desc}`}>
                <span className="fa-ecosystem-node-icon">{node.icon}</span>
                <span className="fa-ecosystem-node-text">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============ MOBILE: vertical connected list ============ */}
        <div className="fa-ecosystem-mobile">
          <div className="fa-ecosystem-mobile-root">
            <span className="fa-ecosystem-mobile-root-icon" aria-hidden="true">
              Fixly
            </span>
          </div>
          <ul className="fa-ecosystem-mobile-list">
            {NODES.map((node, i) => (
              <li
                key={node.key}
                className="fa-ecosystem-mobile-item"
                style={{ "--fa-delay": `${i * 70}ms` }}>
                <span
                  className="fa-ecosystem-mobile-connector"
                  aria-hidden="true"
                />
                <span className="fa-ecosystem-mobile-icon" aria-hidden="true">
                  {node.icon}
                </span>
                <div>
                  <h4 className="fa-ecosystem-mobile-title">{node.label}</h4>
                  <p className="fa-ecosystem-mobile-desc">{node.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
