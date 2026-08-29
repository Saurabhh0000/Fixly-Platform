import {
  FaShieldAlt,
  FaEye,
  FaHandshake,
  FaUserFriends,
  FaChartLine,
  FaSyncAlt,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const VALUES = [
  {
    n: "01",
    title: "Trust",
    desc: "Every interaction is built on verified profiles and transparent process.",
    icon: <FaShieldAlt />,
  },
  {
    n: "02",
    title: "Transparency",
    desc: "Clear pricing and honest status updates at every step of a booking.",
    icon: <FaEye />,
  },
  {
    n: "03",
    title: "Reliability",
    desc: "Consistent booking, verification and completion flows customers can count on.",
    icon: <FaHandshake />,
  },
  {
    n: "04",
    title: "Customer First",
    desc: "Product decisions start from what makes booking a service simpler.",
    icon: <FaUserFriends />,
  },
  {
    n: "05",
    title: "Professional Growth",
    desc: "Tools that help providers turn skills into a sustainable business.",
    icon: <FaChartLine />,
  },
  {
    n: "06",
    title: "Continuous Improvement",
    desc: "Fixly evolves based on real usage from both sides of the marketplace.",
    icon: <FaSyncAlt />,
  },
];

const ValueCard = ({ value, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`fa-value-card fa-value-${index} ${visible ? "fa-visible" : ""}`}
      style={{ "--fa-delay": `${index * 70}ms` }}>
      <span className="fa-value-num">{value.n}</span>
      <span className="fa-value-icon" aria-hidden="true">
        {value.icon}
      </span>
      <h3 className="fa-value-title">{value.title}</h3>
      <p className="fa-value-desc">{value.desc}</p>
    </div>
  );
};

const ValuesSection = () => (
  <section className="fa-section fa-section-light">
    <div className="fa-container">
      <h2 className="fa-heading fa-heading-center">What we stand for</h2>
      <div className="fa-values-grid">
        {VALUES.map((v, i) => (
          <ValueCard key={v.title} value={v} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ValuesSection;
