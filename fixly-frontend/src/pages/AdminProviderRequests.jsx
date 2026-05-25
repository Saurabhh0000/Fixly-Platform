import { useEffect, useState } from "react";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaBan,
  FaUndo,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaBriefcase,
  FaRupeeSign,
  FaFileImage,
  FaClipboardCheck,
  FaShieldAlt,
  FaStar,
  FaFilter,
  FaTimes,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import AdminLayout from "../layouts/AdminLayout";
import "../styles/admin-provider-requests.css";

const STATUS_FILTERS = [
  "ALL",
  "PENDING",
  "VERIFYING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
];

const STATUS_CONFIG = {
  PENDING: {
    cls: "apr-s-pending",
    label: "Pending",
    strip: "apr-strip-pending",
  },
  VERIFYING: {
    cls: "apr-s-verifying",
    label: "Verifying",
    strip: "apr-strip-verifying",
  },
  APPROVED: {
    cls: "apr-s-approved",
    label: "Approved",
    strip: "apr-strip-approved",
  },
  REJECTED: {
    cls: "apr-s-rejected",
    label: "Rejected",
    strip: "apr-strip-rejected",
  },
  SUSPENDED: {
    cls: "apr-s-suspended",
    label: "Suspended",
    strip: "apr-strip-suspended",
  },
};

const getStatus = (s) =>
  STATUS_CONFIG[s] || {
    cls: "apr-s-pending",
    label: s,
    strip: "apr-strip-pending",
  };

const CARDS_PER_PAGE = 6;

