import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaTools,
  FaChevronDown,
  FaShieldAlt,
  FaCheckCircle,
  FaCreditCard,
} from "react-icons/fa";
import fixlyApi from "../../api/fixlyApi";
import toast from "react-hot-toast";
import { useScrollReveal, useParallax } from "../../hooks/useScrollReveal";

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
    },
  });

/* Same portal-based custom select pattern as before, restyled under the
   .fhome-* namespace so it no longer depends on Bootstrap layout. */
const HomeSelect = ({ icon, label, placeholder, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
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
      )
        setOpen(false);
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

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div className="fhome-input-group" ref={wrapRef}>
      <div className="fhome-input-icon">{icon}</div>
      <div className="fhome-input-body">
        <span className="fhome-input-lbl">{label}</span>
        <button
          type="button"
          className="fhome-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggleOpen}>
          <span
            className={`fhome-select-value ${!selectedLabel ? "fhome-select-placeholder" : ""}`}>
            {selectedLabel || placeholder}
          </span>
        </button>
      </div>
      <FaChevronDown
        className={`fhome-chevron ${open ? "fhome-chevron-open" : ""}`}
      />

      {open &&
        createPortal(
          <ul
            className="fhome-select-menu"
            role="listbox"
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, width: pos.width }}>
            {options.length === 0 && (
              <li className="fhome-select-empty">No options available</li>
            )}
            {options.map((o) => (
              <li
                key={o.value}
                role="option"
                aria-selected={value === o.value}
                tabIndex={0}
                className={`fhome-select-option ${value === o.value ? "fhome-select-option-active" : ""}`}
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

const FLOATING_CARDS = [
  {
    key: "provider",
    className: "fhome-float-card fhome-float-card-provider",
    speed: 0.12,
  },
  {
    key: "search",
    className: "fhome-float-card fhome-float-card-search",
    speed: 0.2,
  },
  {
    key: "booking",
    className: "fhome-float-card fhome-float-card-booking",
    speed: -0.15,
  },
];

const HomeHero = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [copyRef, copyVisible] = useScrollReveal();
  const providerRef = useParallax(FLOATING_CARDS[0].speed);
  const searchRef = useParallax(FLOATING_CARDS[1].speed);
  const bookingRef = useParallax(FLOATING_CARDS[2].speed);

  useEffect(() => {
    fixlyApi
      .get("/api/categories")
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
    fixlyApi
      .get("/api/addresses/cities")
      .then((r) => setCities(r.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (!searchCity) return warnToast("Please select a city first.");
    if (!searchCategory) return warnToast("Please select a service category.");
    navigate(
      `/search?city=${encodeURIComponent(searchCity)}&category=${encodeURIComponent(searchCategory)}`,
    );
  };

  return (
    <section className="fhome-hero">
      <div className="fhome-hero-glow" aria-hidden="true" />
      <div className="fhome-hero-grid" aria-hidden="true" />

      <div className="fhome-container fhome-hero-inner">
        <div
          ref={copyRef}
          className={`fhome-hero-copy ${copyVisible ? "fhome-visible" : ""}`}>
          <span className="fhome-hero-eyebrow">
            Your Home. Your Service. Your Fix.
          </span>
          <h1 className="fhome-hero-title">
            Trusted help,
            <br />
            <span className="fhome-accent">right when you need it.</span>
          </h1>
          <p className="fhome-hero-sub">
            Fixly connects you with verified professionals for everyday home
            services — plumbing, electrical work, cleaning, repairs and more —
            booked in minutes.
          </p>

          <div className="fhome-hero-cta-row">
            <button
              type="button"
              className="fhome-btn fhome-btn-primary"
              onClick={() => navigate("/search")}>
              Find a Service
            </button>
            <button
              type="button"
              className="fhome-btn fhome-btn-secondary"
              onClick={() => navigate("/become-provider")}>
              Become a Provider
            </button>
          </div>

          <ul className="fhome-hero-trust">
            <li>
              <FaShieldAlt aria-hidden="true" /> Verified Professionals
            </li>
            <li>
              <FaCreditCard aria-hidden="true" /> Transparent Booking
            </li>
            <li>
              <FaCheckCircle aria-hidden="true" /> Secure Service Flow
            </li>
          </ul>

          <div className="fhome-search-card">
            <div className="fhome-search-label">
              <FaSearch aria-hidden="true" />
              <span>Find a Service Near You</span>
            </div>
            <div className="fhome-search-row">
              <HomeSelect
                icon={<FaMapMarkerAlt />}
                label="City"
                placeholder="Select your city"
                value={searchCity}
                onChange={setSearchCity}
                options={cities.map((c) => ({ value: c, label: c }))}
              />
              <div className="fhome-search-sep" aria-hidden="true" />
              <HomeSelect
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
              <button
                type="button"
                className="fhome-search-btn"
                onClick={handleSearch}>
                <FaSearch aria-hidden="true" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        <div className="fhome-hero-visual" aria-hidden="true">
          <div ref={providerRef} className={FLOATING_CARDS[0].className}>
            <span className="fhome-float-rating">★ 4.9</span>
            <p className="fhome-float-title">AC Repair Expert</p>
            <span className="fhome-float-badge">
              <FaCheckCircle /> Verified
            </span>
          </div>
          <div ref={searchRef} className={FLOATING_CARDS[1].className}>
            <FaSearch aria-hidden="true" />
            <span>Search Service</span>
          </div>
          <div ref={bookingRef} className={FLOATING_CARDS[2].className}>
            <FaCheckCircle aria-hidden="true" />
            <span>Booking Confirmed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
