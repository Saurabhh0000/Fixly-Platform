import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaCalendarCheck,
  FaHome,
  FaUserCheck,
  FaShieldAlt,
  FaBolt,
  FaWrench,
  FaBroom,
  FaSignInAlt,
  FaUserPlus,
  FaMapMarkerAlt,
  FaTools,
  FaChevronDown,
  FaCheckCircle,
  FaStar,
  FaLeaf,
  FaArrowRight,
  FaPhoneAlt,
  FaLock,
} from "react-icons/fa";
import "../styles/fixly-home.css";
import Footer from "../components/footer/Footer";
import serviceImg1 from "../assets/service-1.png";
import serviceImg2 from "../assets/service-2.png";
import verifiedExpert from "../assets/verified-Expert.png";
import safeAndSecure from "../assets/safeAndSecure.png";
import support24 from "../assets/support-24x7.png";

const featureImages = [verifiedExpert, serviceImg2, safeAndSecure, support24];

/* ─── toast helpers ─── */
const warnToast = (msg) =>
  toast(msg, {
    icon: "⚠️",
    duration: 3000,
    style: {
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fcd34d",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    },
  });

/* ─────────────────────────────────────────────────────────
   FhSelect — a fully-styled dropdown that visually replaces
   the native <select>. Rendered via a portal to document.body
   so it isn't clipped by the search card's overflow:hidden,
   and so it can be styled consistently across all browsers
   (native <option> elements cannot be).
   ───────────────────────────────────────────────────────── */
const FhSelect = ({ icon, label, placeholder, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  const toggleOpen = () => {
    if (!open) updatePosition();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  const selectedLabel = (() => {
    const found = options.find((o) => o.value === value);
    return found ? found.label : "";
  })();

  return (
    <div className="fh-input-group fh-select-wrap" ref={wrapRef}>
      <div className="fh-input-icon">{icon}</div>
      <div className="fh-input-body">
        <span className="fh-input-lbl">{label}</span>
        <button
          type="button"
          className="fh-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggleOpen}>
          <span
            className={`fh-select-value ${!selectedLabel ? "fh-select-placeholder" : ""}`}>
            {selectedLabel || placeholder}
          </span>
        </button>
      </div>
      <FaChevronDown
        className={`fh-chevron ${open ? "fh-chevron-open" : ""}`}
      />

      {open &&
        createPortal(
          <ul
            className="fh-select-menu"
            role="listbox"
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, width: pos.width }}>
            {options.length === 0 && (
              <li className="fh-select-empty">No options available</li>
            )}
            {options.map((o) => (
              <li
                key={o.value}
                role="option"
                aria-selected={value === o.value}
                tabIndex={0}
                className={`fh-select-option ${value === o.value ? "fh-select-option-active" : ""}`}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(o.value);
                    setOpen(false);
                  }
                }}>
                {o.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  /* ── public API data ── */
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  /* ── Parallax for How It Works steps ── */
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("fh-how");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      // progress: 0 when section bottom enters view, 1 when it leaves top
      const progress = Math.max(
        0,
        Math.min(1, 1 - rect.bottom / (viewH + rect.height)),
      );

      // different offset multipliers per step for the stagger effect
      const multipliers = [-28, 0, 28];

      multipliers.forEach((mult, i) => {
        const el = document.getElementById(`fh-step-${i + 1}`);
        if (el) {
          el.style.transform = `translateY(${progress * mult}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount in case section is already in view
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // /api/categories — public endpoint
    fixlyApi
      .get("/api/categories")
      .then((r) => setCategories(r.data || []))
      .catch(() => {});

    // cities for the search dropdown
    fixlyApi
      .get("/api/addresses/cities")
      .then((r) => setCities(r.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (!searchCity) {
      warnToast("Please select a city first.");
      return;
    }
    if (!searchCategory) {
      warnToast("Please select a service category.");
      return;
    }
    navigate(
      `/search?city=${encodeURIComponent(searchCity)}&category=${encodeURIComponent(searchCategory)}`,
    );
  };

  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="fh-hero">
        {/* blobs */}
        <div className="fh-blob fh-blob-1" />
        <div className="fh-blob fh-blob-2" />
        <div className="fh-blob fh-blob-3" />
        <div className="fh-blob fh-blob-4" />

        <Container className="fh-hero-container">
          {/* badge */}
          <div className="fh-hero-badge">
            <FaLeaf />
            <span>India's Most Trusted Home Service Platform</span>
          </div>

          {/* headline */}
          <h1 className="fh-hero-title">
            Book trusted home services with{" "}
            <span className="fh-brand">
              <span className="fh-brand-fix">Fix</span>
              <span className="fh-brand-ly">ly</span>
            </span>
          </h1>

          <p className="fh-hero-sub">
            Verified <strong>plumbers</strong>, <strong>electricians</strong>,{" "}
            <strong>cleaners</strong> &amp; technicians —{" "}
            <span className="fh-hl">fast</span>,{" "}
            <span className="fh-hl">safe</span> and{" "}
            <span className="fh-hl">reliable</span>.
          </p>

          {/* ── SEARCH BAR ── */}
          <div className="fh-search-card">
            <div className="fh-search-label">
              <FaSearch />
              <span>Find a Service Near You</span>
            </div>

            <div className="fh-search-row">
              {/* city */}
              <FhSelect
                icon={<FaMapMarkerAlt />}
                label="City"
                placeholder="Select your city"
                value={searchCity}
                onChange={setSearchCity}
                options={cities.map((c) => ({ value: c, label: c }))}
              />

              <div className="fh-search-sep" />

              {/* category */}
              <FhSelect
                icon={<FaTools />}
                label="Service"
                placeholder="Select a service"
                value={searchCategory}
                onChange={setSearchCategory}
                options={categories.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
              />

              <button className="fh-search-btn" onClick={handleSearch}>
                <FaSearch />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* trust pills */}
          <div className="fh-trust-pills">
            <div className="fh-trust-pill">
              <FaShieldAlt />
              <span>Identity Verified</span>
            </div>
            <div className="fh-trust-pill">
              <FaStar />
              <span>Customer Rated</span>
            </div>
            <div className="fh-trust-pill">
              <FaCheckCircle />
              <span>OTP Protected</span>
            </div>
            <div className="fh-trust-pill">
              <FaPhoneAlt />
              <span>Quick Response</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          SERVICE CARDS
      ══════════════════════════════════════ */}
      <section className="fh-services-section">
        <Container>
          <div className="fh-section-badge">
            <FaBolt />
            <span>Popular Services</span>
          </div>
          <h2 className="fh-section-title">What are you looking for?</h2>
          <p className="fh-section-sub">
            From repairs to cleaning — we've got you covered.
          </p>

          <Row className="fh-service-row">
            <Col md={4} sm={6}>
              <div className="fh-service-card">
                <div className="fh-sc-top">
                  <div className="fh-sc-icon fh-sc-blue">
                    <FaWrench />
                  </div>
                  <span className="fh-sc-badge fh-badge-green">
                    Upto 40% Off
                  </span>
                </div>
                <h4 className="fh-sc-title">Home Services</h4>
                <div className="fh-sc-tags">
                  <span className="fh-tag fh-tag-blue">
                    <FaWrench />
                    Plumbing
                  </span>
                  <span className="fh-tag fh-tag-amber">
                    <FaBolt />
                    Electrical
                  </span>
                  <span className="fh-tag fh-tag-green">
                    <FaBroom />
                    Cleaning
                  </span>
                </div>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="fh-service-card">
                <div className="fh-sc-top">
                  <div className="fh-sc-icon fh-sc-violet">
                    <FaBolt />
                  </div>
                  <span className="fh-sc-badge fh-badge-blue">
                    Fast Response
                  </span>
                </div>
                <h4 className="fh-sc-title">Instant Help</h4>
                <div className="fh-sc-tags">
                  <span className="fh-tag fh-tag-red">
                    <FaBolt />
                    Emergency
                  </span>
                  <span className="fh-tag fh-tag-violet">
                    <FaCalendarCheck />
                    Same-Day
                  </span>
                </div>
              </div>
            </Col>

            <Col md={4} sm={6}>
              <div className="fh-service-card">
                <div className="fh-sc-top">
                  <div className="fh-sc-icon fh-sc-green">
                    <FaHome />
                  </div>
                  <span className="fh-sc-badge fh-badge-dark">
                    Trusted Pros
                  </span>
                </div>
                <h4 className="fh-sc-title">Maintenance</h4>
                <div className="fh-sc-tags">
                  <span className="fh-tag fh-tag-sky">
                    <FaHome />
                    AC Service
                  </span>
                  <span className="fh-tag fh-tag-slate">
                    <FaWrench />
                    Appliances
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="fh-how-section" id="fh-how">
        <Container>
          <div className="fh-how-header">
            {" "}
            {/* ← wrap badge + title + sub */}
            <div className="fh-section-badge">
              <FaCheckCircle />
              <span>Simple Process</span>
            </div>
            <h2 className="fh-section-title">
              How <span className="fh-title-green">Fixly</span> Works
            </h2>
            <p className="fh-section-sub">
              Three easy steps to get a professional at your door.
            </p>
          </div>

          <div className="fh-steps" id="fh-steps">
            <div className="fh-step" id="fh-step-1">
              <div className="fh-step-num">01</div>
              <div className="fh-step-icon">
                <FaSearch />
              </div>
              <h5 className="fh-step-title">Search</h5>
              <p className="fh-step-desc">
                Select your city and the service you need from our verified
                providers.
              </p>
            </div>
            {/* no connector div needed — CSS handles the line */}
            <div className="fh-step" id="fh-step-2">
              <div className="fh-step-num">02</div>
              <div className="fh-step-icon">
                <FaCalendarCheck />
              </div>
              <h5 className="fh-step-title">Book</h5>
              <p className="fh-step-desc">
                Pick a date and address. Confirm your booking in seconds.
              </p>
            </div>
            <div className="fh-step" id="fh-step-3">
              <div className="fh-step-num">03</div>
              <div className="fh-step-icon">
                <FaHome />
              </div>
              <h5 className="fh-step-title">Relax</h5>
              <p className="fh-step-desc">
                Your verified professional arrives on time. Job done right.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          ZIG-ZAG — Verified Professionals
      ══════════════════════════════════════ */}
      <section className="fh-zig-section fh-zig-bg">
        <Container>
          <Row className="align-items-center fh-zig-row">
            <Col md={6}>
              <div className="fh-zig-img-wrap">
                <img
                  src={serviceImg1}
                  className="fh-zig-img"
                  alt="Verified Professionals"
                />
                <div className="fh-zig-img-badge">
                  <FaShieldAlt />
                  <span>100% Verified</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="fh-zig-content">
                <div className="fh-section-badge">
                  <FaShieldAlt />
                  <span>Trust & Safety</span>
                </div>
                <h3 className="fh-zig-title">
                  Verified Professionals You Can Trust
                </h3>
                <div className="fh-zig-pills">
                  <span className="fh-zig-pill fh-zp-green">
                    <FaCheckCircle />
                    Background Checked
                  </span>
                  <span className="fh-zig-pill fh-zp-dark">
                    <FaUserCheck />
                    Trusted Experts
                  </span>
                </div>
                <p className="fh-zig-desc">
                  <FaUserCheck className="fh-zig-desc-icon" />
                  All service providers are identity-verified, skill-tested, and
                  continuously reviewed by real customers.
                </p>
                <p className="fh-zig-desc">
                  <FaShieldAlt className="fh-zig-desc-icon" />
                  Ensuring safety, reliability, and high-quality service at your
                  doorstep every time.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── ZIG-ZAG — Fast Booking ── */}
      <section className="fh-zig-section">
        <Container>
          <Row className="align-items-center flex-md-row-reverse fh-zig-row">
            <Col md={6}>
              <div className="fh-zig-img-wrap">
                <img
                  src={serviceImg2}
                  className="fh-zig-img"
                  alt="Fast Booking"
                />
                <div className="fh-zig-img-badge fh-badge-blue-wrap">
                  <FaBolt />
                  <span>Instant Booking</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="fh-zig-content">
                <div className="fh-section-badge">
                  <FaBolt />
                  <span>Transparent & Fast</span>
                </div>
                <h3 className="fh-zig-title">Fast &amp; Transparent Booking</h3>
                <div className="fh-zig-pills">
                  <span className="fh-zig-pill fh-zp-blue">
                    <FaCalendarCheck />
                    Real-Time Updates
                  </span>
                  <span className="fh-zig-pill fh-zp-green">
                    <FaCheckCircle />
                    No Hidden Charges
                  </span>
                </div>
                <p className="fh-zig-desc">
                  <FaCalendarCheck className="fh-zig-desc-icon" />
                  Book services in minutes with live status tracking and instant
                  confirmations.
                </p>
                <p className="fh-zig-desc">
                  <FaBolt className="fh-zig-desc-icon" />
                  Clear pricing upfront — no surprises, no last-minute changes.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          FEATURE STRIP
      ══════════════════════════════════════ */}
      <section className="fh-feature-strip">
        <Container>
          <div className="fh-section-badge fh-badge-white">
            <FaStar />
            <span>Why Fixly</span>
          </div>
          <h2 className="fh-section-title fh-title-white">
            Everything you need, in one place
          </h2>

          <Row className="g-4 mt-2">
            {[
              {
                title: "Verified Experts",
                sub: "ID & skill checked",
                img: verifiedExpert,
                badge: "Trusted",
                bc: "fh-fc-green",
              },
              {
                title: "Instant Booking",
                sub: "Book in under 2 min",
                img: serviceImg2,
                badge: "Fast",
                bc: "fh-fc-blue",
              },
              {
                title: "Safe & Secure",
                sub: "OTP-protected service",
                img: safeAndSecure,
                badge: "Secure",
                bc: "fh-fc-violet",
              },
              {
                title: "24×7 Support",
                sub: "Always here for you",
                img: support24,
                badge: "Always On",
                bc: "fh-fc-amber",
              },
            ].map((f, i) => (
              <Col md={3} sm={6} key={i}>
                <div className="fh-feature-card">
                  <div className={`fh-fc-badge ${f.bc}`}>{f.badge}</div>
                  <h4 className="fh-fc-title">{f.title}</h4>
                  <p className="fh-fc-sub">{f.sub}</p>
                  <img src={f.img} alt={f.title} className="fh-fc-img" />
                  <button
                    className="fh-fc-btn"
                    onClick={() => navigate("/login")}>
                    <FaArrowRight />
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          TRUST & SAFETY
      ══════════════════════════════════════ */}
      <section className="fh-trust-section">
        <Container>
          <div className="fh-section-badge">
            <FaLock />
            <span>Your Safety</span>
          </div>
          <h2 className="fh-section-title">
            Your Safety, Our <span className="fh-title-green">Priority</span>
          </h2>
          <p className="fh-section-sub">
            Every service on Fixly is designed to be safe, secure, and
            stress-free.
          </p>

          <Row className="g-4 mt-2">
            {[
              {
                icon: FaShieldAlt,
                title: "Background Verified",
                desc: "ID & police verification for all professionals",
                color: "fh-trust-green",
              },
              {
                icon: FaUserCheck,
                title: "Trained Experts",
                desc: "Skill-certified & continuously rated by customers",
                color: "fh-trust-blue",
              },
              {
                icon: FaCalendarCheck,
                title: "OTP-Based Service",
                desc: "Service starts only after OTP verification",
                color: "fh-trust-violet",
              },
              {
                icon: FaBolt,
                title: "Secure Payments",
                desc: "100% secure & transparent pricing always",
                color: "fh-trust-amber",
              },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <Col md={3} sm={6} key={i}>
                  <div className="fh-trust-card">
                    <div className={`fh-trust-icon-wrap ${t.color}`}>
                      <Icon />
                    </div>
                    <h5 className="fh-trust-title">{t.title}</h5>
                    <p className="fh-trust-desc">{t.desc}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="fh-cta-section">
        <div className="fh-cta-blob fh-cta-blob-1" />
        <div className="fh-cta-blob fh-cta-blob-2" />

        <Container className="fh-cta-inner">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="fh-cta-section-badge">
                <FaLeaf />
                <span>Get Started Today</span>
              </div>
              <h2 className="fh-cta-title">
                Start booking with{" "}
                <span className="fh-cta-brand">
                  <span className="fh-brand-fix">Fix</span>
                  <span className="fh-cta-ly">ly</span>
                </span>
              </h2>
              <p className="fh-cta-sub">
                Join thousands of users booking verified professionals — fast,
                safe and hassle-free.
              </p>
              <div className="fh-cta-badges">
                <span className="fh-cta-badge">
                  <FaShieldAlt />
                  Verified Experts
                </span>
                <span className="fh-cta-badge">
                  <FaBolt />
                  Fast Booking
                </span>
                <span className="fh-cta-badge">
                  <FaUserCheck />
                  Trusted Platform
                </span>
              </div>
            </Col>

            <Col md={4}>
              <div className="fh-cta-actions">
                <button
                  className="fh-cta-btn fh-cta-primary"
                  onClick={() => navigate("/login")}>
                  <FaSignInAlt />
                  <span>Login</span>
                  <FaArrowRight className="fh-btn-arrow" />
                </button>
                <button
                  className="fh-cta-btn fh-cta-secondary"
                  onClick={() => navigate("/register")}>
                  <FaUserPlus />
                  <span>Create Account</span>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Home;
