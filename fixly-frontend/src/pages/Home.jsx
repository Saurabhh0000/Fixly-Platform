import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import fixlyApi from "../api/fixlyApi";
import {
  FaCalendarCheck,
  FaHome,
  FaUserCheck,
  FaShieldAlt,
  FaBolt,
  FaWrench,
  FaBroom,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaCheckCircle,
  FaStar,
  FaLeaf,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";
import "../styles/fixly-home.css";
import "../styles/fixly-home-v2.css";
import HomeFooter from "../components/footer/HomeFooter";
import FixlyChatbot from "../components/chatbot/FixlyChatbot";
import HomeHero from "../components/home/HomeHero";
import serviceImg1 from "../assets/service-1.png";
import serviceImg2 from "../assets/service-2.png";
import verifiedExpert from "../assets/verified-Expert.png";
import safeAndSecure from "../assets/safeAndSecure.png";
import support24 from "../assets/support-24x7.png";

const Home = () => {
  const navigate = useNavigate();

  /* ── Parallax for How It Works steps (legacy .fh-* section, unchanged this pass) ── */
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("fh-how");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, 1 - rect.bottom / (viewH + rect.height)),
      );
      const multipliers = [-28, 0, 28];

      multipliers.forEach((mult, i) => {
        const el = document.getElementById(`fh-step-${i + 1}`);
        if (el) el.style.transform = `translateY(${progress * mult}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════
          HERO — rebuilt, plain CSS, .fhome-* namespace
      ══════════════════════════════════════ */}
      <HomeHero />

      {/* ══════════════════════════════════════
          SERVICE CARDS — unchanged this pass (still Bootstrap)
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
          HOW IT WORKS — unchanged this pass
      ══════════════════════════════════════ */}
      <section className="fh-how-section" id="fh-how">
        <Container>
          <div className="fh-how-header">
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
          ZIG-ZAG SECTIONS — unchanged this pass
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
          FEATURE STRIP — unchanged this pass
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
          TRUST & SAFETY — unchanged this pass
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
          CTA — unchanged this pass
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
                Find trusted professionals for your home — quickly and
                confidently.
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

      <HomeFooter />

      <FixlyChatbot />
    </>
  );
};

export default Home;