const AdminProviderRequests = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const res = await fixlyApi.get("/api/admin/providers");
      setProviders(res.data);
    } catch {
      toast.error("Unable to load provider requests. Please refresh.", {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (providerId, action, msg) => {
    try {
      await fixlyApi.put(`/api/admin/providers/${providerId}/${action}`);
      toast.success(msg, { duration: 3500 });
      loadProviders();
    } catch {
      toast.error("Action failed. Please try again.", { duration: 3500 });
    }
  };

  /* ===== FILTER + SEARCH ===== */
  const filtered = providers.filter((p) => {
    const matchFilter = activeFilter === "ALL" || p.status === activeFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.fullName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.panCardNumber?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE,
  );

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };
  const handleSearchChange = (v) => {
    setSearch(v);
    setPage(1);
  };

  /* ===== LOADER ===== */
  if (loading)
    return (
      <div className="apr-page-loader">
        <div className="apr-loader-inner">
          <div className="apr-loader-ring" />
          <div className="apr-loader-logo">F</div>
        </div>
        <p className="apr-loader-text">Loading provider requests…</p>
      </div>
    );

  return (
    <AdminLayout>
      <div className="apr-wrapper">
        {/* ===== PAGE HEADER ===== */}
        <div className="apr-page-header">
          <div className="apr-header-left">
            <div className="apr-header-icon">
              <FaClipboardCheck />
            </div>
            <div>
              <h2 className="apr-page-title">Provider Verification</h2>
              <p className="apr-page-sub">
                Review, verify documents and manage provider accounts
              </p>
            </div>
          </div>
          <div className="apr-total-badge">
            <FaUsers />
            {providers.length} Provider{providers.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ===== TOOLBAR ===== */}
        <div className="apr-toolbar">
          {/* ROW 1 — SEARCH */}
          <div className="apr-search-wrap">
            <FaSearch className="apr-search-icon" />
            <input
              className="apr-search-input"
              type="text"
              placeholder="Search by name, email, phone, category or PAN…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {search && (
              <button
                className="apr-search-clear"
                onClick={() => handleSearchChange("")}>
                <FaTimes />
              </button>
            )}
          </div>

          {/* ROW 2 — FILTER CHIPS (glassmorphism) */}
          <div className="apr-filter-glass">
            <FaFilter className="apr-filter-label-icon" />
            <span className="apr-filter-label-text">Filter:</span>
            <div className="apr-chips">
              {STATUS_FILTERS.map((f) => {
                const count =
                  f === "ALL"
                    ? providers.length
                    : providers.filter((p) => p.status === f).length;
                const cfg = f !== "ALL" ? STATUS_CONFIG[f] : null;
                return (
                  <button
                    key={f}
                    className={`apr-chip ${activeFilter === f ? "apr-chip-active" : ""} ${cfg ? `apr-chip-${f.toLowerCase()}` : ""}`}
                    onClick={() => handleFilterChange(f)}>
                    {f === "ALL" ? "All" : cfg.label}
                    <span className="apr-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESULTS LINE */}
        {(search || activeFilter !== "ALL") && (
          <p className="apr-results-line">
            Showing <strong>{filtered.length}</strong> result
            {filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "ALL" && (
              <>
                {" "}
                ·{" "}
                <span
                  className={`apr-inline-status ${getStatus(activeFilter).cls}`}>
                  {getStatus(activeFilter).label}
                </span>
              </>
            )}
            {search && (
              <>
                {" "}
                · "<em>{search}</em>"
              </>
            )}
          </p>
        )}

        {/* ===== EMPTY ===== */}
        {filtered.length === 0 && (
          <div className="apr-empty">
            <div className="apr-empty-icon-wrap">
              <FaUserTie />
            </div>
            <h4>
              {search ? "No matching providers" : "No provider requests yet"}
            </h4>
            <p>
              {search
                ? "Try a different search term or clear the filters."
                : "Provider applications will appear here once submitted."}
            </p>
            {(search || activeFilter !== "ALL") && (
              <button
                className="apr-empty-clear-btn"
                onClick={() => {
                  handleSearchChange("");
                  handleFilterChange("ALL");
                }}>
                Clear Search & Filters
              </button>
            )}
          </div>
        )}

        {/* ===== GRID ===== */}
        <div className="apr-grid">
          {paginated.map((provider) => {
            const status = getStatus(provider.status);
            const initials = provider.fullName?.charAt(0)?.toUpperCase() || "P";
            return (
              <div key={provider.providerId} className="apr-card">
                {/* GRADIENT HEADER BAND */}
                <div className={`apr-card-band ${status.strip}`}>
                  <div className="apr-band-avatar">{initials}</div>
                  <div className="apr-band-meta">
                    <h3 className="apr-band-name">{provider.fullName}</h3>
                    <div className="apr-band-row">
                      <span className={`apr-status-badge ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="apr-band-category">
                        <FaBriefcase className="apr-band-cat-icon" />
                        {provider.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="apr-card-body">
                  {/* CONTACT */}
                  <div className="apr-contact-list">
                    <div className="apr-contact-row">
                      <span className="apr-contact-icon-wrap apr-ci-blue">
                        <FaEnvelope />
                      </span>
                      <span className="apr-contact-val">{provider.email}</span>
                    </div>
                    <div className="apr-contact-row">
                      <span className="apr-contact-icon-wrap apr-ci-green">
                        <FaPhone />
                      </span>
                      <span className="apr-contact-val">{provider.phone}</span>
                    </div>
                  </div>

                  {/* ID CARDS */}
                  <div className="apr-id-grid">
                    <div className="apr-id-tile">
                      <span className="apr-id-tile-label">
                        <FaIdCard className="apr-ci-violet" /> PAN
                      </span>
                      <span className="apr-id-tile-val">
                        {provider.panCardNumber}
                      </span>
                    </div>
                    <div className="apr-id-tile">
                      <span className="apr-id-tile-label">
                        <FaShieldAlt className="apr-ci-amber" /> Aadhaar
                      </span>
                      <span className="apr-id-tile-val">
                        {provider.aadhaarNumber}
                      </span>
                    </div>
                  </div>

                  {/* METRICS STRIP */}
                  <div className="apr-metrics-strip">
                    <div className="apr-metric-cell">
                      <span className="apr-metric-icon-box apr-met-amber">
                        <FaStar />
                      </span>
                      <div>
                        <p className="apr-metric-label">Experience</p>
                        <p className="apr-metric-val">
                          {provider.experienceYears === 0
                            ? "Fresher"
                            : `${provider.experienceYears} Yr${provider.experienceYears > 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                    <div className="apr-metric-sep" />
                    <div className="apr-metric-cell">
                      <span className="apr-metric-icon-box apr-met-green">
                        <FaRupeeSign />
                      </span>
                      <div>
                        <p className="apr-metric-label">Per Visit</p>
                        <p className="apr-metric-val">
                          ₹{provider.pricePerVisit}
                        </p>
                      </div>
                    </div>
                    <div className="apr-metric-sep" />
                    <div className="apr-metric-cell">
                      <span className="apr-metric-icon-box apr-met-blue">
                        <FaMapMarkerAlt />
                      </span>
                      <div>
                        <p className="apr-metric-label">Location</p>
                        <p className="apr-metric-val apr-metric-loc">
                          {provider.city ||
                            provider.area ||
                            provider.pincode ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENTS */}
                  <div className="apr-docs">
                    <a
                      className="apr-doc-btn"
                      href={`https://fixly-backend-4guo.onrender.com/uploads/${provider.aadhaarFrontImage}`}
                      target="_blank"
                      rel="noreferrer">
                      <FaFileImage /> Aadhaar Front
                    </a>
                    <a
                      className="apr-doc-btn"
                      href={`https://fixly-backend-4guo.onrender.com/uploads/${provider.aadhaarBackImage}`}
                      target="_blank"
                      rel="noreferrer">
                      <FaFileImage /> Aadhaar Back
                    </a>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="apr-actions">
                    <button
                      className="apr-btn apr-btn-verify"
                      onClick={() =>
                        updateStatus(
                          provider.providerId,
                          "verify",
                          "Provider marked as under verification.",
                        )
                      }>
                      <FaSearch />
                      <span>Verify</span>
                    </button>
                    <button
                      className="apr-btn apr-btn-approve"
                      onClick={() =>
                        updateStatus(
                          provider.providerId,
                          "approve",
                          "Provider approved successfully.",
                        )
                      }>
                      <FaCheckCircle />
                      <span>Approve</span>
                    </button>
                    <button
                      className="apr-btn apr-btn-reject"
                      onClick={() =>
                        updateStatus(
                          provider.providerId,
                          "reject",
                          "Provider application rejected.",
                        )
                      }>
                      <FaTimesCircle />
                      <span>Reject</span>
                    </button>
                    <button
                      className="apr-btn apr-btn-suspend"
                      onClick={() =>
                        updateStatus(
                          provider.providerId,
                          "suspend",
                          "Provider account suspended.",
                        )
                      }>
                      <FaBan />
                      <span>Suspend</span>
                    </button>
                    <button
                      className="apr-btn apr-btn-restore"
                      onClick={() =>
                        updateStatus(
                          provider.providerId,
                          "unsuspend",
                          "Provider suspension removed.",
                        )
                      }>
                      <FaUndo />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="apr-pagination">
            <button
              className="apr-page-btn apr-page-arrow"
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}>
              <FaChevronLeft />
            </button>

            <div className="apr-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const showDot =
                  totalPages > 7 &&
                  Math.abs(n - safePage) > 2 &&
                  n !== 1 &&
                  n !== totalPages;
                if (showDot) {
                  if (n === safePage - 3 || n === safePage + 3) {
                    return (
                      <span key={n} className="apr-page-ellipsis">
                        …
                      </span>
                    );
                  }
                  if (Math.abs(n - safePage) > 2 && n !== 1 && n !== totalPages)
                    return null;
                }
                return (
                  <button
                    key={n}
                    className={`apr-page-btn ${safePage === n ? "apr-page-active" : ""}`}
                    onClick={() => setPage(n)}>
                    {n}
                  </button>
                );
              })}
            </div>

            <button
              className="apr-page-btn apr-page-arrow"
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}>
              <FaChevronRight />
            </button>

            <span className="apr-page-info">
              {safePage} / {totalPages} &nbsp;·&nbsp; {filtered.length} total
            </span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProviderRequests;
