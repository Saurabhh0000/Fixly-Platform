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
} from "react-icons/fa";
import AdminLayout from "../layouts/AdminLayout";
import "../styles/admin-provider-requests.css";

const AdminProviderRequests = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  /* ================= ACTION ================= */
  const updateStatus = async (providerId, action, successMessage) => {
    try {
      await fixlyApi.put(`/api/admin/providers/${providerId}/${action}`);
      toast.success(successMessage, { duration: 3500 });
      loadProviders();
    } catch {
      toast.error("Action failed. Please try again.", { duration: 3500 });
    }
  };

  /* ================= STATUS CONFIG ================= */
  const statusConfig = {
    PENDING: { cls: "apr-s-pending", label: "Pending" },
    VERIFYING: { cls: "apr-s-verifying", label: "Verifying" },
    APPROVED: { cls: "apr-s-approved", label: "Approved" },
    REJECTED: { cls: "apr-s-rejected", label: "Rejected" },
    SUSPENDED: { cls: "apr-s-suspended", label: "Suspended" },
  };
  const getStatus = (s) =>
    statusConfig[s] || { cls: "apr-s-pending", label: s };

  /* ================= LOADER ================= */
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

        {/* ===== STATS STRIP ===== */}
        <div className="apr-stats-strip">
          {["PENDING", "VERIFYING", "APPROVED", "REJECTED", "SUSPENDED"].map(
            (s) => {
              const count = providers.filter((p) => p.status === s).length;
              const cfg = getStatus(s);
              return (
                <div key={s} className={`apr-stat-pill ${cfg.cls}-pill`}>
                  <span className="apr-stat-count">{count}</span>
                  <span className="apr-stat-label">{cfg.label}</span>
                </div>
              );
            },
          )}
        </div>

        {/* ===== EMPTY ===== */}
        {providers.length === 0 && (
          <div className="apr-empty">
            <FaUserTie className="apr-empty-icon" />
            <h4>No provider requests found</h4>
            <p>Provider applications will appear here once submitted.</p>
          </div>
        )}

        {/* ===== GRID ===== */}
        <div className="apr-grid">
          {providers.map((provider) => {
            const status = getStatus(provider.status);
            return (
              <div key={provider.providerId} className="apr-card">
                {/* ACCENT STRIP */}
                <div className={`apr-card-strip ${status.cls}-strip`} />

                {/* CARD HEADER */}
                <div className="apr-card-header">
                  <div className="apr-avatar">
                    <FaUserTie />
                  </div>
                  <div className="apr-identity">
                    <h3 className="apr-name">{provider.fullName}</h3>
                    <div className="apr-header-row">
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

                {/* CONTACT INFO */}
                <div className="apr-info-grid">
                  <div className="apr-info-item">
                    <div className="apr-info-icon apr-blue">
                      <FaEnvelope />
                    </div>
                    <div className="apr-info-text">
                      <span className="apr-info-label">Email</span>
                      <span className="apr-info-value">{provider.email}</span>
                    </div>
                  </div>

                  <div className="apr-info-item">
                    <div className="apr-info-icon apr-green">
                      <FaPhone />
                    </div>
                    <div className="apr-info-text">
                      <span className="apr-info-label">Phone</span>
                      <span className="apr-info-value">{provider.phone}</span>
                    </div>
                  </div>

                  <div className="apr-info-item">
                    <div className="apr-info-icon apr-violet">
                      <FaIdCard />
                    </div>
                    <div className="apr-info-text">
                      <span className="apr-info-label">PAN Card</span>
                      <span className="apr-info-value apr-mono">
                        {provider.panCardNumber}
                      </span>
                    </div>
                  </div>

                  <div className="apr-info-item">
                    <div className="apr-info-icon apr-amber">
                      <FaShieldAlt />
                    </div>
                    <div className="apr-info-text">
                      <span className="apr-info-label">Aadhaar</span>
                      <span className="apr-info-value apr-mono">
                        {provider.aadhaarNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* STATS ROW */}
                <div className="apr-stats-row">
                  <div className="apr-stat-box">
                    <FaStar className="apr-stat-icon apr-star" />
                    <div>
                      <p className="apr-stat-box-label">Experience</p>
                      <p className="apr-stat-box-val">
                        {provider.experienceYears === 0
                          ? "Fresher"
                          : `${provider.experienceYears} Yr${provider.experienceYears > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="apr-stat-box">
                    <FaRupeeSign className="apr-stat-icon apr-rupee" />
                    <div>
                      <p className="apr-stat-box-label">Per Visit</p>
                      <p className="apr-stat-box-val">
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
                    <FaFileImage className="apr-doc-icon" />
                    Aadhaar Front
                  </a>
                  <a
                    className="apr-doc-link"
                    href={`https://fixly-backend-4guo.onrender.com/uploads/${provider.aadhaarBackImage}`}
                    target="_blank"
                    rel="noreferrer">
                    <FaFileImage className="apr-doc-icon" />
                    Aadhaar Back
                  </a>
                </div>

                {/* DIVIDER */}
                <div className="apr-divider" />

                {/* ACTION BUTTONS */}
                <div className="apr-actions">
                  <button
                    className="apr-btn apr-btn-verify"
                    title="Mark as Verifying"
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
                    title="Approve Provider"
                    onClick={() =>
                      updateStatus(
                        provider.providerId,
                        "approve",
                        "Provider has been approved successfully.",
                      )
                    }>
                    <FaCheckCircle />
                    <span>Approve</span>
                  </button>

                  <button
                    className="apr-btn apr-btn-reject"
                    title="Reject Provider"
                    onClick={() =>
                      updateStatus(
                        provider.providerId,
                        "reject",
                        "Provider application has been rejected.",
                      )
                    }>
                    <FaTimesCircle />
                    <span>Reject</span>
                  </button>

                  <button
                    className="apr-btn apr-btn-suspend"
                    title="Suspend Provider"
                    onClick={() =>
                      updateStatus(
                        provider.providerId,
                        "suspend",
                        "Provider account has been suspended.",
                      )
                    }>
                    <FaBan />
                    <span>Suspend</span>
                  </button>

                  <button
                    className="apr-btn apr-btn-unsuspend"
                    title="Remove Suspension"
                    onClick={() =>
                      updateStatus(
                        provider.providerId,
                        "unsuspend",
                        "Provider suspension has been removed.",
                      )
                    }>
                    <FaUndo />
                    <span>Restore</span>
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
