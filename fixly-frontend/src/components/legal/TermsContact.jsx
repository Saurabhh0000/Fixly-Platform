import { useNavigate } from "react-router-dom";

const TermsContact = () => {
  const navigate = useNavigate();
  return (
    <section className="fterms-contact">
      <div className="fterms-container fterms-contact-inner">
        <h2 className="fterms-contact-title">Questions about these Terms?</h2>
        <p className="fterms-contact-text">
          If you have questions about these Terms &amp; Conditions, please
          contact Fixly through the official support channel.
        </p>
        <button
          type="button"
          className="fterms-contact-btn"
          onClick={() => navigate("/help-support")}>
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default TermsContact;
