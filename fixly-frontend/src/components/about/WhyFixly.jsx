import {
  FaSearch,
  FaMoneyBillWave,
  FaBalanceScale,
  FaCalendarTimes,
  FaCommentSlash,
  FaEyeSlash,
  FaFrown,
  FaUserFriends,
  FaClipboardList,
  FaAward,
  FaClock,
  FaChartLine,
  FaWallet,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const CUSTOMER_PROBLEMS = [
  { label: "Finding trustworthy professionals", icon: <FaSearch /> },
  { label: "Unclear pricing", icon: <FaMoneyBillWave /> },
  { label: "Difficulty comparing providers", icon: <FaBalanceScale /> },
  { label: "Scheduling problems", icon: <FaCalendarTimes /> },
  { label: "Communication gaps", icon: <FaCommentSlash /> },
  { label: "Lack of transparency", icon: <FaEyeSlash /> },
  { label: "Poor service experiences", icon: <FaFrown /> },
];

const PROVIDER_PROBLEMS = [
  { label: "Finding consistent customers", icon: <FaUserFriends /> },
  { label: "Managing bookings", icon: <FaClipboardList /> },
  { label: "Building reputation", icon: <FaAward /> },
  { label: "Managing availability", icon: <FaClock /> },
  { label: "Growing their business", icon: <FaChartLine /> },
  { label: "Receiving reliable payments", icon: <FaWallet /> },
];

const ProblemCard = ({ item, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <li
      ref={ref}
      className={`fa-problem-card ${visible ? "fa-visible" : ""}`}
      style={{ "--fa-delay": `${index * 60}ms` }}>
      <span className="fa-problem-icon" aria-hidden="true">
        {item.icon}
      </span>
      {item.label}
    </li>
  );
};

const WhyFixly = () => {
  const [headRef, headVisible] = useScrollReveal();

  return (
    <section className="fa-section fa-section-light">
      <div className="fa-container">
        <h2
          ref={headRef}
          className={`fa-heading ${headVisible ? "fa-visible" : ""}`}>
          Home services shouldn't be complicated.
        </h2>

        <div className="fa-split">
          <div className="fa-split-col">
            <h3 className="fa-split-title">For Customers</h3>
            <ul className="fa-problem-list">
              {CUSTOMER_PROBLEMS.map((item, i) => (
                <ProblemCard key={item.label} item={item} index={i} />
              ))}
            </ul>
          </div>
          <div className="fa-split-col">
            <h3 className="fa-split-title">For Providers</h3>
            <ul className="fa-problem-list">
              {PROVIDER_PROBLEMS.map((item, i) => (
                <ProblemCard key={item.label} item={item} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFixly;
