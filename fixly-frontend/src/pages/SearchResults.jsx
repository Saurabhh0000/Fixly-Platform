import { useEffect, useState } from "react";
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
import UserLayout from "../layouts/UserLayout";

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
    <UserLayout>
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
              <div className="fs-input-group">
                <div className="fs-input-icon">
                  <FaCity />
                </div>
                <div className="fs-input-body">
                  <span className="fs-input-label">City</span>
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}>
                    <option value="">Select your city</option>
                    {cities.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <FaChevronDown className="fs-select-arrow" />
              </div>

              <div className="fs-search-divider" />

              {/* Category */}
              <div className="fs-input-group">
                <div className="fs-input-icon">
                  <FaTools />
                </div>
                <div className="fs-input-body">
                  <span className="fs-input-label">Service</span>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}>
                    <option value="">Select a service</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <FaChevronDown className="fs-select-arrow" />
              </div>

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
    </UserLayout>
  );
};

export default SearchResults;
