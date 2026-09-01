import { useNavigate } from "react-router-dom";

const RefundContact = () => {
  const navigate = useNavigate();
  return (
    <section className="frefund-contact">
      <div className="frefund-container frefund-contact-inner">
        <h2 className="frefund-contact-title">Need help with a refund?</h2>
        <p className="frefund-contact-text">
          If you have a question about refund eligibility or believe a refund
          has not been handled correctly, contact Fixly support with your
          booking details.
        </p>
        <button
          type="button"
          className="frefund-contact-btn"
          onClick={() => navigate("/help-support")}>
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default RefundContact;
