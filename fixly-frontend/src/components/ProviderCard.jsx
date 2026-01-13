import React from "react";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaRupeeSign,
  FaStar,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import "../styles/fixly-provider-card.css";

const ProviderCard = ({ provider, onBook }) => {
  const rating = provider.rating ?? 0;
  const reviews = provider.ratingCount ?? 0;

  return (
    <div className="provider-card">
      {/* ===== TOP BAR ===== */}
      <div className="provider-top-bar">
        {/* LEFT : AVATAR */}
        <div className="avatar-container">
          <div className="provider-avatar">
            {provider.fullName?.charAt(0)?.toUpperCase()}
          </div>

          <div
            className={`availability-dot ${
              provider.available ? "online" : "offline"
            }`}>
            <FaCircle />
          </div>
        </div>

        {/* RIGHT : STATUS + RATING */}
        <div className="top-right-info">
          {provider.available && (
            <div className="status-badge">
              <FaCheckCircle /> Available
            </div>
          )}

          <div className="rating-badge">
            <FaStar className="star-icon" />
            <span className="rating-value">{rating.toFixed(1)}</span>
            <span className="review-count">({reviews})</span>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="provider-body">
        <h4 className="provider-name">{provider.fullName}</h4>
        <span className="provider-category">{provider.category}</span>

        {/* STATS */}
        <div className="provider-stats-grid">
          <div className="stat-item">
            <div className="stat-icon-wrapper blue">
              <FaBriefcase />
            </div>
            <div className="stat-tag">
              <p className="stat-label">Experience</p>
              <p className="stat-value">{provider.experienceYears} Years</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon-wrapper green">
              <FaRupeeSign />
            </div>
            <div className="stat-tag">
              <p className="stat-label">Price</p>
              <p className="stat-value">₹{provider.pricePerVisit}</p>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="location-footer">
          <FaMapMarkerAlt className="location-icon" />
          <span>
            {provider.area}, {provider.city}, {provider.pincode}
          </span>
        </div>
      </div>

      {/* ===== ACTION ===== */}
      <div className="card-actions">
        <button
          className="provider-book-btn"
          disabled={!provider.available}
          onClick={() => onBook(provider)}>
          {provider.available ? "Book Service" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
