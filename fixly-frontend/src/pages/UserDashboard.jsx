import React, { useEffect, useState, useContext } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaSmile,
  FaUserTie,
  FaStar,
  FaMapMarkerAlt,
  FaListUl,
  FaTimesCircle,
  FaHourglassHalf,
  FaPhone,
  FaRupeeSign,
  FaBolt,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaFire,
} from "react-icons/fa";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/fixly-dashboard.css";
import UserLayout from "../layouts/UserLayout";

const CARDS_PER_PAGE = 6;

const FILTERS = [
  { key: "ALL", label: "All", icon: <FaListUl /> },
  { key: "PENDING", label: "Pending", icon: <FaHourglassHalf /> },
  { key: "ACCEPTED", label: "Accepted", icon: <FaClock /> },
  { key: "COMPLETED", label: "Completed", icon: <FaCheckCircle /> },
  { key: "CANCELLED", label: "Cancelled", icon: <FaTimesCircle /> },
];

const STATUS_STYLE = {
  PENDING: { cls: "ud-s-pending", label: "Pending" },
  ACCEPTED: { cls: "ud-s-accepted", label: "Accepted" },
  COMPLETED: { cls: "ud-s-completed", label: "Completed" },
  CANCELLED: { cls: "ud-s-cancelled", label: "Cancelled" },
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    const loadBookings = async () => {
      try {
        const res = await fixlyApi.get(`/api/bookings/user/${user.id}`);
        setBookings(res.data || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) return;
        toast.error("Unable to load bookings. Please refresh.", {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [user]);

  /* ===== FILTER + PAGINATION ===== */
  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  const handleFilter = (key) => {
    setFilter(key);
    setPage(1);
  };

  /* ===== STATS ===== */
  const total = bookings.length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const active = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "ACCEPTED",
  ).length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  /* ===== LOADER ===== */
  if (loading) {
    return (
      <div className="ud-loader">
        <div className="ud-loader-inner">
          <div className="ud-loader-ring" />
          <div className="ud-loader-logo">F</div>
        </div>
        <p className="ud-loader-text">Loading Fixly…</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="ud-wrapper">
        {/* ===== HERO WELCOME ===== */}
        <div className="ud-hero">
          <div className="ud-hero-deco ud-deco-1" />
          <div className="ud-hero-deco ud-deco-2" />
          <div className="ud-hero-deco ud-deco-3" />

          <div className="ud-hero-content">
            <div className="ud-hero-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="ud-hero-text">
              <h2 className="ud-hero-title">
                Welcome back,{" "}
                <span className="ud-hero-name">{user?.fullName}</span> 👋
              </h2>
              <p className="ud-hero-sub">
                Here's an overview of all your service bookings
              </p>
            </div>
          </div>
        </div>

        {/* ===== STATS GRID ===== */}
        <div className="ud-stats-grid">
          <div className="ud-stat-card ud-stat-blue">
            <div className="ud-stat-icon">
              <FaClipboardList />
            </div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{total}</span>
              <span className="ud-stat-lbl">Total Bookings</span>
            </div>
          </div>
          <div className="ud-stat-card ud-stat-green">
            <div className="ud-stat-icon">
              <FaCheckCircle />
            </div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{completed}</span>
              <span className="ud-stat-lbl">Completed</span>
            </div>
          </div>
          <div className="ud-stat-card ud-stat-amber">
            <div className="ud-stat-icon">
              <FaFire />
            </div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{active}</span>
              <span className="ud-stat-lbl">Active</span>
            </div>
          </div>
          <div className="ud-stat-card ud-stat-red">
            <div className="ud-stat-icon">
              <FaTimesCircle />
            </div>
            <div className="ud-stat-body">
              <span className="ud-stat-num">{cancelled}</span>
              <span className="ud-stat-lbl">Cancelled</span>
            </div>
          </div>
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="ud-filter-bar">
          <div className="ud-filter-label">
            <FaFilter className="ud-filter-icon" /> Filter
          </div>
          <div className="ud-filter-chips">
            {FILTERS.map((f) => {
              const count =
                f.key === "ALL"
                  ? bookings.length
                  : bookings.filter((b) => b.status === f.key).length;
              return (
                <button
                  key={f.key}
                  className={`ud-chip ud-chip-${f.key.toLowerCase()} ${filter === f.key ? "ud-chip-active" : ""}`}
                  onClick={() => handleFilter(f.key)}>
                  {f.icon}
                  <span className="ud-chip-label">{f.label}</span>
                  <span className="ud-chip-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== EMPTY ===== */}
        {filtered.length === 0 ? (
          <div className="ud-empty">
            <div className="ud-empty-icon">
              <FaCalendarAlt />
            </div>
            <h4>
              {filter === "ALL"
                ? "No bookings yet"
                : `No ${filter.toLowerCase()} bookings`}
            </h4>
            <p>
              {filter === "ALL"
                ? "Your service bookings will appear here once you make one."
                : `You don't have any ${filter.toLowerCase()} bookings right now.`}
            </p>
            {filter !== "ALL" && (
              <button
                className="ud-empty-btn"
                onClick={() => handleFilter("ALL")}>
                View All Bookings
              </button>
            )}
          </div>
        ) : (
          <>
            {/* RESULTS LINE */}
            {filter !== "ALL" && (
              <p className="ud-results-line">
                Showing <strong>{filtered.length}</strong>{" "}
                {filter.toLowerCase()} booking{filtered.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* ===== CARD GRID ===== */}
            <div className="ud-card-grid">
              {paginated.map((b) => {
                const s = STATUS_STYLE[b.status] || {
                  cls: "ud-s-pending",
                  label: b.status,
                };
                const initial = b.providerName?.charAt(0)?.toUpperCase() || "P";
                return (
                  <div key={b.bookingId} className={`ud-card ud-card-${s.cls}`}>
                    {/* GRADIENT BAND HEADER */}
                    <div
                      className={`ud-card-band ud-band-${b.status.toLowerCase()}`}>
                      {/* circle decors */}
                      <div className="ud-band-deco ud-bd-1" />
                      <div className="ud-band-deco ud-bd-2" />

                      {/* avatar + name */}
                      <div className="ud-band-left">
                        <div className="ud-band-avatar">{initial}</div>
                        <div className="ud-band-info">
                          <p className="ud-band-provider-lbl">
                            Service Provider
                          </p>
                          <p className="ud-band-provider-name">
                            {b.providerName || "Assigned Provider"}
                          </p>
                        </div>
                      </div>

                      {/* status + category */}
                      <div className="ud-band-right">
                        <div className={`ud-status-pill ${s.cls}`}>
                          {s.label}
                        </div>
                        <div className="ud-band-category">
                          <FaBolt className="ud-cat-icon" />
                          {b.category}
                        </div>
                      </div>
                    </div>

                    {/* CARD BODY — floats up over band */}
                    <div className="ud-card-body">
                      {/* INFO GRID */}
                      <div className="ud-info-grid">
                        <div className="ud-info-tile">
                          <span className="ud-info-icon ud-ic-blue">
                            <FaCalendarAlt />
                          </span>
                          <div className="ud-info-text">
                            <span className="ud-info-label">Date</span>
                            <span className="ud-info-val">
                              {new Date(b.serviceDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="ud-info-tile">
                          <span className="ud-info-icon ud-ic-red">
                            <FaMapMarkerAlt />
                          </span>
                          <div className="ud-info-text">
                            <span className="ud-info-label">Location</span>
                            <span className="ud-info-val">
                              {b.area}, {b.city} - {b.pincode}
                            </span>
                          </div>
                        </div>

                        {(b.status === "ACCEPTED" ||
                          b.status === "COMPLETED") &&
                          b.providerPhone &&
                          b.providerPhone.trim() !== "" && (
                            <div className="ud-info-tile ud-tile-full">
                              <span className="ud-info-icon ud-ic-green">
                                <FaPhone />
                              </span>
                              <div className="ud-info-text">
                                <span className="ud-info-label">Phone</span>
                                <span className="ud-info-val">
                                  {b.providerPhone}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* BOTTOM ROW: rating + price */}
                      <div className="ud-card-bottom">
                        <div className="ud-rating-wrap">
                          <FaStar className="ud-star-icon" />
                          <span className="ud-rating-val">
                            {b.rating
                              ? `${b.rating.toFixed(1)} / 5`
                              : "Not rated"}
                          </span>
                        </div>
                        <div className="ud-price-pill">
                          <FaRupeeSign className="ud-rupee" />
                          <span>{b.price || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="ud-pagination">
                <button
                  className="ud-page-btn ud-page-arrow"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}>
                  <FaChevronLeft />
                </button>

                <div className="ud-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => {
                      if (
                        totalPages > 7 &&
                        n !== 1 &&
                        n !== totalPages &&
                        Math.abs(n - safePage) > 2
                      ) {
                        if (n === safePage - 3 || n === safePage + 3)
                          return (
                            <span key={n} className="ud-page-ellipsis">
                              …
                            </span>
                          );
                        return null;
                      }
                      return (
                        <button
                          key={n}
                          className={`ud-page-btn ${safePage === n ? "ud-page-active" : ""}`}
                          onClick={() => setPage(n)}>
                          {n}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  className="ud-page-btn ud-page-arrow"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}>
                  <FaChevronRight />
                </button>

                <span className="ud-page-info">
                  {safePage} / {totalPages} · {filtered.length} bookings
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
