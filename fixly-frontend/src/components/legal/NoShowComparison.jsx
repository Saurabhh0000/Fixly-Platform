import { FaUserClock, FaUserTie } from "react-icons/fa";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const NoShowComparison = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`fcxl-noshow-grid ${visible ? "fcxl-visible" : ""}`}>
      <div className="fcxl-noshow-card">
        <span className="fcxl-noshow-icon" aria-hidden="true">
          <FaUserClock />
        </span>
        <h4>Customer No-Show</h4>
        <ul>
          <li>The scheduled appointment is missed</li>
          <li>The provider may have already allocated time for the service</li>
          <li>Exceptional situations may be reviewed by support</li>
        </ul>
      </div>
      <div className="fcxl-noshow-card">
        <span className="fcxl-noshow-icon" aria-hidden="true">
          <FaUserTie />
        </span>
        <h4>Provider No-Show</h4>
        <ul>
          <li>The customer is left waiting for the service</li>
          <li>The service may not be completed as scheduled</li>
          <li>Repeated instances may affect provider reliability standing</li>
        </ul>
      </div>
    </div>
  );
};

export default NoShowComparison;
