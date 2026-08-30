import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const CUSTOMER_FAQS = [
  {
    q: "What services can I find on Fixly?",
    a: "Fixly connects you with professionals for services such as plumbing, electrical work, cleaning, appliance repair, and other everyday home services.",
  },
  {
    q: "How do I book a service?",
    a: "Search for a service, compare available providers, choose a date and time, and confirm your booking. The provider then reviews and accepts your request.",
  },
  {
    q: "Can I reschedule a booking?",
    a: "You can manage your bookings, including rescheduling where the current status allows it, from My Bookings.",
  },
  {
    q: "How do I know if a provider is verified?",
    a: "Verified providers complete Fixly's verification process before their profile goes live, which is shown on their profile.",
  },
  {
    q: "How does service completion work?",
    a: "Once your provider finishes the job, completion is confirmed using an OTP that you share only after the service is actually done.",
  },
];

const PROVIDER_FAQS = [
  {
    q: "How do I become a provider?",
    a: "You can apply to become a Fixly provider by submitting your service category, experience, pricing, and identity verification documents.",
  },
  {
    q: "How are service requests received?",
    a: "Once approved, you'll receive customer booking requests on your Provider Dashboard, which you can review and accept.",
  },
  {
    q: "Can providers manage availability?",
    a: "Yes. You can toggle your availability from your Provider Dashboard to control whether you're currently receiving new requests.",
  },
  {
    q: "How does verification work?",
    a: "Fixly reviews your submitted identity and service documents before your profile goes live, to help customers book with confidence.",
  },
  {
    q: "How can providers build their reputation?",
    a: "Your rating updates automatically as customers leave reviews for your completed bookings.",
  },
];

const FaqItem = ({ item, isOpen, onToggle, idBase }) => (
  <li className="fhiw-faq-item">
    <h3 className="fhiw-faq-question-wrap">
      <button
        type="button"
        className="fhiw-faq-question"
        aria-expanded={isOpen}
        aria-controls={`${idBase}-panel`}
        id={`${idBase}-btn`}
        onClick={onToggle}>
        {item.q}
        <span className="fhiw-faq-icon" aria-hidden="true">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
      </button>
    </h3>
    <div
      id={`${idBase}-panel`}
      role="region"
      aria-labelledby={`${idBase}-btn`}
      className={`fhiw-faq-answer ${isOpen ? "fhiw-faq-answer-open" : ""}`}>
      <p>{item.a}</p>
    </div>
  </li>
);

const FaqGroup = ({ title, items, groupKey, openId, setOpenId }) => (
  <div className="fhiw-faq-group">
    <h4 className="fhiw-faq-group-title">{title}</h4>
    <ul className="fhiw-faq-list">
      {items.map((item, i) => {
        const idBase = `fhiw-faq-${groupKey}-${i}`;
        const isOpen = openId === idBase;
        return (
          <FaqItem
            key={idBase}
            item={item}
            idBase={idBase}
            isOpen={isOpen}
            onToggle={() => setOpenId(isOpen ? null : idBase)}
          />
        );
      })}
    </ul>
  </div>
);

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <section className="fhiw-section fhiw-section-light">
      <div className="fhiw-container">
        <h2 className="fhiw-heading fhiw-heading-center">
          Frequently asked questions
        </h2>
        <div className="fhiw-faq-columns">
          <FaqGroup
            title="For Customers"
            items={CUSTOMER_FAQS}
            groupKey="customer"
            openId={openId}
            setOpenId={setOpenId}
          />
          <FaqGroup
            title="For Providers"
            items={PROVIDER_FAQS}
            groupKey="provider"
            openId={openId}
            setOpenId={setOpenId}
          />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
