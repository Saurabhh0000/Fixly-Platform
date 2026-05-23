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
    stripCls: "apr-s-pending-strip",
  },
  VERIFYING: {
    cls: "apr-s-verifying",
    label: "Verifying",
    stripCls: "apr-s-verifying-strip",
  },
  APPROVED: {
    cls: "apr-s-approved",
    label: "Approved",
    stripCls: "apr-s-approved-strip",
  },
  REJECTED: {
    cls: "apr-s-rejected",
    label: "Rejected",
    stripCls: "apr-s-rejected-strip",
  },
  SUSPENDED: {
    cls: "apr-s-suspended",
    label: "Suspended",
    stripCls: "apr-s-suspended-strip",
  },
};

const getStatus = (s) =>
  STATUS_CONFIG[s] || {
    cls: "apr-s-pending",
    label: s,
    stripCls: "apr-s-pending-strip",
  };

const AdminProviderRequests = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("ALL");

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

  const updateStatus = async (providerId, action, successMessage) => {
    try {
      await fixlyApi.put(`/api/admin/providers/${providerId}/${action}`);
      toast.success(successMessage, { duration: 3500 });
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

  /* ===== LOADER ===== */
  if (loading) {
    return (
      <div className="apr-page-loader">
        <div className="apr-loader-inner">
          <div className="apr-loader-ring" />
          <div className="apr-loader-logo">F</div>
        </div>
        <p className="apr-loader-text">Loading provider requests…</p>
      </div>
    );
  }

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
                Review applications, verify documents, and manage provider
                accounts.
              </p>
            </div>
          </div>
          <div className="apr-total-badge">
            <FaUsers />
            {providers.length} Provider{providers.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ===== SEARCH + FILTER BAR ===== */}
        <div className="apr-toolbar">
          {/* SEARCH */}
          <div className="apr-search-wrap">
            <FaSearch className="apr-search-icon" />
            <input
              className="apr-search-input"
              type="text"
              placeholder="Search by name, email, phone, category, PAN…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="apr-search-clear"
                onClick={() => setSearch("")}>
                <FaTimes />
              </button>
            )}
          </div>

          {/* FILTER CHIPS */}
          <div className="apr-filter-row">
            <FaFilter className="apr-filter-icon" />
            <div className="apr-filter-chips">
              {STATUS_FILTERS.map((f) => {
                const count =
                  f === "ALL"
                    ? providers.length
                    : providers.filter((p) => p.status === f).length;
                return (
                  <button
                    key={f}
                    className={`apr-chip ${activeFilter === f ? "apr-chip-active" : ""} ${
                      f !== "ALL" ? `apr-chip-${f.toLowerCase()}` : ""
                    }`}
                    onClick={() => setFilter(f)}>
                    {f === "ALL" ? "All" : STATUS_CONFIG[f].label}
                    <span className="apr-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== RESULTS INFO ===== */}
        {search && (
          <p className="apr-results-info">
            {filtered.length === 0
              ? `No results for "${search}"`
              : `${filtered.length} result${filtered.length > 1 ? "s" : ""} for "${search}"`}
          </p>
        )}

        {/* ===== EMPTY STATE ===== */}
        {filtered.length === 0 && (
          <div className="apr-empty">
            <div className="apr-empty-icon-wrap">
              <FaUserTie />
            </div>
            <h4>
              {search
                ? "No matching providers found"
                : "No provider requests yet"}
            </h4>
            <p>
              {search
                ? "Try a different search term or clear the filter."
                : "Provider applications will appear here once submitted."}
            </p>
            {search && (
              <button
                className="apr-empty-clear-btn"
                onClick={() => {
                  setSearch("");
                  setFilter("ALL");
                }}>
                Clear Search & Filters
              </button>
            )}
          </div>
        )}

        {/* ===== GRID ===== */}
        <div className="apr-grid">
          {filtered.map((provider) => {
            const status = getStatus(provider.status);
            return (
              <div key={provider.providerId} className="apr-card">
                {/* TOP COLOUR BAR */}
                <div className={`apr-card-bar ${status.stripCls}`} />

                {/* CARD HEADER */}
                <div className="apr-card-head">
                  <div className="apr-avatar">
                    {provider.fullName?.charAt(0)?.toUpperCase() || (
                      <FaUserTie />
                    )}
                  </div>
                  <div className="apr-identity">
                    <h3 className="apr-name">{provider.fullName}</h3>
                    <div className="apr-badge-row">
                      <span className={`apr-status-badge ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="apr-category-pill">
                        <FaBriefcase className="apr-cat-icon" />
                        {provider.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTACT STRIP */}
                <div className="apr-contact-strip">
                  <div className="apr-contact-item">
                    <FaEnvelope className="apr-contact-icon apr-ci-blue" />
                    <span>{provider.email}</span>
                  </div>
                  <div className="apr-contact-item">
                    <FaPhone className="apr-contact-icon apr-ci-green" />
                    <span>{provider.phone}</span>
                  </div>
                </div>

                {/* ID SECTION */}
                <div className="apr-id-row">
                  <div className="apr-id-box">
                    <div className="apr-id-label">
                      <FaIdCard className="apr-id-icon apr-ci-violet" /> PAN
                      Card
                    </div>
                    <p className="apr-id-val">{provider.panCardNumber}</p>
                  </div>
                  <div className="apr-id-box">
                    <div className="apr-id-label">
                      <FaShieldAlt className="apr-id-icon apr-ci-amber" />{" "}
                      Aadhaar
                    </div>
                    <p className="apr-id-val">{provider.aadhaarNumber}</p>
                  </div>
                </div>

                {/* METRICS */}
                <div className="apr-metrics">
                  <div className="apr-metric-item">
                    <div className="apr-metric-icon-wrap apr-met-yellow">
                      <FaStar />
                    </div>
                    <div>
                      <p className="apr-metric-label">Experience</p>
                      <p className="apr-metric-val">
                        {provider.experienceYears === 0
                          ? "Fresher"
                          : `${provider.experienceYears} Yr${provider.experienceYears > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="apr-metric-divider" />
                  <div className="apr-metric-item">
                    <div className="apr-metric-icon-wrap apr-met-green">
                      <FaRupeeSign />
                    </div>
                    <div>
                      <p className="apr-metric-label">Per Visit</p>
                      <p className="apr-metric-val">
                        ₹{provider.pricePerVisit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DOCUMENTS */}
                <div className="apr-docs">
                  <a
                    className="apr-doc-link"
                    href={`https://fixly-backend-4guo.onrender.com/uploads/${provider.aadhaarFrontImage}`}
                    target="_blank"
                    rel="noreferrer">
                    <FaFileImage />
                    Aadhaar Front
                  </a>
                  <a
                    className="apr-doc-link"
                    href={`https://fixly-backend-4guo.onrender.com/uploads/${provider.aadhaarBackImage}`}
                    target="_blank"
                    rel="noreferrer">
                    <FaFileImage />
                    Aadhaar Back
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
                    <FaSearch /> <span>Verify</span>
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
                    <FaCheckCircle /> <span>Approve</span>
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
                    <FaTimesCircle /> <span>Reject</span>
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
                    <FaBan /> <span>Suspend</span>
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
                    <FaUndo /> <span>Restore</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProviderRequests;
