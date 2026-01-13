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

  /* ================= SYNC URL PARAMS → STATE ================= */
  useEffect(() => {
    setSearchCity(city);
    setSearchCategory(category);
  }, [city, category]);

  /* ================= LOAD DROPDOWNS ================= */
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

  /* ================= FETCH PROVIDERS ================= */
  useEffect(() => {
    const fetchProviders = async () => {
      if (!city || !category) return;

      setLoading(true);
      try {
        const res = await fixlyApi.get(
          `/api/providers/search?city=${encodeURIComponent(
            city
          )}&category=${encodeURIComponent(category)}`
        );

        console.log("Providers API response:", res.data); // ✅ DEBUG
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

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    if (!searchCity || !searchCategory) return;

    setParams({
      city: searchCity,
      category: searchCategory, // ✅ DO NOT TRANSFORM
    });
  };

  const handleBook = (provider) => {
    navigate("/book", { state: provider });
  };

  return (
    <UserLayout>
      <div className="fixly-search">
        {/* ================= HERO ================= */}
        <div className="search-hero">
          <h1>Find Trusted Service Professionals</h1>
          <p>Verified experts • Transparent pricing • Real customer ratings</p>

          <div className="trust-badges">
            <div>
              <FaShieldAlt /> Verified
            </div>
            <div>
              <FaStar /> Rated
            </div>
            <div>
              <FaClock /> Quick Response
            </div>
          </div>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="search-box">
          {/* CITY */}
          <div className="search-input">
            <FaCity />
            <select
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}>
              <option value="">Select City</option>
              {cities.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}
          <div className="search-input">
            <FaTools />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSearch}>
            <FaSearch /> Search
          </button>
        </div>

        {/* ================= SUMMARY ================= */}
        {!loading && city && category && (
          <div className="search-summary">
            <FaMapMarkerAlt />
            Showing <strong>{category}</strong> services in{" "}
            <strong>{city}</strong>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="search-loading">
            <div className="spinner" />
            <p>Finding best providers near you…</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && city && category && providers.length === 0 && (
          <div className="search-empty">
            <FaSadTear />
            <h3>No providers found</h3>
            <p>
              We couldn’t find <strong>{category}</strong> services in{" "}
              <strong>{city}</strong>.
            </p>
            <span>Try another city or service category</span>
          </div>
        )}

        {/* ================= RESULTS ================= */}
        {!loading && providers.length > 0 && (
          <>
            <h4 className="search-count">
              {providers.length} providers available
            </h4>

            <div className="search-grid">
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
      </div>
    </UserLayout>
  );
};

export default SearchResults;
