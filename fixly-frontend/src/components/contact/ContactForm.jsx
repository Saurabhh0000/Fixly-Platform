import { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { sendContactMessage } from "../../services/contactService";

const CONTACT_REASONS = [
  { value: "GENERAL_QUESTION", label: "General Question" },
  { value: "BOOKING_SUPPORT", label: "Booking Support" },
  { value: "PROVIDER_SUPPORT", label: "Provider Support" },
  { value: "ACCOUNT_SUPPORT", label: "Account Support" },
  { value: "PAYMENT_QUESTION", label: "Payment Question" },
  { value: "OTHER", label: "Other" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  reason: "GENERAL_QUESTION",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

function validateField(name, value) {
  switch (name) {
    case "name": {
      const trimmed = value.trim();
      if (!trimmed) return "Please enter your full name.";
      if (trimmed.length < 2) return "Please enter your full name.";
      return "";
    }
    case "email": {
      const trimmed = value.trim();
      if (!trimmed) return "Please enter your email address.";
      if (!EMAIL_REGEX.test(trimmed))
        return "Please enter a valid email address.";
      return "";
    }
    case "phone": {
      const trimmed = value.trim();
      if (!trimmed) return ""; // optional
      if (!PHONE_REGEX.test(trimmed))
        return "Please enter a valid phone number.";
      return "";
    }
    case "subject": {
      const trimmed = value.trim();
      if (!trimmed) return "Please let us know the subject.";
      if (trimmed.length < 4)
        return "Subject should be a bit more descriptive.";
      return "";
    }
    case "message": {
      const trimmed = value.trim();
      if (!trimmed) return "Please tell us how we can help.";
      if (trimmed.length < 10) return "Please provide a little more detail.";
      if (trimmed.length > 2000)
        return "Message is too long. Please shorten it.";
      return "";
    }
    default:
      return "";
  }
}

const ContactForm = ({ onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const fields = ["name", "email", "phone", "subject", "message"];
    const nextErrors = {};
    fields.forEach((f) => {
      nextErrors[f] = validateField(f, form[f]);
    });
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    });
    return Object.values(nextErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
        reason: form.reason,
      };
      const res = await sendContactMessage(payload);
      if (res?.success) {
        toast.success("Your message has been sent successfully.", {
          duration: 4000,
        });
        onSuccess?.();
        setForm(INITIAL_FORM);
        setTouched({});
        setErrors({});
      } else {
        toast.error(
          res?.message || "We couldn't send your message. Please try again.",
          { duration: 4000 },
        );
      }
    } catch {
      toast.error("We couldn't send your message. Please try again.", {
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name) =>
    touched[name] && errors[name] ? errors[name] : "";

  return (
    <form className="fixly-contact-form" onSubmit={handleSubmit} noValidate>
      <div className="fixly-contact-field">
        <label htmlFor="contact-name" className="fixly-contact-label">
          Full Name <span className="fixly-contact-required">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          className="fixly-contact-input"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldError("name")}
          aria-describedby={
            fieldError("name") ? "contact-name-error" : undefined
          }
        />
        {fieldError("name") && (
          <p id="contact-name-error" className="fixly-contact-error">
            {fieldError("name")}
          </p>
        )}
      </div>

      <div className="fixly-contact-field">
        <label htmlFor="contact-email" className="fixly-contact-label">
          Email Address <span className="fixly-contact-required">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="fixly-contact-input"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldError("email")}
          aria-describedby={
            fieldError("email") ? "contact-email-error" : undefined
          }
        />
        {fieldError("email") && (
          <p id="contact-email-error" className="fixly-contact-error">
            {fieldError("email")}
          </p>
        )}
      </div>

      <div className="fixly-contact-field">
        <label htmlFor="contact-phone" className="fixly-contact-label">
          Phone Number
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          className="fixly-contact-input"
          placeholder="+91 XXXXX XXXXX"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldError("phone")}
          aria-describedby={
            fieldError("phone") ? "contact-phone-error" : undefined
          }
        />
        {fieldError("phone") && (
          <p id="contact-phone-error" className="fixly-contact-error">
            {fieldError("phone")}
          </p>
        )}
      </div>

      <div className="fixly-contact-field">
        <label htmlFor="contact-reason" className="fixly-contact-label">
          What's this about?
        </label>
        <select
          id="contact-reason"
          name="reason"
          className="fixly-contact-input fixly-contact-select"
          value={form.reason}
          onChange={handleChange}>
          {CONTACT_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="fixly-contact-field">
        <label htmlFor="contact-subject" className="fixly-contact-label">
          Subject <span className="fixly-contact-required">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className="fixly-contact-input"
          placeholder="What can we help you with?"
          value={form.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldError("subject")}
          aria-describedby={
            fieldError("subject") ? "contact-subject-error" : undefined
          }
        />
        {fieldError("subject") && (
          <p id="contact-subject-error" className="fixly-contact-error">
            {fieldError("subject")}
          </p>
        )}
      </div>

      <div className="fixly-contact-field">
        <label htmlFor="contact-message" className="fixly-contact-label">
          Message <span className="fixly-contact-required">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          className="fixly-contact-input fixly-contact-textarea"
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldError("message")}
          aria-describedby={
            fieldError("message") ? "contact-message-error" : undefined
          }
        />
        {fieldError("message") && (
          <p id="contact-message-error" className="fixly-contact-error">
            {fieldError("message")}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="fixly-contact-submit-btn"
        disabled={submitting}>
        {submitting ? (
          <>
            <FaSpinner className="fixly-contact-spinner" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            <FaPaperPlane aria-hidden="true" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
