import { useNavigate } from "react-router-dom";

const PrivacyContact = () => {
  const navigate = useNavigate();
  return (
    <section className="fprivacy-contact">
      <div className="fprivacy-container fprivacy-contact-inner">
        <h2 className="fprivacy-contact-title">
          Questions about your privacy?
        </h2>
        <p className="fprivacy-contact-text">
          If you have questions, concerns, or requests regarding this Privacy
          Policy or your personal information, please contact Fixly through the
          available support channels.
        </p>
        <button
          type="button"
          className="fprivacy-contact-btn"
          onClick={() => navigate("/help-support")}>
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default PrivacyContact;
