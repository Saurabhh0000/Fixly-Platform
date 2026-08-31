import { FaCheckCircle } from "react-icons/fa";

const ContactSuccess = ({ onSendAnother }) => (
  <div className="fixly-contact-success">
    <span className="fixly-contact-success-icon" aria-hidden="true">
      <FaCheckCircle />
    </span>
    <h3 className="fixly-contact-success-title">Message received.</h3>
    <p className="fixly-contact-success-text">
      Thanks for reaching out to Fixly. Our team has received your message and
      will get back to you.
    </p>
    <button
      type="button"
      className="fixly-contact-success-btn"
      onClick={onSendAnother}>
      Send another message
    </button>
  </div>
);

export default ContactSuccess;
