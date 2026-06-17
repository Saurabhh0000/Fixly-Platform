import { useState, useContext, useRef } from "react";
import {
  FiSearch,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiZap,
  FiShield,
  FiStar,
  FiCalendar,
  FiEye,
  FiFileText,
  FiTool,
  FiCreditCard,
  FiUser,
  FiHelpCircle,
  FiCheckCircle,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import "../styles/help-support.css";

/* ─── Role-specific data ─────────────────────────────────────── */

const USER_CATEGORIES = [
  {
    id: "booking",
    icon: <FiCalendar />,
    color: "#6C63FF",
    title: "Booking Issues",
    desc: "Reschedule, cancel, or resolve problems with your service bookings.",
    articles: 14,
  },
  {
    id: "payments",
    icon: <FiCreditCard />,
    color: "#0EA5E9",
    title: "Payments & Pricing",
    desc: "Understand charges, request refunds, or update your payment method.",
    articles: 11,
  },
  {
    id: "account",
    icon: <FiShield />,
    color: "#22C55E",
    title: "Account & Security",
    desc: "Manage your profile, password, and personal data privacy.",
    articles: 9,
  },
  {
    id: "quality",
    icon: <FiStar />,
    color: "#F59E0B",
    title: "Service Quality & Complaints",
    desc: "Report poor service, raise disputes, or share feedback on providers.",
    articles: 7,
  },
  {
    id: "faq",
    icon: <FiHelpCircle />,
    color: "#EC4899",
    title: "FAQs",
    desc: "Quick answers to the most common questions from Fixly users.",
    articles: 22,
  },
  {
    id: "contact",
    icon: <FiMessageCircle />,
    color: "#8B5CF6",
    title: "Contact Support",
    desc: "Reach our support team via chat, email, or phone — we're here for you.",
    articles: null,
  },
];

const PROVIDER_CATEGORIES = [
  {
    id: "verification",
    icon: <FiFileText />,
    color: "#6C63FF",
    title: "Verification & Documents",
    desc: "Upload ID, certifications, or check your verification status.",
    articles: 8,
  },
  {
    id: "bookings",
    icon: <FiCalendar />,
    color: "#0EA5E9",
    title: "Booking Management",
    desc: "Accept, decline, or reschedule bookings from your dashboard.",
    articles: 13,
  },
  {
    id: "availability",
    icon: <FiEye />,
    color: "#22C55E",
    title: "Availability & Visibility",
    desc: "Set your working hours, service area, and control your listing.",
    articles: 10,
  },
  {
    id: "ratings",
    icon: <FiAward />,
    color: "#F59E0B",
    title: "Ratings & Reviews",
    desc: "Understand how ratings work and how to respond to client feedback.",
    articles: 6,
  },
  {
    id: "status",
    icon: <FiCheckCircle />,
    color: "#EC4899",
    title: "Account Status",
    desc: "Handle suspensions, policy violations, or reinstatement requests.",
    articles: 5,
  },
  {
    id: "contact",
    icon: <FiMessageCircle />,
    color: "#8B5CF6",
    title: "Contact Support",
    desc: "Reach our provider-dedicated support team for escalations.",
    articles: null,
  },
];

const USER_FAQS = [
  {
    q: "How do I reschedule or cancel a booking?",
    a: "Go to My Bookings → select the booking → tap Reschedule or Cancel. Cancellations made 24+ hours before the appointment are fully refunded. Late cancellations may incur a small fee.",
  },
  {
    q: "When will I receive my refund after cancellation?",
    a: "Refunds are processed within 3–5 business days to your original payment method. UPI payments typically reflect faster, within 1–2 business days.",
  },
  {
    q: "Can I request a different service provider?",
    a: "Yes. After a booking is confirmed, go to Booking Details → Request Different Provider. We'll reassign your booking to another available professional at no extra charge.",
  },
  {
    q: "What if the provider doesn't show up?",
    a: "Mark the booking as 'Provider No-Show' in the app. You'll receive a full refund and priority rebooking. Our team will also follow up with the provider.",
  },
  {
    q: "Is my payment information secure on Fixly?",
    a: "Absolutely. Fixly uses PCI-DSS compliant payment infrastructure. We never store raw card details — all transactions are tokenized through our secure payment gateway.",
  },
];

const PROVIDER_FAQS = [
  {
    q: "How long does profile verification take?",
    a: "Standard verification takes 2–4 business days after all documents are submitted. You'll receive an email confirmation once your profile is approved and live on Fixly.",
  },
  {
    q: "Why am I not appearing in search results?",
    a: "Visibility depends on verification status, service area settings, and availability windows. Ensure your calendar is up to date and your service radius covers the searched area.",
  },
  {
    q: "How is my rating calculated?",
    a: "Your rating is a weighted average of verified post-service reviews from clients. Recent reviews carry more weight. A minimum of 5 completed jobs is required for a public rating to appear.",
  },
  {
    q: "What happens if a client raises a false complaint?",
    a: "Our disputes team reviews all complaints objectively using job photos, timestamps, and communication history. Providers are notified and given 48 hours to submit their response before any action is taken.",
  },
  {
    q: "How and when do I receive my payouts?",
    a: "Payouts are released 24 hours after a job is marked complete and the client review window closes. Funds land in your registered bank account within 1–2 business days.",
  },
];

/* ─── Sub-components ─────────────────────────────────────────── */

function StatusBadge() {
  return (
    <div className="hs-status-badge">
      <span className="hs-status-dot" />
      Support is online — avg. response in &lt; 2 hrs
    </div>
  );
}

function QuickActions() {
  return (
    <div className="hs-quick-actions">
      <button className="hs-qa-btn hs-qa-primary">
        <FiMessageCircle />
        <span>Contact Support</span>
      </button>
      <button className="hs-qa-btn hs-qa-ghost hs-qa-soon">
        <FiZap />
        <span>Live Chat</span>
        <span className="hs-soon-tag">Soon</span>
      </button>
      <button className="hs-qa-btn hs-qa-ghost">
        <FiMail />
        <span>Email Us</span>
      </button>
      <button className="hs-qa-btn hs-qa-danger">
        <FiAlertCircle />
        <span>Emergency Help</span>
      </button>
    </div>
  );
}

function CategoryCard({ cat }) {
  return (
    <div className="hs-cat-card" style={{ "--card-accent": cat.color }}>
      <div
        className="hs-cat-icon"
        style={{ background: cat.color + "18", color: cat.color }}>
        {cat.icon}
      </div>
      <div className="hs-cat-body">
        <h3 className="hs-cat-title">{cat.title}</h3>
        <p className="hs-cat-desc">{cat.desc}</p>
      </div>
      {cat.articles && (
        <span className="hs-cat-meta">{cat.articles} articles</span>
      )}
    </div>
  );
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hs-faq-item${open ? " hs-faq-open" : ""}`}>
      <button className="hs-faq-q" onClick={() => setOpen((o) => !o)}>
        <span className="hs-faq-num">0{index + 1}</span>
        <span className="hs-faq-text">{item.q}</span>
        <span className="hs-faq-icon">
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      <div className="hs-faq-body">
        <p className="hs-faq-ans">{item.a}</p>
      </div>
    </div>
  );
}

function ContactCard() {
  return (
    <div className="hs-contact-card">
      <div className="hs-contact-header">
        <FiTool className="hs-contact-headericon" />
        <div>
          <h3>Still need help?</h3>
          <p>Our team is ready to assist you</p>
        </div>
      </div>
      <ul className="hs-contact-list">
        <li>
          <span className="hs-contact-icon hs-contact-mail">
            <FiMail />
          </span>
          <div>
            <span className="hs-contact-label">Email</span>
            <span className="hs-contact-val">support@fixly.in</span>
          </div>
        </li>
        <li>
          <span className="hs-contact-icon hs-contact-phone">
            <FiPhone />
          </span>
          <div>
            <span className="hs-contact-label">Phone</span>
            <span className="hs-contact-val">+91 98765 43210</span>
          </div>
        </li>
        <li>
          <span className="hs-contact-icon hs-contact-clock">
            <FiClock />
          </span>
          <div>
            <span className="hs-contact-label">Working Hours</span>
            <span className="hs-contact-val">Mon – Sat, 9 AM – 9 PM IST</span>
          </div>
        </li>
        <li>
          <span className="hs-contact-icon hs-contact-zap">
            <FiZap />
          </span>
          <div>
            <span className="hs-contact-label">Response Time</span>
            <span className="hs-contact-val">Typically under 2 hours</span>
          </div>
        </li>
      </ul>
      <button className="hs-contact-cta">
        <FiMessageCircle /> Open a Support Ticket
      </button>
    </div>
  );
}

function EmptyState({ role }) {
  return (
    <div className="hs-empty">
      <div className="hs-empty-icon">
        <FiBookOpen />
      </div>
      <h2>Help center unavailable</h2>
      <p>
        {role
          ? "We couldn't load your personalised help content. Please try again."
          : "Sign in to see help articles tailored to your account."}
      </p>
      <button className="hs-empty-btn">Go to Sign In</button>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */

const HelpSupport = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const isUser = user?.role === "USER";
  const isProvider = user?.role === "PROVIDER";
  const hasRole = isUser || isProvider;

  const categories = isUser
    ? USER_CATEGORIES
    : isProvider
      ? PROVIDER_CATEGORIES
      : [];
  const faqs = isUser ? USER_FAQS : isProvider ? PROVIDER_FAQS : [];

  const filteredCats = categories.filter(
    (c) =>
      !query ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase()),
  );

  if (!hasRole) return <EmptyState role={null} />;

  return (
    <div className="hs-root">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hs-hero">
        <div className="hs-hero-glow" />
        <div className="hs-hero-inner">
          <StatusBadge />
          <h1 className="hs-hero-title">
            Help &amp; Support
            <br />
            <span className="hs-hero-gradient">Center</span>
          </h1>
          <p className="hs-hero-sub">
            {isUser
              ? "Find answers to booking questions, payment issues, and account help — all in one place."
              : "Get guidance on verifications, bookings, payments, and growing your Fixly business."}
          </p>

          {/* Search */}
          <div className="hs-search-wrap" ref={searchRef}>
            <FiSearch className="hs-search-icon" />
            <input
              className="hs-search-input"
              type="text"
              placeholder="Search help articles, topics, guides…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="hs-search-clear" onClick={() => setQuery("")}>
                ✕
              </button>
            )}
          </div>

          <QuickActions />
        </div>
        <div className="hs-hero-art" aria-hidden>
          <div className="hs-art-circle hs-art-c1" />
          <div className="hs-art-circle hs-art-c2" />
          <div className="hs-art-circle hs-art-c3" />
          <FiHelpCircle className="hs-art-icon" />
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────── */}
      <main className="hs-main">
        <div className="hs-layout">
          <div className="hs-content">
            {/* Help Categories */}
            <section className="hs-section">
              <div className="hs-section-header">
                <h2 className="hs-section-title">
                  {isUser ? "User Help Topics" : "Provider Help Topics"}
                </h2>
                <span className="hs-section-count">
                  {filteredCats.length} topics
                </span>
              </div>

              {filteredCats.length > 0 ? (
                <div className="hs-cat-grid">
                  {filteredCats.map((cat) => (
                    <CategoryCard key={cat.id} cat={cat} />
                  ))}
                </div>
              ) : (
                <div className="hs-no-results">
                  <FiSearch />
                  <p>
                    No topics match "<strong>{query}</strong>". Try a different
                    search.
                  </p>
                </div>
              )}
            </section>

            {/* FAQ Section */}
            {!query && (
              <section className="hs-section">
                <div className="hs-section-header">
                  <h2 className="hs-section-title">
                    Frequently Asked Questions
                  </h2>
                  <span className="hs-section-count">
                    {faqs.length} answers
                  </span>
                </div>
                <div className="hs-faq-list">
                  {faqs.map((item, i) => (
                    <FaqItem key={i} item={item} index={i} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hs-sidebar">
            <ContactCard />
            <div className="hs-sidebar-tip">
              <FiUser className="hs-tip-icon" />
              <div>
                <strong>Signed in as {isUser ? "User" : "Provider"}</strong>
                <p>
                  You're seeing help articles relevant to your account type.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
