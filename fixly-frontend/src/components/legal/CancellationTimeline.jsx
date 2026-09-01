import {
  FaClipboardList,
  FaHandshake,
  FaCalendarCheck,
  FaBan,
  FaBalanceScale,
  FaCheckCircle,
} from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  {
    n: "01",
    label: "Booking Created",
    desc: "A customer submits a booking request.",
    icon: <FaClipboardList />,
  },
  {
    n: "02",
    label: "Provider Accepts",
    desc: "The provider reviews and accepts the request.",
    icon: <FaHandshake />,
  },
  {
    n: "03",
    label: "Appointment Scheduled",
    desc: "A service date and time is confirmed.",
    icon: <FaCalendarCheck />,
  },
  {
    n: "04",
    label: "Cancellation Requested",
    desc: "Either party requests a cancellation.",
    icon: <FaBan />,
  },
  {
    n: "05",
    label: "Policy Evaluation",
    desc: "Booking status and timing are reviewed.",
    icon: <FaBalanceScale />,
  },
  {
    n: "06",
    label: "Cancellation Confirmed",
    desc: "The booking is updated accordingly.",
    icon: <FaCheckCircle />,
  },
];

const TimelineNode = ({ step, index }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <li
      ref={ref}
      className={`fcxl-timeline-node ${visible ? "fcxl-visible" : ""}`}
      style={{ "--fcxl-delay": `${index * 80}ms` }}>
      <span className="fcxl-timeline-num">{step.n}</span>
      <span className="fcxl-timeline-icon" aria-hidden="true">
        {step.icon}
      </span>
      <h4 className="fcxl-timeline-label">{step.label}</h4>
      <p className="fcxl-timeline-desc">{step.desc}</p>
    </li>
  );
};

const CancellationTimeline = () => (
  <section className="fcxl-timeline-section">
    <div className="fcxl-container">
      <h2 className="fcxl-heading fcxl-heading-center">
        How a cancellation is evaluated
      </h2>
      <ol className="fcxl-timeline">
        {STEPS.map((step, i) => (
          <TimelineNode key={step.label} step={step} index={i} />
        ))}
      </ol>
    </div>
  </section>
);

export default CancellationTimeline;
