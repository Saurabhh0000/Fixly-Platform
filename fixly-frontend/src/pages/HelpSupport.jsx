import { useState, useContext, useRef, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiAlertTriangle,
  FiChevronDown,
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
  FiAward,
  FiArrowRight,
  FiBookOpen,
  FiActivity,
  FiThumbsUp,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import "../styles/help-support.css";

/* ── Data ───────────────────────────────────────────────────── */

const USER_CATEGORIES = [
  {
    id: "booking",
    icon: <FiCalendar />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Booking Issues",
    desc: "Reschedule, cancel, or track service appointments. Get help with booking confirmations.",
    count: 14,
  },
  {
    id: "payments",
    icon: <FiCreditCard />,
    color: "#15803d",
    bg: "#bbf7d0",
    title: "Payments & Pricing",
    desc: "Understand charges, request refunds, or update your saved payment methods.",
    count: 11,
  },
  {
    id: "account",
    icon: <FiShield />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Account & Security",
    desc: "Manage profile, change password, enable two-factor auth, and privacy settings.",
    count: 9,
  },
  {
    id: "quality",
    icon: <FiThumbsUp />,
    color: "#15803d",
    bg: "#bbf7d0",
    title: "Service Quality & Complaints",
    desc: "Report a poor experience, raise disputes, or escalate unresolved issues.",
    count: 7,
  },
  {
    id: "faqs",
    icon: <FiHelpCircle />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "FAQs",
    desc: "Quick answers to the most common questions from Fixly customers.",
    count: 22,
  },
  {
    id: "contact",
    icon: <FiMessageCircle />,
    color: "#15803d",
    bg: "#bbf7d0",
    title: "Contact Support",
    desc: "Reach our team by chat, email, or phone. We respond within 2 hours.",
    count: null,
  },
];

const PROVIDER_CATEGORIES = [
  {
    id: "verification",
    icon: <FiFileText />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Verification & Documents",
    desc: "Upload ID, trade certificates, or check your current verification status.",
    count: 8,
  },
  {
    id: "bookings",
    icon: <FiCalendar />,
    color: "#15803d",
    bg: "#bbf7d0",
    title: "Booking Management",
    desc: "Accept, decline, or reschedule client bookings from your provider dashboard.",
    count: 13,
  },
  {
    id: "availability",
    icon: <FiEye />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Availability & Visibility",
    desc: "Set working hours, update your service area, and control your listing status.",
    count: 10,
  },
  {
    id: "ratings",
    icon: <FiAward />,
    color: "#15803d",
    bg: "#bbf7d0",
    title: "Ratings & Reviews",
    desc: "Understand how your score is calculated and how to respond to client feedback.",
    count: 6,
  },
  {
    id: "status",
    icon: <FiActivity />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Account Status",
    desc: "Handle suspensions, policy flags, or submit a reinstatement request.",
    count: 5,
  },
  {
    id: "contact",
    icon: <FiMessageCircle />,
    color: "#15803d",
    bg: "#bbf7d0",
    title: "Contact Support",
    desc: "Reach our provider-dedicated team for escalations and urgent matters.",
    count: null,
  },
];

const USER_FAQS = [
  {
    q: "How do I reschedule or cancel a booking?",
    a: "Go to My Bookings, select the appointment, and tap Reschedule or Cancel. Cancellations made more than 24 hours before the appointment are fully refunded. Cancellations within 24 hours may incur a small fee per our cancellation policy.",
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
    a: "Mark the booking as 'Provider No-Show' in the app within 30 minutes of the scheduled time. You'll receive a full refund automatically, and our team will contact you to arrange a priority rebook at no extra charge.",
  },
  {
    q: "Is my card and payment data secure on Fixly?",
    a: "Absolutely. Fixly uses PCI-DSS Level 1 compliant payment infrastructure. We never store raw card details — all payment data is tokenized through our encrypted gateway. Your financial information is never shared with service providers.",
  },
  {
    q: "How do I leave a review after a service?",
    a: "You'll receive a review prompt via email and in-app notification within 2 hours of your service being marked complete. You can also go to My Bookings → select the completed job → tap Leave a Review.",
  },
];

const PROVIDER_FAQS = [
  {
    q: "How long does profile verification take?",
    a: "Standard verification takes 2–4 business days after all required documents are submitted — typically a government-issued ID and your relevant trade certificate. You'll receive an email once your profile is approved and live on Fixly.",
  },
  {
    q: "Why isn't my profile appearing in search results?",
    a: "Visibility depends on your verification status, availability calendar, and service area settings. Ensure your working hours are set for the coming week and your service radius covers the area being searched. Profiles with no availability in the next 7 days are deprioritised.",
  },
  {
    q: "How is my star rating calculated?",
    a: "Your rating is a recency-weighted average of verified post-service reviews. Reviews from the past 90 days carry more weight than older ones. A minimum of 5 completed jobs is required before a public rating score appears on your profile.",
  },
  {
    q: "What happens if a client files a false complaint?",
    a: "Our disputes team reviews all complaints using job photos, GPS timestamps, and message history. You'll be notified immediately and given 48 hours to submit your response before any action is taken. False complaints are flagged and can affect the client's account.",
  },
  {
    q: "How and when do payouts arrive?",
    a: "Payouts are released 24 hours after a job is marked complete and the client's review window closes. Funds reach your registered bank account within 1–2 business days. You can view all payout history and pending amounts in your Earnings dashboard.",
  },
  {
    q: "Can I pause my profile temporarily?",
    a: "Yes. Go to Account Settings → Profile Status → Pause Profile. Your listing will be hidden from search, and existing bookings will remain active. You can reactivate at any time with no waiting period.",
  },
];

/* ── Sub-components ─────────────────────────────────────────── */

function FixlyLogo() {
  return (
    <div className="fhs-logo" aria-label="Fixly">
      <FiTool className="fhs-logo-icon" aria-hidden />
      <span className="fhs-logo-fix">Fix</span>
      <span className="fhs-logo-ly">ly</span>
      <span className="fhs-logo-badge">Support</span>
    </div>
  );
}

function OnlinePill() {
  return (
    <div className="fhs-online-pill">
      <span className="fhs-online-dot" aria-hidden />
      Support team online — avg. reply in under 2 hrs
    </div>
  );
}

function QuickActions() {
  const actions = [
    { icon: <FiMessageCircle />, label: "Contact Support", variant: "primary" },
    { icon: <FiMail />, label: "Email Us", variant: "ghost" },
    { icon: <FiZap />, label: "Live Chat", variant: "ghost", soon: true },
    { icon: <FiAlertTriangle />, label: "Emergency Help", variant: "danger" },
  ];
  return (
    <div className="fhs-quick-actions" role="list">
      {actions.map((a) => (
        <button
          key={a.label}
          role="listitem"
          className={`fhs-qa-btn fhs-qa-${a.variant}${a.soon ? " fhs-qa-disabled" : ""}`}
          disabled={a.soon}
          aria-label={a.soon ? `${a.label} (coming soon)` : a.label}>
          {a.icon}
          <span>{a.label}</span>
          {a.soon && <span className="fhs-soon-chip">Soon</span>}
        </button>
      ))}
    </div>
  );
}

function CategoryCard({ cat }) {
  return (
    <article
      className="fhs-cat-card"
      tabIndex={0}
      role="button"
      aria-label={`${cat.title} — ${cat.count ? cat.count + " articles" : "contact us"}`}>
      <div
        className="fhs-cat-icon"
        style={{ background: cat.bg, color: cat.color }}
        aria-hidden>
        {cat.icon}
      </div>
      <div className="fhs-cat-body">
        <h3 className="fhs-cat-title">{cat.title}</h3>
        <p className="fhs-cat-desc">{cat.desc}</p>
      </div>
      <div className="fhs-cat-footer">
        {cat.count ? (
          <span className="fhs-cat-count">{cat.count} articles</span>
        ) : (
          <span className="fhs-cat-count fhs-cat-cta">Get in touch</span>
        )}
        <FiArrowRight className="fhs-cat-arrow" aria-hidden />
      </div>
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
    <div className={`fhs-faq-item${isOpen ? " fhs-faq-open" : ""}`}>
      <button
        className="fhs-faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-body-${index}`}>
        <span className="fhs-faq-q-text">{item.q}</span>
        <span className="fhs-faq-chevron" aria-hidden>
          <FiChevronDown />
        </span>
      </button>
      <div
        id={`faq-body-${index}`}
        className="fhs-faq-body"
        style={{ maxHeight: `${height}px` }}
        ref={bodyRef}
        role="region">
        <p className="fhs-faq-answer">{item.a}</p>
      </div>
    </div>
  );
}

function ContactCard() {
  const rows = [
    {
      icon: <FiMail />,
      label: "Email",
      value: "support@fixly.in",
      color: "#16a34a",
    },
    {
      icon: <FiPhone />,
      label: "Phone",
      value: "+91 98765 43210",
      color: "#15803d",
    },
    {
      icon: <FiClock />,
      label: "Working Hours",
      value: "Mon – Sat, 9 AM – 9 PM IST",
      color: "#16a34a",
    },
    {
      icon: <FiZap />,
      label: "Response Time",
      value: "Typically under 2 hours",
      color: "#15803d",
    },
  ];
  return (
    <div className="fhs-contact-card">
      <div className="fhs-contact-card-bg" aria-hidden />
      <div className="fhs-contact-top">
        <span className="fhs-contact-icon-wrap" aria-hidden>
          <FiCheckCircle />
        </span>
        <div>
          <h3 className="fhs-contact-heading">Still need help?</h3>
          <p className="fhs-contact-sub">Our team is ready to assist you.</p>
        </div>
      </div>
      <ul className="fhs-contact-rows" aria-label="Contact information">
        {rows.map((r) => (
          <li key={r.label} className="fhs-contact-row">
            <span
              className="fhs-contact-row-icon"
              style={{ color: r.color }}
              aria-hidden>
              {r.icon}
            </span>
            <div>
              <span className="fhs-contact-row-label">{r.label}</span>
              <span className="fhs-contact-row-val">{r.value}</span>
            </div>
          </li>
        ))}
      </ul>
      <button className="fhs-contact-cta">
        <FiMessageCircle aria-hidden /> Open a Support Ticket
      </button>
    </div>
  );
}

function RoleChip({ role }) {
  return (
    <div className="fhs-role-chip">
      <FiUser aria-hidden />
      <div>
        <strong>Viewing as {role === "USER" ? "Customer" : "Provider"}</strong>
        <p>Help content is personalised for your account type.</p>
      </div>
    </div>
  );
}

function EmptyState({ loggedIn }) {
  return (
    <main className="fhs-empty" role="main">
      <div className="fhs-empty-icon" aria-hidden>
        <FiBookOpen />
      </div>
      <h2 className="fhs-empty-title">
        {loggedIn ? "Content unavailable" : "Sign in to view help"}
      </h2>
      <p className="fhs-empty-body">
        {loggedIn
          ? "We couldn't load your personalised help content. Please refresh the page or try again later."
          : "Sign in to see help articles and FAQs tailored to your account type."}
      </p>
      <button className="fhs-empty-btn">
        {loggedIn ? "Refresh page" : "Go to Sign In"}
      </button>
    </main>
  );
}

/* ── Main Component ─────────────────────────────────────────── */

export default function HelpSupport() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const searchInputRef = useRef(null);

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

  function handleFaqToggle(i) {
    setOpenFaq((prev) => (prev === i ? null : i));
  }

  if (!hasRole) return <EmptyState loggedIn={!!user} />;

  return (
    <div className="fhs-root">
      {/* ── Hero ───────────────────────────────────────────── */}
      <header className="fhs-hero" role="banner">
        <div className="fhs-hero-gradient" aria-hidden />
        <div className="fhs-hero-grid-bg" aria-hidden />

        <div className="fhs-hero-inner">
          <FixlyLogo />
          <OnlinePill />

          <h1 className="fhs-hero-title">
            Help &amp; Support
            <br />
            <span className="fhs-hero-title-em">Center</span>
          </h1>

          <p className="fhs-hero-sub">
            Get instant assistance, find answers, and manage your Fixly
            experience with confidence — whether you're a customer or a service
            professional.
          </p>

          {/* Search */}
          <div className="fhs-search-shell">
            <label htmlFor="fhs-search" className="fhs-sr-only">
              Search help articles
            </label>
            <FiSearch className="fhs-search-prefix" aria-hidden />
            <input
              id="fhs-search"
              ref={searchInputRef}
              className="fhs-search-input"
              type="search"
              placeholder="Search help articles, topics, FAQs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button
                className="fhs-search-clear"
                onClick={() => {
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search">
                <FiX />
              </button>
            )}
          </div>

          <QuickActions />
        </div>

        {/* Decorative art */}
        <div className="fhs-hero-art" aria-hidden>
          <div className="fhs-art-ring fhs-ring-1" />
          <div className="fhs-art-ring fhs-ring-2" />
          <div className="fhs-art-ring fhs-ring-3" />
          <div className="fhs-art-center">
            <FiTool />
          </div>
          <div className="fhs-art-orbit fhs-orbit-1">
            <FiShield />
          </div>
          <div className="fhs-art-orbit fhs-orbit-2">
            <FiStar />
          </div>
          <div className="fhs-art-orbit fhs-orbit-3">
            <FiCheckCircle />
          </div>
        </div>
      </header>

      {/* ── Page body ──────────────────────────────────────── */}
      <main className="fhs-page" id="main-content">
        <div className="fhs-layout">
          {/* Left / main column */}
          <div className="fhs-col-main">
            {/* Categories */}
            <section className="fhs-section" aria-labelledby="cat-heading">
              <div className="fhs-section-hdr">
                <h2 id="cat-heading" className="fhs-section-title">
                  {query
                    ? `Results for "${query}"`
                    : `${roleLabel} Help Topics`}
                </h2>
                <span className="fhs-section-badge">
                  {filtered.length} {filtered.length === 1 ? "topic" : "topics"}
                </span>
              </div>

              {filtered.length > 0 ? (
                <div className="fhs-cat-grid">
                  {filtered.map((cat) => (
                    <CategoryCard key={cat.id} cat={cat} />
                  ))}
                </div>
              ) : (
                <div className="fhs-no-results" role="status">
                  <FiSearch aria-hidden />
                  <p>
                    No topics matched <strong>"{query}"</strong>. Try a broader
                    search term or{" "}
                    <button
                      className="fhs-link-btn"
                      onClick={() => setQuery("")}>
                      clear the search
                    </button>
                    .
                  </p>
                </div>
              )}
            </section>

            {/* FAQ */}
            {!query && (
              <section className="fhs-section" aria-labelledby="faq-heading">
                <div className="fhs-section-hdr">
                  <h2 id="faq-heading" className="fhs-section-title">
                    Frequently Asked Questions
                  </h2>
                  <span className="fhs-section-badge">
                    {faqs.length} answers
                  </span>
                </div>

                <div className="fhs-faq-list" role="list">
                  {faqs.map((item, i) => (
                    <div role="listitem" key={i}>
                      <FaqItem
                        item={item}
                        index={i}
                        isOpen={openFaq === i}
                        onToggle={() => handleFaqToggle(i)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right / sidebar */}
          <aside
            className="fhs-col-side"
            aria-label="Support contact information">
            <ContactCard />
            <RoleChip role={user.role} />
          </aside>
        </div>
      </main>
    </div>
  );
}
