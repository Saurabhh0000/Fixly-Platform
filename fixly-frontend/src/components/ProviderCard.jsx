import React, { useState } from "react";
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
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
  FaUserTie,
} from "react-icons/fa";
import "../styles/fixly-provider-card.css";

/* ══════════════════════════════════════════
   PROVIDER CARD
══════════════════════════════════════════ */
const ProviderCard = ({ provider, onBook }) => {
  const rating = provider.rating ?? 0;
  const reviews = provider.ratingCount ?? 0;

  const renderStars = (value) =>
    Array.from({ length: 5 }, (_, i) => {
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

  const expLabel =
    provider.experienceYears === 0
      ? "Fresher"
      : provider.experienceYears === 1
        ? "1 Yr Exp"
        : `${provider.experienceYears} Yrs Exp`;

  const isAvailable = provider.available && provider.status !== "SUSPENDED";

  return (
    <div className={`pc-card ${isAvailable ? "pc-available" : "pc-offline"}`}>
      {/* ── TOP GRADIENT BAND ── */}
      <div
        className={`pc-band ${isAvailable ? "pc-band-live" : "pc-band-off"}`}>
        {/* decorative blobs */}
        <div className="pc-blob pc-blob-1" />
        <div className="pc-blob pc-blob-2" />

        {/* availability ribbon */}
        <div
          className={`pc-ribbon ${isAvailable ? "ribbon-live" : "ribbon-off"}`}>
          <FaCircle className="pc-ribbon-dot" />
          {isAvailable ? "Available" : "Offline"}
        </div>

        {/* avatar */}
        <div className="pc-avatar-wrap">
          <div className="pc-avatar">
            <span className="pc-avatar-letter">
              {provider.fullName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          {rating >= 4.5 && (
            <div className="pc-top-badge" title="Top Rated">
              <FaAward />
            </div>
          )}
        </div>

        {/* name + category */}
        <div className="pc-band-identity">
          <h4 className="pc-name">{provider.fullName}</h4>
          <div className="pc-category-chip">
            <FaBriefcase />
            <span>{provider.category}</span>
          </div>
        </div>
      </div>

      {/* ── FLOATING BODY ── */}
      <div className="pc-body">
        {/* rating row */}
        <div className="pc-rating-bar">
          <div className="pc-stars">{renderStars(rating)}</div>
          <strong className="pc-rating-val">{rating.toFixed(1)}</strong>
          <span className="pc-reviews">
            <FaStar className="pc-mini-star" />
            {reviews} {reviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* stats grid */}
        <div className="pc-stats">
          <div className="pc-stat pc-stat-blue">
            <div className="pc-stat-icon">
              <FaBriefcase />
            </div>
            <div className="pc-stat-text">
              <span className="pc-stat-lbl">Experience</span>
              <span className="pc-stat-val">{expLabel}</span>
            </div>
          </div>

          <div className="pc-stat pc-stat-green">
            <div className="pc-stat-icon">
              <FaRupeeSign />
            </div>
            <div className="pc-stat-text">
              <span className="pc-stat-lbl">Per Visit</span>
              <span className="pc-stat-val">₹{provider.pricePerVisit}</span>
            </div>
          </div>

          <div className="pc-stat pc-stat-violet">
            <div className="pc-stat-icon">
              <FaShieldAlt />
            </div>
            <div className="pc-stat-text">
              <span className="pc-stat-lbl">Verified</span>
              <span className="pc-stat-val">Fixly Pro</span>
            </div>
          </div>

          <div className="pc-stat pc-stat-amber">
            <div className="pc-stat-icon">
              <FaBolt />
            </div>
            <div className="pc-stat-text">
              <span className="pc-stat-lbl">Bookings</span>
              <span className="pc-stat-val">
                {reviews > 0 ? `${reviews}+` : "New"}
              </span>
            </div>
          </div>
        </div>

        {/* location */}
        <div className="pc-location">
          <div className="pc-location-icon-wrap">
            <FaMapMarkerAlt />
          </div>
          <span className="pc-location-text">
            {provider.area}, {provider.city}
            {provider.pincode ? ` — ${provider.pincode}` : ""}
          </span>
        </div>

        {/* divider */}
        <div className="pc-divider" />

        {/* CTA */}
        <button
          className={`pc-book-btn ${isAvailable ? "pc-btn-live" : "pc-btn-off"}`}
          disabled={!isAvailable}
          onClick={() => onBook(provider)}>
          {isAvailable ? (
            <>
              <FaCheckCircle className="pc-btn-icon" />
              <span>Book Service</span>
              <FaChevronRight className="pc-btn-arrow" />
            </>
          ) : (
            <>
              <FaClock className="pc-btn-icon" />
              <span>Unavailable</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PAGINATION  (standalone, reusable)
   Usage: <ProviderPagination page={p} total={t} onChange={setPage} />
══════════════════════════════════════════ */
export const ProviderPagination = ({ page, total, onChange }) => {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const visible = pages.filter((n) => {
    if (total <= 7) return true;
    if (n === 1 || n === total) return true;
    if (Math.abs(n - page) <= 1) return true;
    return false;
  });

  const withEllipsis = [];
  let prev = null;
  for (const n of visible) {
    if (prev !== null && n - prev > 1) withEllipsis.push("…");
    withEllipsis.push(n);
    prev = n;
  }

  return (
    <div className="pc-pagination">
      {/* prev */}
      <button
        className="pc-pg-btn pc-pg-arrow"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page">
        <FaChevronLeft />
      </button>

      {/* page numbers */}
      <div className="pc-pg-numbers">
        {withEllipsis.map((item, i) =>
          item === "…" ? (
            <span key={`e-${i}`} className="pc-pg-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              className={`pc-pg-btn ${page === item ? "pc-pg-active" : ""}`}
              onClick={() => onChange(item)}
              aria-label={`Page ${item}`}
              aria-current={page === item ? "page" : undefined}>
              {item}
            </button>
          ),
        )}
      </div>

      {/* next */}
      <button
        className="pc-pg-btn pc-pg-arrow"
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        aria-label="Next page">
        <FaChevronRight />
      </button>

      <span className="pc-pg-info">
        Page {page} of {total}
      </span>
    </div>
  );
};

export default ProviderCard;
