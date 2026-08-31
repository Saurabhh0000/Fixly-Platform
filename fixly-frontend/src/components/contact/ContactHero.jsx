import { useScrollReveal } from "../../hooks/useScrollReveal";

const ContactHero = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <header className="fixly-contact-hero">
      <div className="fixly-contact-hero-glow" aria-hidden="true" />
      <div
        ref={ref}
        className={`fixly-contact-container fixly-contact-hero-inner ${visible ? "fixly-contact-visible" : ""}`}>
        <span className="fixly-contact-eyebrow">Contact Fixly</span>
        <h1 className="fixly-contact-hero-title">How can we help?</h1>
        <p className="fixly-contact-hero-sub">
          Have a question about a service, booking, provider, payment, or your
          Fixly account? Our team is here to help.
        </p>
      </div>
    </header>
  );
};

export default ContactHero;
