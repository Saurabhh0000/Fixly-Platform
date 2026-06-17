import { useState, useContext, useRef, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiClock,
  FiShield,
  FiCalendar,
  FiEye,
  FiFileText,
  FiTool,
  FiCreditCard,
  FiUser,
  FiHelpCircle,
  FiCheckCircle,
  FiAward,
  FiArrowRight,
  FiActivity,
  FiThumbsUp,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";
import "../styles/help-support.css";
import UserLayout from "../layouts/UserLayout";
import ProviderLayout from "../layouts/ProviderLayout";

/* ── Data ─────────────────────────────────────────────────────── */

const USER_CATEGORIES = [
  {
    id: "booking",
    icon: <FiCalendar />,
    title: "Booking Issues",
    desc: "Reschedule, cancel, or track your service appointments.",
  },
  {
    id: "cancellations",
    icon: <FiRefreshCw />,
    title: "Service Cancellations",
    desc: "Understand cancellation policies and what happens with your payment.",
  },
  {
    id: "account",
    icon: <FiShield />,
    title: "Account & Password Help",
    desc: "Reset your password, update profile details, and manage account settings.",
  },
  {
    id: "reviews",
    icon: <FiStar />,
    title: "Reviews & Ratings",
    desc: "Leave feedback for a completed service or understand how ratings work.",
  },
  {
    id: "faqs",
    icon: <FiHelpCircle />,
    title: "Frequently Asked Questions",
    desc: "Quick answers to the most common questions from Fixly customers.",
  },
  {
    id: "contact",
    icon: <FiMail />,
    title: "Contact Support",
    desc: "Reach our team by email or phone. We're available Monday to Saturday.",
    isCta: true,
  },
];

const PROVIDER_CATEGORIES = [
  {
    id: "verification",
    icon: <FiFileText />,
    title: "Verification & Documents",
    desc: "Upload your ID, trade certificates, and check your verification status.",
  },
  {
    id: "application",
    icon: <FiActivity />,
    title: "Application Status",
    desc: "Track where your provider application stands and what's needed next.",
  },
  {
    id: "reapply",
    icon: <FiRefreshCw />,
    title: "Reapply Process",
    desc: "Understand how to resubmit your application after a rejection or lapse.",
  },
  {
    id: "availability",
    icon: <FiEye />,
    title: "Availability & Visibility",
    desc: "Set your working hours, service area, and control your listing status.",
  },
  {
    id: "bookings",
    icon: <FiCalendar />,
    title: "Bookings & Customers",
    desc: "Manage incoming bookings, communicate with clients, and handle reschedules.",
  },
  {
    id: "ratings",
    icon: <FiAward />,
    title: "Ratings & Reviews",
    desc: "Learn how your score is calculated and how to respond to client feedback.",
  },
  {
    id: "faqs",
    icon: <FiHelpCircle />,
    title: "Frequently Asked Questions",
    desc: "Quick answers to the most common questions from Fixly providers.",
  },
  {
    id: "contact",
    icon: <FiMail />,
    title: "Contact Support",
    desc: "Reach our provider-dedicated team by email or phone.",
    isCta: true,
  },
];

const USER_FAQS = [
  {
    q: "How do I reschedule or cancel a booking?",
    a: "Go to My Bookings, select the appointment, and tap Reschedule or Cancel. Cancellations made more than 24 hours before the appointment are fully refunded. Cancellations within 24 hours may incur a fee per our cancellation policy.",
  },
  {
    q: "When will my refund arrive after cancellation?",
    a: "Refunds are processed within 3–5 business days to your original payment method. UPI transactions typically reflect faster, within 1–2 business days. You'll receive an email confirmation once the refund is initiated.",
  },
  {
    q: "Can I request a specific service provider?",
    a: "Yes. When booking, use the 'Choose Provider' option to browse available professionals in your area. You can filter by rating, experience, and reviews to find the right match.",
  },
  {
    q: "What if my provider doesn't show up?",
    a: "Mark the booking as 'Provider No-Show' in the app within 30 minutes of the scheduled time. You'll receive a full refund, and our team will reach out to help you rebook at your earliest convenience.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. Fixly uses PCI-DSS Level 1 compliant payment infrastructure. We never store raw card details — all payment data is tokenised through our encrypted gateway and is never shared with service providers.",
  },
  {
    q: "How do I leave a review after a service?",
    a: "You'll receive a review prompt via email and in-app notification once your service is marked complete. You can also go to My Bookings, select the completed job, and tap Leave a Review.",
  },
];

const PROVIDER_FAQS = [
  {
    q: "How long does profile verification take?",
    a: "Standard verification takes 2–4 business days after all required documents are submitted — typically a government-issued ID and your relevant trade certificate. You'll receive an email once your profile is approved and live on Fixly.",
  },
  {
    q: "Why isn't my profile appearing in search results?",
    a: "Visibility depends on your verification status, availability calendar, and service area settings. Ensure your working hours are set for the coming week and your service radius covers the area being searched. Profiles with no upcoming availability are deprioritised.",
  },
  {
    q: "How is my star rating calculated?",
    a: "Your rating is a recency-weighted average of verified post-service reviews. Reviews from the past 90 days carry more weight than older ones. A minimum of 5 completed jobs is required before a public score appears on your profile.",
  },
  {
    q: "What happens if a client files a complaint?",
    a: "Our team reviews all complaints using job photos, GPS timestamps, and message history. You'll be notified immediately and given 48 hours to submit your response before any action is taken.",
  },
  {
    q: "How and when do payouts arrive?",
    a: "Payouts are released 24 hours after a job is marked complete and the client's review window closes. Funds reach your registered bank account within 1–2 business days. View all payout history in your Earnings dashboard.",
  },
  {
    q: "Can I pause my profile temporarily?",
    a: "Yes. Go to Account Settings → Profile Status → Pause Profile. Your listing will be hidden from search while existing bookings remain active. You can reactivate at any time with no waiting period.",
  },
];

/* ── Sub-components ───────────────────────────────────────────── */

function CategoryCard({ cat }) {
  return (
    <article
      className={`hs-cat-card${cat.isCta ? " hs-cat-card--cta" : ""}`}
      tabIndex={0}
      role="button"
      aria-label={cat.title}>
      <div className="hs-cat-icon" aria-hidden>
        {cat.icon}
      </div>
      <div className="hs-cat-body">
        <h3 className="hs-cat-title">{cat.title}</h3>
        <p className="hs-cat-desc">{cat.desc}</p>
      </div>
      <span className="hs-cat-arrow" aria-hidden>
        <FiArrowRight />
      </span>
    </article>
  );
}

function FaqItem({ item, index, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`hs-faq-item${isOpen ? " hs-faq-open" : ""}`}>
      <button
        className="hs-faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-body-${index}`}>
        <span className="hs-faq-q">{item.q}</span>
        <span className="hs-faq-chevron" aria-hidden>
          <FiChevronDown />
        </span>
      </button>
      <div
        id={`faq-body-${index}`}
        className="hs-faq-body"
        style={{ maxHeight: `${height}px` }}
        ref={bodyRef}
        role="region">
        <p className="hs-faq-answer">{item.a}</p>
      </div>
    </div>
  );
}

