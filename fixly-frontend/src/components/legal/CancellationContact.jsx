import { useNavigate } from "react-router-dom";

const CancellationContact = () => {
  const navigate = useNavigate();
  return (
    <section className="fcxl-contact">
      <div className="fcxl-container fcxl-contact-inner">
        <h2 className="fcxl-contact-title">Need help with a cancellation?</h2>
        <p className="fcxl-contact-text">
          If you believe a cancellation or refund was handled incorrectly,
          contact Fixly support with your booking details.
        </p>
        <button
          type="button"
          className="fcxl-contact-btn"
          onClick={() => navigate("/help-support")}>
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default CancellationContact;
