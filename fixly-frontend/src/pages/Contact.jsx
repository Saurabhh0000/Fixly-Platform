import { useEffect, useState } from "react";
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import ContactSuccess from "../components/contact/ContactSuccess";
import HomeFooter from "../components/footer/HomeFooter";
import "../styles/fixly-contact.css";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact Fixly | Get in Touch";
    const meta = document.querySelector('meta[name="description"]');
    const prevContent = meta?.getAttribute("content");
    if (meta) {
      meta.setAttribute(
        "content",
        "Get in touch with the Fixly team for booking support, provider support, account questions, or general questions about the platform.",
      );
    }
    return () => {
      document.title = "Fixly";
      if (meta && prevContent) meta.setAttribute("content", prevContent);
    };
  }, []);

  return (
    <main className="fixly-contact">
      <ContactHero />
      <section className="fixly-contact-main">
        <div className="fixly-contact-container fixly-contact-grid">
          <ContactInfo />
          <div className="fixly-contact-form-card">
            <h2 className="fixly-contact-form-title">Send us a message</h2>
            <p className="fixly-contact-form-sub">
              Fill out the form and we'll get back to you.
            </p>
            {submitted ? (
              <ContactSuccess onSendAnother={() => setSubmitted(false)} />
            ) : (
              <ContactForm onSuccess={() => setSubmitted(true)} />
            )}
          </div>
        </div>
      </section>
      <HomeFooter />
    </main>
  );
};

export default Contact;
