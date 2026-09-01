import { FaCalendarAlt, FaArrowDown } from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ReschedulingVisual = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`fcxl-reschedule ${visible ? "fcxl-visible" : ""}`}>
      <div className="fcxl-reschedule-card">
        <span className="fcxl-reschedule-label">Original Booking</span>
        <div className="fcxl-reschedule-datetime">
          <FaCalendarAlt aria-hidden="true" />
          Monday · 10:00 AM
        </div>
      </div>
      <div className="fcxl-reschedule-mid">
        <FaArrowDown aria-hidden="true" />
        <span>Reschedule</span>
      </div>
      <div className="fcxl-reschedule-card fcxl-reschedule-card-updated">
        <span className="fcxl-reschedule-label">Updated Booking</span>
        <div className="fcxl-reschedule-datetime">
          <FaCalendarAlt aria-hidden="true" />
          Tuesday · 2:00 PM
        </div>
      </div>
    </div>
  );
};

export default ReschedulingVisual;
