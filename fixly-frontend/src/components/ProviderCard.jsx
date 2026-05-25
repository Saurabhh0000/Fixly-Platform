import React from "react";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaRupeeSign,
  FaStar,
  FaCheckCircle,
  FaCircle,
  FaPhoneAlt,
  FaClock,
  FaAward,
  FaShieldAlt,
} from "react-icons/fa";
import "../styles/fixly-provider-card.css";

const ProviderCard = ({ provider, onBook }) => {
  const rating = provider.rating ?? 0;
  const reviews = provider.ratingCount ?? 0;

  /* ===== STAR RENDERER ===== */
  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(value);
      const half = !filled && i < value;
      return (
        <span
          key={i}
          className={`pc-star ${filled ? "pc-star-filled" : half ? "pc-star-half" : "pc-star-empty"}`}>
          ★
        </span>
      );
    });
  };

  /* ===== EXPERIENCE LABEL ===== */
  const expLabel =
    provider.experienceYears === 0
      ? "Fresher"
      : provider.experienceYears === 1
        ? "1 Year"
        : `${provider.experienceYears} Years`;

  return (
    <div
      className={`pc-card ${provider.available ? "pc-card-available" : "pc-card-offline"}`}>
      {/* ===== ACCENT STRIP ===== */}
      <div
        className={`pc-accent-strip ${provider.available ? "strip-available" : "strip-offline"}`}
      />

      {/* ===== HEADER ===== */}
      <div className="pc-header">
        {/* AVATAR BLOCK */}
        <div className="pc-avatar-block">
          <div className="pc-avatar">
            <span className="pc-avatar-letter">
              {provider.fullName?.charAt(0)?.toUpperCase()}
            </span>
            <div
              className={`pc-status-dot ${provider.available ? "dot-online" : "dot-offline"}`}>
              <FaCircle />
            </div>
          </div>
        </div>

        {/* NAME + CATEGORY + BADGES */}
        <div className="pc-identity">
          <h4 className="pc-name">{provider.fullName}</h4>

          <div className="pc-category-row">
            <span className="pc-category-pill">
              <FaBriefcase className="pc-pill-icon" />
              {provider.category}
            </span>
          </div>

          <div className="pc-badge-row">
            {provider.status === "SUSPENDED" ? (
              <span className="pc-badge pc-badge-offline">
                <FaClock />
                Currently Unavailable
              </span>
            ) : provider.available ? (
              <span className="pc-badge pc-badge-online">
                <FaCheckCircle />
                Available Now
              </span>
            ) : (
              <span className="pc-badge pc-badge-offline">
                <FaClock />
                Offline
              </span>
            )}

            {rating >= 4.5 && (
              <span className="pc-badge pc-badge-top">
                <FaAward /> Top Rated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== RATING ROW ===== */}
      <div className="pc-rating-row">
        <div className="pc-stars">{renderStars(rating)}</div>
        <span className="pc-rating-num">{rating.toFixed(1)}</span>
        <span className="pc-review-count">
          <FaStar className="pc-mini-star" />
          {reviews} {reviews === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="pc-stats-grid">
        <div className="pc-stat-box">
          <div className="pc-stat-icon-wrap pc-blue">
            <FaBriefcase />
          </div>
          <div className="pc-stat-text">
            <p className="pc-stat-label">Experience</p>
            <p className="pc-stat-value">{expLabel}</p>
          </div>
        </div>

        <div className="pc-stat-box">
          <div className="pc-stat-icon-wrap pc-green">
            <FaRupeeSign />
          </div>
          <div className="pc-stat-text">
            <p className="pc-stat-label">Per Visit</p>
            <p className="pc-stat-value">₹{provider.pricePerVisit}</p>
          </div>
        </div>

        <div className="pc-stat-box">
          <div className="pc-stat-icon-wrap pc-violet">
            <FaShieldAlt />
          </div>
          <div className="pc-stat-text">
            <p className="pc-stat-label">Verified</p>
            <p className="pc-stat-value">Fixly Pro</p>
          </div>
        </div>

        <div className="pc-stat-box">
          <div className="pc-stat-icon-wrap pc-amber">
            <FaPhoneAlt />
          </div>
          <div className="pc-stat-text">
            <p className="pc-stat-label">Bookings</p>
            <p className="pc-stat-value">
              {reviews > 0 ? `${reviews}+` : "New"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== LOCATION ===== */}
      <div className="pc-location">
        <FaMapMarkerAlt className="pc-location-icon" />
        <span className="pc-location-text">
          {provider.area}, {provider.city}
          {provider.pincode ? ` — ${provider.pincode}` : ""}
        </span>
      </div>

      {/* ===== ACTION ===== */}
      <div className="pc-actions">
        <button
          className={`pc-book-btn ${provider.available ? "btn-active" : "btn-disabled"}`}
          disabled={!provider.available}
          onClick={() => onBook(provider)}>
          {provider.available ? (
            <>
              <FaCheckCircle className="btn-icon" />
              Book Service
            </>
          ) : (
            <>
              <FaClock className="btn-icon" />
              Unavailable
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