function ContactCard({ role }) {
  const isProvider = role === "PROVIDER";
  return (
    <div className="hs-contact-card">
      <div className="hs-contact-header">
        <span className="hs-contact-icon" aria-hidden>
          <FiCheckCircle />
        </span>
        <div>
          <h3 className="hs-contact-title">
            {isProvider ? "Provider Support" : "Customer Support"}
          </h3>
          <p className="hs-contact-sub">We're here to help.</p>
        </div>
      </div>

      <ul className="hs-contact-list" aria-label="Contact details">
        <li className="hs-contact-row">
          <span className="hs-contact-row-icon" aria-hidden>
            <FiMail />
          </span>
          <div>
            <span className="hs-contact-row-label">Email</span>
            <a
              href={`mailto:${isProvider ? "providers@fixly.in" : "support@fixly.in"}`}
              className="hs-contact-row-val hs-contact-link">
              {isProvider ? "providers@fixly.in" : "support@fixly.in"}
            </a>
          </div>
        </li>
        <li className="hs-contact-row">
          <span className="hs-contact-row-icon" aria-hidden>
            <FiPhone />
          </span>
          <div>
            <span className="hs-contact-row-label">Phone</span>
            <a
              href="tel:+919876543210"
              className="hs-contact-row-val hs-contact-link">
              +91 98765 43210
            </a>
          </div>
        </li>
        <li className="hs-contact-row">
          <span className="hs-contact-row-icon" aria-hidden>
            <FiClock />
          </span>
          <div>
            <span className="hs-contact-row-label">Hours</span>
            <span className="hs-contact-row-val">Mon – Sat, 9 AM – 6 PM</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

function RoleChip({ role }) {
  return (
    <div className="hs-role-chip">
      <FiUser className="hs-role-chip-icon" aria-hidden />
      <div>
        <strong className="hs-role-chip-label">
          Viewing as {role === "USER" ? "Customer" : "Provider"}
        </strong>
        <p className="hs-role-chip-sub">
          Help content is tailored for your account type.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ loggedIn }) {
  return (
    <main className="hs-empty">
      <div className="hs-empty-icon" aria-hidden>
        <FiHelpCircle />
      </div>
      <h2 className="hs-empty-title">
        {loggedIn ? "Content unavailable" : "Sign in to view help"}
      </h2>
      <p className="hs-empty-body">
        {loggedIn
          ? "We couldn't load your help content. Please refresh the page or try again."
          : "Sign in to see help articles and FAQs tailored to your account type."}
      </p>
      <button className="hs-empty-btn">
        {loggedIn ? "Refresh page" : "Go to sign in"}
      </button>
    </main>
  );
}

/* ── Main Component ───────────────────────────────────────────── */

export default function HelpSupport() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
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
  const roleLabel = isUser ? "Customer" : isProvider ? "Provider" : "";

  const filtered = query.trim()
    ? categories.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.desc.toLowerCase().includes(query.toLowerCase()),
      )
    : categories;

  if (!hasRole) return <EmptyState loggedIn={!!user} />;

  const Layout = isProvider ? ProviderLayout : UserLayout;

  return (
    <Layout>
      <div className="hs-root">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="hs-hero">
          <div className="hs-hero-bg" aria-hidden />
          <div className="hs-hero-inner">
            {/* Wordmark */}
            <div className="hs-wordmark" aria-label="Fixly">
              <FiTool className="hs-wordmark-icon" aria-hidden />
              <span className="hs-wordmark-fix">Fix</span>
              <span className="hs-wordmark-ly">ly</span>
            </div>

            <h1 className="hs-hero-title">Help &amp; Support</h1>
            <p className="hs-hero-sub">
              Find answers to common questions and get assistance when you need
              it.
            </p>

            {/* Search */}
            <div className="hs-search-wrap">
              <label htmlFor="hs-search" className="hs-sr-only">
                Search help topics
              </label>
              <FiSearch className="hs-search-icon" aria-hidden />
              <input
                id="hs-search"
                ref={searchRef}
                className="hs-search"
                type="search"
                placeholder="Search help topics…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button
                  className="hs-search-clear"
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search">
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────────── */}
        <main className="hs-page" id="main-content">
          <div className="hs-layout">
            {/* Main column */}
            <div className="hs-col-main">
              {/* Categories */}
              <section className="hs-section" aria-labelledby="hs-cat-title">
                <div className="hs-section-hdr">
                  <h2 id="hs-cat-title" className="hs-section-title">
                    {query
                      ? `Results for "${query}"`
                      : `${roleLabel} Help Topics`}
                  </h2>
                  <span className="hs-section-count">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "topic" : "topics"}
                  </span>
                </div>

                {filtered.length > 0 ? (
                  <div className="hs-cat-grid">
                    {filtered.map((cat) => (
                      <CategoryCard key={cat.id} cat={cat} />
                    ))}
                  </div>
                ) : (
                  <div className="hs-no-results" role="status">
                    <FiSearch className="hs-no-results-icon" aria-hidden />
                    <p>
                      No topics matched <strong>"{query}"</strong>.{" "}
                      <button
                        className="hs-link-btn"
                        onClick={() => setQuery("")}>
                        Clear search
                      </button>{" "}
                      to see all topics.
                    </p>
                  </div>
                )}
              </section>

              {/* FAQs */}
              {!query && (
                <section className="hs-section" aria-labelledby="hs-faq-title">
                  <div className="hs-section-hdr">
                    <h2 id="hs-faq-title" className="hs-section-title">
                      Frequently Asked Questions
                    </h2>
                    <span className="hs-section-count">
                      {faqs.length} answers
                    </span>
                  </div>

                  <div className="hs-faq-list">
                    {faqs.map((item, i) => (
                      <FaqItem
                        key={i}
                        item={item}
                        index={i}
                        isOpen={openFaq === i}
                        onToggle={() =>
                          setOpenFaq((prev) => (prev === i ? null : i))
                        }
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hs-col-side" aria-label="Contact information">
              <ContactCard role={user.role} />
              <RoleChip role={user.role} />
            </aside>
          </div>
        </main>
      </div>
    </Layout>
  );
}
