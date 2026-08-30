import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

const LegalCallout = ({ tone = "note", children }) => (
  <div className={`fterms-callout fterms-callout-${tone}`}>
    <span className="fterms-callout-icon" aria-hidden="true">
      {tone === "warning" ? <FaExclamationTriangle /> : <FaInfoCircle />}
    </span>
    <p>{children}</p>
  </div>
);

export default LegalCallout;
