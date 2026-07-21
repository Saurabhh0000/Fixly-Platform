import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import fixlyApi from "../api/fixlyApi";
import ProviderCard from "../components/ProviderCard";
import {
  FaSearch,
  FaCity,
  FaTools,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaSadTear,
  FaBolt,
  FaUserCheck,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";
import "../styles/fixly-search.css";
import PublicLayout from "../layouts/PublicLayout";

/* ─────────────────────────────────────────────────────────
   FsSelect — a fully-styled dropdown that visually replaces
   the native <select>. Rendered via a portal to document.body
   so it isn't clipped by the search card, and so it can be
   styled consistently across all browsers (native <option>
   elements cannot be).
   ───────────────────────────────────────────────────────── */
const FsSelect = ({ icon, label, placeholder, value, options, onChange }) => {
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
    <div className="fs-input-group fs-select-wrap" ref={wrapRef}>
      <div className="fs-input-icon">{icon}</div>
      <div className="fs-input-body">
        <span className="fs-input-label">{label}</span>
        <button
          type="button"
          className="fs-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggleOpen}>
          <span
            className={`fs-select-value ${!selectedLabel ? "fs-select-placeholder" : ""}`}>
            {selectedLabel || placeholder}
          </span>
        </button>
      </div>
      <FaChevronDown
        className={`fs-select-arrow ${open ? "fs-select-arrow-open" : ""}`}
      />

      {open &&
        createPortal(
          <ul
            className="fs-select-menu"
            role="listbox"
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, width: pos.width }}>
            {options.length === 0 && (
              <li className="fs-select-empty">No options available</li>
            )}
            {options.map((o) => (
              <li
                key={o.value}
                role="option"
                aria-selected={value === o.value}
                tabIndex={0}
                className={`fs-select-option ${value === o.value ? "fs-select-option-active" : ""}`}
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

const SearchResults = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [params, setParams] = useSearchParams();
  const city = params.get("city") || "";
  const category = params.get("category") || "";

  const [searchCity, setSearchCity] = useState(city);
  const [searchCategory, setSearchCategory] = useState(category);

  const navigate = useNavigate();

  /* ─── sync URL → state ─── */
  useEffect(() => {
    setSearchCity(city);
    setSearchCategory(category);
  }, [city, category]);

  /* ─── load dropdowns ─── */
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [cityRes, catRes] = await Promise.all([
          fixlyApi.get("/api/addresses/cities"),
          fixlyApi.get("/api/categories"),
        ]);
        setCities(cityRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Filter load error", err);
        setCities([]);
        setCategories([]);
      }
    };
    loadFilters();
  }, []);

  /* ─── fetch providers ─── */
  useEffect(() => {
    const fetchProviders = async () => {
      if (!city || !category) return;
      setLoading(true);
      try {
        const res = await fixlyApi.get(
          `/api/providers/search?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`,
        );
        setProviders(res.data || []);
      } catch (err) {
        console.error("Provider fetch error", err);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [city, category]);

  /* ─── search action ─── */
  const handleSearch = () => {
    if (!searchCity || !searchCategory) return;
    setParams({ city: searchCity, category: searchCategory });
  };

  const handleBook = (provider) => {
    navigate("/book", { state: provider });
  };

  /* ─── full-page loader ─── */
  if (loading) {
    return (
      <div className="fs-page-loader">
        <div className="fs-loader-inner">
          <div className="fs-loader-ring" />
          <div className="fs-loader-logo">
            <FaBolt />
          </div>
        </div>
        <p>Finding best providers near you…</p>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="fixly-search">
        {/* ══════════ HERO ══════════ */}
        <section className="fs-hero">
          <div className="fs-hero-inner">
            <div className="fs-hero-badge">
              <FaBolt />
              <span>Fixly Service Network</span>
            </div>
            <h1>
              Find Trusted <span>Service Professionals</span>
            </h1>
            <p>
              Verified experts · Transparent pricing · Real customer ratings
            </p>

            <div className="fs-trust-strip">
              <div className="fs-trust-pill">
                <FaShieldAlt />
                <span>Identity Verified</span>
              </div>
              <div className="fs-trust-pill">
                <FaStar />
                <span>Customer Rated</span>
              </div>
              <div className="fs-trust-pill">
                <FaClock />
                <span>Quick Response</span>
              </div>
              <div className="fs-trust-pill">
                <FaUserCheck />
                <span>Background Checked</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ SEARCH BAR ══════════ */}
        <section className="fs-search-wrap">
          <div className="fs-search-card">
            <div className="fs-search-label">
              <FaFilter />
              <span>Filter Providers</span>
            </div>

            <div className="fs-search-row">
              {/* City */}
              <FsSelect
                icon={<FaCity />}
                label="City"
                placeholder="Select your city"
                value={searchCity}
                onChange={setSearchCity}
                options={cities.map((c) => ({ value: c, label: c }))}
              />

              <div className="fs-search-divider" />

              {/* Category */}
              <FsSelect
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

              {/* Button */}
              <button className="fs-search-btn" onClick={handleSearch}>
                <FaSearch />
                <span>Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* ══════════ BODY ══════════ */}
        <section className="fs-body">
          {/* Summary pill */}
          {!loading && city && category && (
            <div className="fs-summary">
              <FaMapMarkerAlt />
              <span>
                Showing <strong>{category}</strong> services in{" "}
                <strong>{city}</strong>
              </span>
            </div>
          )}

          {/* Empty state */}
          {!loading && city && category && providers.length === 0 && (
            <div className="fs-empty">
              <div className="fs-empty-icon">
                <FaSadTear />
              </div>
              <h3>No providers found</h3>
              <p>
                We couldn't find <strong>{category}</strong> professionals in{" "}
                <strong>{city}</strong> right now.
              </p>
              <span>Try a different city or service category.</span>
            </div>
          )}

          {/* Results */}
          {!loading && providers.length > 0 && (
            <>
              <div className="fs-results-header">
                <div className="fs-count-badge">
                  <FaUserCheck />
                  <span>{providers.length} providers available</span>
                </div>
              </div>

              <div className="fs-grid">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.providerId}
                    provider={p}
                    onBook={handleBook}
                  />
                ))}
              </div>
            </>
          )}

          {/* Landing placeholder (no search yet) */}
          {!city && !category && (
            <div className="fs-landing-hint">
              <div className="fs-hint-icon">
                <FaSearch />
              </div>
              <h3>Start your search</h3>
              <p>
                Select a city and service category above to find verified
                professionals near you.
              </p>
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
};

export default SearchResults;
