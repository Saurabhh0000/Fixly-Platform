import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaBroom,
  FaCalendarCheck,
  FaCheckCircle,
  FaHome,
  FaLock,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTools,
  FaUserCheck,
  FaWrench,
} from "react-icons/fa";
import "../styles/fixly-home.css";
import "../styles/fixly-home-v2.css";
import "../styles/fixly-home-parallax.css";
import HomeFooter from "../components/footer/HomeFooter";
import FixlyChatbot from "../components/chatbot/FixlyChatbot";
import HomeHero from "../components/home/HomeHero";
import serviceImg1 from "../assets/service-1.png";
import serviceImg2 from "../assets/service-2.png";
import verifiedExpert from "../assets/verified-Expert.png";
import safeAndSecure from "../assets/safeAndSecure.png";
import support24 from "../assets/support-24x7.png";

const services = [
  { title: "Home Repair", text: "Plumbing, electrical and everyday fixes.", icon: FaWrench },
  { title: "Cleaning", text: "Reliable professionals for a cleaner home.", icon: FaBroom },
  { title: "Maintenance", text: "Keep your home running smoothly.", icon: FaHome },
  { title: "Instant Help", text: "Get support when the job cannot wait.", icon: FaBolt },
];

const features = [
  { title: "Verified Experts", text: "Identity and skill verification before professionals serve customers.", icon: FaShieldAlt, image: verifiedExpert },
  { title: "Fast Booking", text: "Find a service, choose your professional and book in minutes.", icon: FaCalendarCheck, image: serviceImg2 },
  { title: "Secure Service", text: "OTP-based service flow and protected customer experience.", icon: FaLock, image: safeAndSecure },
  { title: "Always Supported", text: "A dependable platform experience whenever you need help.", icon: FaUserCheck, image: support24 },
];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.querySelector(".fixly-parallax-page");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = [...root.querySelectorAll("[data-parallax-speed]")];
    let raf = 0;

    const update = () => {
      raf = 0;
      if (reduceMotion.matches) return;
      const viewport = window.innerHeight;
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -160 || rect.top > viewport + 160) return;
        const speed = Number(el.dataset.parallaxSpeed || 0);
        const center = rect.top + rect.height / 2;
        const offset = (viewport / 2 - center) * speed;
        el.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".fixly-reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixly-parallax-page">
      <HomeHero />

      <div className="fixly-scroll-line" aria-hidden="true" />

      <section className="fixly-story fixly-story-dark fixly-services" id="services">
        <div className="fixly-orb fixly-orb-green" data-parallax-speed="0.12" aria-hidden="true" />
        <div className="fixly-container">
          <div className="fixly-section-intro fixly-reveal">
            <span className="fixly-kicker"><span>01</span> SERVICES</span>
            <h2>Everything your home needs.<br /><em>One platform.</em></h2>
            <p>From small repairs to recurring maintenance, Fixly brings trusted local professionals into one simple service flow.</p>
          </div>

          <div className="fixly-service-stage">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className={`fixly-bento fixly-bento-${index + 1} fixly-reveal`} data-parallax-speed={index % 2 ? "-0.045" : "0.07"}>
                  <span className="fixly-card-index">0{index + 1}</span>
                  <div className="fixly-icon"><Icon /></div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <span className="fixly-card-arrow"><FaArrowRight /></span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="fixly-parallax-cinema">
        <div className="fixly-cinema-backdrop" data-parallax-speed="0.16" aria-hidden="true" />
        <div className="fixly-cinema-glow" data-parallax-speed="-0.1" aria-hidden="true" />
        <div className="fixly-container fixly-cinema-content fixly-reveal">
          <span className="fixly-kicker"><span>02</span> THE FLOW</span>
          <h2>Search.<br /><span>Book.</span><br />Relax.</h2>
          <p>A calm, predictable booking journey designed around the customer.</p>
          <button className="fixly-outline-btn" onClick={() => navigate("/search")}>Explore Services <FaArrowRight /></button>
        </div>
        <div className="fixly-cinema-steps">
          {[
            ["01", "Search", "Choose your city and service."],
            ["02", "Book", "Select a professional and time."],
            ["03", "Relax", "Track the job until it is complete."],
          ].map(([num, title, text], index) => (
            <div key={num} className="fixly-cinema-step fixly-reveal" data-parallax-speed={index === 1 ? "0.035" : index === 0 ? "-0.045" : "0.06"}>
              <span>{num}</span><strong>{title}</strong><p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="fixly-story fixly-image-story">
        <div className="fixly-container">
          <div className="fixly-editorial-row fixly-reveal">
            <div className="fixly-editorial-copy">
              <span className="fixly-kicker"><span>03</span> TRUST</span>
              <h2>People you can<br /><em>count on.</em></h2>
              <p>Fixly is built around verified professionals, transparent booking and a service flow that keeps customers informed.</p>
              <div className="fixly-mini-list">
                <div><FaCheckCircle /> Background verified</div>
                <div><FaCheckCircle /> Customer reviewed</div>
                <div><FaCheckCircle /> OTP protected service</div>
              </div>
            </div>
            <div className="fixly-image-frame" data-parallax-speed="0.08">
              <img src={serviceImg1} alt="Verified Fixly professional" />
              <div className="fixly-image-stamp"><FaShieldAlt /><span>100%</span><small>VERIFIED</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="fixly-story fixly-editorial-dark">
        <div className="fixly-container">
          <div className="fixly-editorial-row reverse fixly-reveal">
            <div className="fixly-editorial-copy">
              <span className="fixly-kicker"><span>04</span> TRANSPARENCY</span>
              <h2>Know what is<br /><em>happening.</em></h2>
              <p>Real-time updates and a clear service journey replace uncertainty with visibility from booking to completion.</p>
              <div className="fixly-stat-line"><strong>01</strong><span>Instant confirmation</span></div>
              <div className="fixly-stat-line"><strong>02</strong><span>Live booking status</span></div>
              <div className="fixly-stat-line"><strong>03</strong><span>Clear service completion</span></div>
            </div>
            <div className="fixly-image-frame second" data-parallax-speed="-0.075">
              <img src={serviceImg2} alt="Fast Fixly booking" />
              <div className="fixly-floating-note" data-parallax-speed="0.12"><FaCalendarCheck /> Booking confirmed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="fixly-feature-wall">
        <div className="fixly-container">
          <div className="fixly-section-intro centered fixly-reveal">
            <span className="fixly-kicker"><span>05</span> WHY FIXLY</span>
            <h2>Built for the moments<br /><em>that matter.</em></h2>
          </div>
          <div className="fixly-feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className={`fixly-feature-card fixly-reveal feature-${index + 1}`} data-parallax-speed={index % 2 ? "0.045" : "-0.035"}>
                  <div className="fixly-feature-copy"><Icon /><span>0{index + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p></div>
                  <img src={feature.image} alt="" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="fixly-safety-arc">
        <div className="fixly-safety-ring" data-parallax-speed="0.1" aria-hidden="true" />
        <div className="fixly-container fixly-safety-content fixly-reveal">
          <span className="fixly-kicker"><span>06</span> SAFETY FIRST</span>
          <FaLock className="fixly-safety-icon" />
          <h2>Your safety is<br /><em>never an afterthought.</em></h2>
          <p>Verification, secure service activation and transparent status updates are part of the Fixly experience.</p>
          <button className="fixly-green-btn" onClick={() => navigate("/register")}>Join Fixly <FaArrowRight /></button>
        </div>
      </section>

      <section className="fixly-final-cta">
        <div className="fixly-cta-orb" data-parallax-speed="0.15" aria-hidden="true" />
        <div className="fixly-container fixly-reveal">
          <span className="fixly-kicker"><span>07</span> GET STARTED</span>
          <h2>Good service should<br /><em>feel this simple.</em></h2>
          <p>Find a trusted professional for your next job with Fixly.</p>
          <div className="fixly-cta-actions">
            <button className="fixly-green-btn" onClick={() => navigate("/search")}>Find a Service <FaArrowRight /></button>
            <button className="fixly-outline-btn" onClick={() => navigate("/become-provider")}>Become a Provider</button>
          </div>
          <div className="fixly-cta-proof"><FaStar /> Verified professionals &nbsp; • &nbsp; <FaTools /> Everyday services &nbsp; • &nbsp; <FaCheckCircle /> Secure flow</div>
        </div>
      </section>

      <HomeFooter />
      <FixlyChatbot />
    </div>
  );
};

export default Home;
