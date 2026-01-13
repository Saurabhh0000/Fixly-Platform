import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
} from "react-icons/fa";
import { useEffect } from "react";
import "../styles/fixly-home.css";
import Footer from "../components/footer/Footer";

import serviceImg1 from "../assets/service-1.png";
import serviceImg2 from "../assets/service-2.png";
import verifiedExpert from "../assets/verified-Expert.png";
import safeAndSecure from "../assets/safeAndSecure.png";
import support24 from "../assets/support-24x7.png";
const featureImages = [verifiedExpert, serviceImg2, safeAndSecure, support24];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) => entry.isIntersecting && entry.target.classList.add("show")
        ),
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="fixly-hero-swiggy">
        <Container>
          <Row>
            <Col lg={7}>
              <h1 className="hero-title">
                Book trusted home services with{" "}
                <span className="brand-fix">Fix</span>
                <span className="brand-ly">ly</span>
              </h1>

              <p className="hero-subtitle">
                Verified <strong>plumbers</strong>,{" "}
                <strong>electricians</strong>, <strong>cleaners</strong> &
                technicians —<span className="hero-highlight"> fast</span>,
                <span className="hero-highlight"> safe</span> and
                <span className="hero-highlight"> reliable</span>.
              </p>
            </Col>
          </Row>

          {/* HERO SERVICES */}
          <Row className="hero-services">
            <Col md={4}>
              <div className="service-card">
                <h4 className="service-title">HOME SERVICES</h4>

                <p className="service-desc">
                  <span className="icon plumbing">
                    <FaWrench /> Plumbing
                  </span>
                  <span className="icon electrical">
                    <FaBolt /> Electrical
                  </span>
                  <span className="icon cleaning">
                    <FaBroom /> Cleaning
                  </span>
                </p>

                <span className="offer-badge">UPTO 40% OFF</span>
              </div>
            </Col>

            <Col md={4}>
              <div className="service-card">
                <h4 className="service-title">INSTANT HELP</h4>

                <p className="service-desc">
                  <span className="icon emergency">
                    <FaBolt /> Emergency
                  </span>
                  <span className="icon calendar">
                    <FaCalendarCheck /> Same-Day
                  </span>
                </p>

                <span className="offer-badge blue">FAST RESPONSE</span>
              </div>
            </Col>

            <Col md={4}>
              <div className="service-card">
                <h4 className="service-title">MAINTENANCE</h4>

                <p className="service-desc">
                  <span className="icon ac">
                    <FaHome /> AC
                  </span>
                  <span className="icon repair">
                    <FaWrench /> Appliances
                  </span>
                </p>

                <span className="offer-badge dark">TRUSTED PROS</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= HOW IT WORKS ================= */}
      <section className="fixly-section fade-in">
        <Container>
          <h2 className="fixly-section-title text-center">
            How <span>Fixly</span> Works
          </h2>

          <Row className="text-center mt-5">
            {[
              [FaSearch, "Search"],
              [FaCalendarCheck, "Book"],
              [FaHome, "Relax"],
            ].map(([Icon, title], i) => (
              <Col md={4} key={i}>
                <div className="fixly-icon-box">
                  <Icon />
                </div>
                <h5>{title}</h5>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= ZIG ZAG ================= */}
      {/* ================= ZIG ZAG ================= */}
      <section className="fixly-section bg-soft fade-in">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img src={serviceImg1} className="zig-img" alt="Verified" />
            </Col>

            <Col md={6}>
              <div className="zig-content">
                <div className="zig-heading">
                  <FaShieldAlt className="heading-icon" />
                  <h3>Verified Professionals</h3>
                </div>

                {/* BADGES — RIGHT ALIGNED, BELOW H3 */}
                <div className="zig-badges right">
                  <span className="badge-pill green">Background Checked</span>
                  <span className="badge-pill dark">Trusted Experts</span>
                </div>

                {/* DESCRIPTION */}
                <p className="zig-desc">
                  <FaUserCheck className="desc-icon" />
                  All service providers are identity-verified, skill-tested, and
                  continuously reviewed by customers.
                </p>

                <p className="zig-desc">
                  <FaShieldAlt className="desc-icon" />
                  Ensuring safety, reliability, and high-quality service at your
                  doorstep.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="fixly-section fade-in">
        <Container>
          <Row className="align-items-center flex-md-row-reverse">
            <Col md={6}>
              <img src={serviceImg2} className="zig-img" alt="Fast Booking" />
            </Col>

            <Col md={6}>
              <div className="zig-content">
                <div className="zig-heading">
                  <FaBolt className="heading-icon" />
                  <h3>Fast & Transparent Booking</h3>
                </div>

                {/* BADGES — RIGHT ALIGNED */}
                <div className="zig-badges right">
                  <span className="badge-pill blue">Real-Time Updates</span>
                  <span className="badge-pill green">No Hidden Charges</span>
                </div>

                {/* DESCRIPTION */}
                <p className="zig-desc">
                  <FaCalendarCheck className="desc-icon" />
                  Book services in minutes with live status tracking and instant
                  confirmations.
                </p>

                <p className="zig-desc">
                  <FaBolt className="desc-icon" />
                  Clear pricing upfront — no surprises, no last-minute changes.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ================= FEATURES (UI ONLY) ================= */}
      <section className="fixly-feature-strip">
        <Container>
          <Row className="g-4">
            {[
              "VERIFIED EXPERTS",
              "INSTANT BOOKING",
              "SAFE & SECURE",
              "24×7 SUPPORT",
            ].map((title, i) => (
              <Col md={3} sm={6} key={i}>
                <div className="swiggy-card ui-only">
                  <div className="card-content">
                    <h3>{title}</h3>
                    <button className="arrow-btn">→</button>
                  </div>

                  <img
                    src={featureImages[i]}
                    alt={title}
                    className="card-image"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= TRUST & SAFETY ================= */}
      <section className="fixly-trust">
        <Container>
          <h2 className="section-title text-center">
            Your Safety, Our <span>Priority</span>
          </h2>

          <p className="section-sub text-center">
            Every service on Fixly is designed to be safe, secure, and
            stress-free.
          </p>

          <Row className="g-4 mt-4">
            <Col md={3} sm={6}>
              <div className="trust-card">
                <FaShieldAlt className="trust-icon" />
                <h5>Background Verified</h5>
                <p>ID & police verification for all professionals</p>
              </div>
            </Col>

            <Col md={3} sm={6}>
              <div className="trust-card">
                <FaUserCheck className="trust-icon" />
                <h5>Trained Experts</h5>
                <p>Skill-certified & continuously rated by customers</p>
              </div>
            </Col>

            <Col md={3} sm={6}>
              <div className="trust-card">
                <FaCalendarCheck className="trust-icon" />
                <h5>OTP-Based Service</h5>
                <p>Service starts only after OTP verification</p>
              </div>
            </Col>

            <Col md={3} sm={6}>
              <div className="trust-card">
                <FaBolt className="trust-icon" />
                <h5>Secure Payments</h5>
                <p>100% secure & transparent pricing</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= STRONG CTA ================= */}
      <section className="fixly-cta">
        <Container>
          <Row className="align-items-center">
            {/* TEXT */}
            <Col md={8}>
              <h2>
                Get started with trusted home services on{" "}
                <span className="cta-brand">Fixly</span>
              </h2>

              <p>
                Join thousands of users booking verified professionals — fast,
                safe and hassle-free.
              </p>

              {/* BADGES */}
              <div className="cta-badges">
                <span className="cta-badge">
                  <FaShieldAlt /> Verified Experts
                </span>
                <span className="cta-badge">
                  <FaBolt /> Fast Booking
                </span>
                <span className="cta-badge">
                  <FaUserCheck /> Trusted Platform
                </span>
              </div>
            </Col>

            {/* ACTIONS */}
            <Col md={4} className="cta-actions">
              <button
                className="cta-btn primary"
                onClick={() => navigate("/login")}>
                <FaSignInAlt /> Login
              </button>

              <button
                className="cta-btn secondary"
                onClick={() => navigate("/register")}>
                <FaUserPlus /> Register
              </button>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Home;
