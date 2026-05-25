import { useEffect, useState, useContext } from "react";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/become-provider.css";

import {
  FaCheckCircle,
  FaSearch,
  FaUserCheck,
  FaIdCard,
  FaFileUpload,
  FaRupeeSign,
  FaBriefcase,
  FaShieldAlt,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaBolt,
  FaStar,
  FaArrowRight,
  FaLeaf,
  FaHandshake,
} from "react-icons/fa";

/* ─── toast helpers ─── */
const successToast = (msg) =>
  toast.success(msg, {
    duration: 5000,
    icon: "✅",
    style: {
      background: "#f0fdf4",
      color: "#15803d",
      border: "1px solid #86efac",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
    },
  });

const errorToast = (msg) =>
  toast.error(msg, {
    duration: 3500,
    style: {
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
    },
  });

const infoToast = (msg, icon = "📋") =>
  toast(msg, {
    icon,
    duration: 4000,
    style: {
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fcd34d",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
    },
  });

const BecomeProvider = () => {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReapplyForm, setShowReapplyForm] = useState(false);
  const [providerStatus, setProviderStatus] = useState(null);

  const [form, setForm] = useState({
    categoryId: "",
    experienceYears: "",
    pricePerVisit: "",
    panCardNumber: "",
    aadhaarNumber: "",
    aadhaarFrontImage: null,
    aadhaarBackImage: null,
  });

  const [fileNames, setFileNames] = useState({ front: "", back: "" });

  useEffect(() => {
    loadCategories();
    loadProviderStatus();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fixlyApi.get("/api/categories");
      setCategories(res.data);
    } catch {
      errorToast("Failed to load categories. Please refresh the page.");
    }
  };

  const loadProviderStatus = async () => {
    try {
      const res = await fixlyApi.get(`/api/providers/status/${user.id}`);
      setProviderStatus(res.data);
    } catch {
      // no provider yet — expected
    }
  };

  const submit = async () => {
    if (loading) return;
    if (!form.categoryId) {
      errorToast("Please select a service category.");
      return;
    }
    if (!form.panCardNumber) {
      errorToast("PAN card number is required.");
      return;
    }
    if (!form.aadhaarNumber) {
      errorToast("Aadhaar number is required.");
      return;
    }
    if (!form.aadhaarFrontImage) {
      errorToast("Please upload the front side of your Aadhaar card.");
      return;
    }
    if (!form.aadhaarBackImage) {
      errorToast("Please upload the back side of your Aadhaar card.");
      return;
    }

    const maxSize = 1 * 1024 * 1024;
    if (form.aadhaarFrontImage.size > maxSize) {
      errorToast("Aadhaar front image must be less than 1MB.");
      return;
    }
    if (form.aadhaarBackImage.size > maxSize) {
      errorToast("Aadhaar back image must be less than 1MB.");
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(form.aadhaarFrontImage.type)) {
      errorToast("Aadhaar front image must be JPG or PNG.");
      return;
    }
    if (!allowed.includes(form.aadhaarBackImage.type)) {
      errorToast("Aadhaar back image must be JPG or PNG.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("categoryId", form.categoryId);
      formData.append("experienceYears", form.experienceYears);
      formData.append("pricePerVisit", form.pricePerVisit);
      formData.append("panCardNumber", form.panCardNumber);
      formData.append("aadhaarNumber", form.aadhaarNumber);
      formData.append("aadhaarFrontImage", form.aadhaarFrontImage);
      formData.append("aadhaarBackImage", form.aadhaarBackImage);

      await fixlyApi.post("/api/providers/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      successToast(
        "Application submitted! We'll review your documents shortly.",
      );
      loadProviderStatus();
      setShowReapplyForm(false);
    } catch (err) {
      errorToast(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (c) => c.id === Number(form.categoryId),
  );

  const handleFileChange = (field, displayField, file) => {
    setForm({ ...form, [field]: file });
    setFileNames({ ...fileNames, [displayField]: file ? file.name : "" });
  };

  /* ── Status Badge ── */
  const getStatusBadge = (status) => {
    const map = {
      PENDING: {
        label: "Pending Review",
        cls: "badge-pending",
        icon: <FaClock />,
      },
      VERIFYING: {
        label: "Under Verification",
        cls: "badge-verifying",
        icon: <FaSearch />,
      },
      APPROVED: {
        label: "Approved",
        cls: "badge-approved",
        icon: <FaCheckCircle />,
      },
      REJECTED: {
        label: "Rejected",
        cls: "badge-rejected",
        icon: <FaTimesCircle />,
      },
      SUSPENDED: {
        label: "Suspended",
        cls: "badge-suspended",
        icon: <FaExclamationTriangle />,
      },
    };
    const s = map[status] || {};
    return (
      <span className={`status-badge ${s.cls}`}>
        {s.icon} {s.label}
      </span>
    );
  };

  /* ── Timeline ── */
  const renderTimeline = () => {
    if (!providerStatus?.status) return null;
    const status = providerStatus.status;

    const steps = [
      {
        icon: <FaCheckCircle />,
        title: "Application Submitted",
        desc: "Your application was submitted successfully.",
        active: true,
      },
      {
        icon: <FaSearch />,
        title: "Document Verification",
        desc: "Admin is reviewing your submitted documents.",
        active: status === "VERIFYING" || status === "APPROVED",
      },
      {
        icon: <FaUserCheck />,
        title: "Provider Approved",
        desc: "You can now log in as a provider.",
        active: status === "APPROVED",
      },
    ];

    const statusMessages = {
      PENDING:
        "Your application is waiting for admin review. This usually takes 1–2 business days.",
      VERIFYING:
        "Your documents are currently under verification. Please wait.",
      APPROVED: "🎉 Congratulations! Your provider account has been approved.",
      REJECTED:
        "Your provider application was rejected. Please reapply with correct details.",
      SUSPENDED:
        "Your provider account is suspended. Contact support for assistance.",
    };

    return (
      <div className="provider-timeline">
        <div className="timeline-header">
          <span className="timeline-label">Application Status</span>
          {getStatusBadge(status)}
        </div>
        <div className="timeline-steps">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`timeline-step ${step.active ? "active" : ""}`}>
              <div className="step-indicator">
                <div className="step-icon">{step.icon}</div>
                {i < steps.length - 1 && <div className="step-line" />}
              </div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`timeline-message msg-${status?.toLowerCase()}`}>
          {statusMessages[status]}
        </div>
      </div>
    );
  };

  /* ── Approved screen ── */
  if (providerStatus?.status === "APPROVED") {
    return (
      <div className="bp-page">
        <div className="bp-wrapper">
          <LeftPanel />
          <div className="bp-right">
            <div className="bp-right-inner">
              <div className="approved-icon-wrap">
                <FaUserCheck className="approved-icon" />
              </div>
              <h2 className="approved-title">You're Approved!</h2>
              <p className="approved-subtitle">
                Your provider account is active and ready to use.
              </p>
              <div className="approved-instruction">
                <FaExclamationTriangle />
                Please log out and log back in to access your Provider
                dashboard.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="bp-page">
      <div className="bp-wrapper">
        {/* LEFT PANEL */}
        <LeftPanel />

        {/* RIGHT PANEL */}
        <div className="bp-right">
          <div className="bp-right-inner">
            {/* Right header */}
            <div className="bp-form-header">
              <div className="bp-form-icon">
                <FaLeaf />
              </div>
              <h2>Become a Provider</h2>
              <p>Fill in your details to join the Fixly network</p>
            </div>

            {/* Timeline (when status exists and not re-applying) */}
            {providerStatus?.status &&
              !(providerStatus.status === "REJECTED" && showReapplyForm) && (
                <div className="section-divider">{renderTimeline()}</div>
              )}

            {/* Rejected state */}
            {providerStatus?.status === "REJECTED" && !showReapplyForm && (
              <div className="rejected-box">
                <div className="rejected-icon">
                  <FaTimesCircle />
                </div>
                <h3>Application Rejected</h3>
                <p>
                  Your provider application was rejected. Please review your
                  details and submit a fresh application.
                </p>
                <button
                  className="reapply-btn"
                  onClick={() => {
                    setShowReapplyForm(true);
                    infoToast("Fill in your correct details and reapply.");
                  }}>
                  <span>Reapply Now</span>
                  <FaArrowRight />
                </button>
              </div>
            )}

            {/* Form */}
            {(!providerStatus?.status ||
              (providerStatus?.status === "REJECTED" && showReapplyForm)) && (
              <div className="bp-form">
                {/* Category */}
                <div className="input-group">
                  <label className="field-label">
                    <FaBriefcase />
                    <span>
                      Service Category <span className="required">*</span>
                    </span>
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }>
                    <option value="">— Select a Category —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && (
                    <div className="category-hint">
                      💡 {selectedCategory.description}
                    </div>
                  )}
                </div>

                {/* Experience + Price */}
                <div className="two-col">
                  <div className="input-group">
                    <label className="field-label">
                      <FaBriefcase />
                      <span>Experience (Years)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 3"
                      value={form.experienceYears}
                      onChange={(e) =>
                        setForm({ ...form, experienceYears: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label className="field-label">
                      <FaRupeeSign />
                      <span>
                        Price Per Visit <span className="required">*</span>
                      </span>
                    </label>
                    <div className="price-wrap">
                      <span className="rupee-prefix">₹</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 500"
                        value={form.pricePerVisit}
                        onChange={(e) =>
                          setForm({ ...form, pricePerVisit: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Identity section label */}
                <div className="form-section-label">
                  <FaIdCard />
                  <span>Identity Verification</span>
                </div>

                {/* PAN */}
                <div className="input-group">
                  <label className="field-label">
                    <FaIdCard />
                    <span>
                      PAN Card Number <span className="required">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    value={form.panCardNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        panCardNumber: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                {/* Aadhaar */}
                <div className="input-group">
                  <label className="field-label">
                    <FaShieldAlt />
                    <span>
                      Aadhaar Number <span className="required">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234 5678 9012"
                    maxLength={12}
                    value={form.aadhaarNumber}
                    onChange={(e) =>
                      setForm({ ...form, aadhaarNumber: e.target.value })
                    }
                  />
                </div>

                {/* Upload section label */}
                <div className="form-section-label">
                  <FaFileUpload />
                  <span>Aadhaar Card Images</span>
                </div>

                {/* Aadhaar images */}
                <div className="two-col">
                  <div className="input-group">
                    <label className="field-label">
                      <span>
                        Front Side <span className="required">*</span>
                      </span>
                    </label>
                    <label className="file-upload-box" htmlFor="aadhaar-front">
                      <div className="upload-icon-wrap">
                        <FaFileUpload />
                      </div>
                      <span className="upload-text">
                        {fileNames.front || "Tap to upload"}
                      </span>
                      <span className="upload-hint">JPG, PNG · Max 1MB</span>
                      <input
                        id="aadhaar-front"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            "aadhaarFrontImage",
                            "front",
                            e.target.files[0],
                          )
                        }
                      />
                    </label>
                    {fileNames.front && (
                      <div className="file-selected">
                        <FaCheckCircle /> {fileNames.front}
                      </div>
                    )}
                  </div>
                  <div className="input-group">
                    <label className="field-label">
                      <span>
                        Back Side <span className="required">*</span>
                      </span>
                    </label>
                    <label className="file-upload-box" htmlFor="aadhaar-back">
                      <div className="upload-icon-wrap">
                        <FaFileUpload />
                      </div>
                      <span className="upload-text">
                        {fileNames.back || "Tap to upload"}
                      </span>
                      <span className="upload-hint">JPG, PNG · Max 1MB</span>
                      <input
                        id="aadhaar-back"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            "aadhaarBackImage",
                            "back",
                            e.target.files[0],
                          )
                        }
                      />
                    </label>
                    {fileNames.back && (
                      <div className="file-selected">
                        <FaCheckCircle /> {fileNames.back}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  className="submit-btn"
                  disabled={loading}
                  onClick={submit}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Submitting...
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span> <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Info footer */}
            <div className="info-box">
              <FaShieldAlt />
              <span>
                Your documents are encrypted and reviewed only by verified Fixly
                admins.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   LEFT PANEL — pure presentational
───────────────────────────────────────── */
const LeftPanel = () => (
  <div className="bp-left">
    {/* Logo */}
    <div className="bp-logo">
      <div className="bp-logo-icon">
        <FaBolt />
      </div>
      <span className="bp-logo-text">
        Fix<strong>ly</strong>
      </span>
    </div>

    {/* Headline */}
    <div className="bp-left-headline">
      <h1>Start earning with your skills, today.</h1>
      <p>
        Join thousands of service professionals across India who trust Fixly to
        connect them with customers every day.
      </p>
    </div>

    {/* Feature list */}
    <ul className="bp-features">
      <li>
        <div className="feature-icon">
          <FaCheckCircle />
        </div>
        <div className="feature-text">
          <strong>Verified Provider Badge</strong>
          <span>Stand out with identity-verified status</span>
        </div>
      </li>
      <li>
        <div className="feature-icon">
          <FaRupeeSign />
        </div>
        <div className="feature-text">
          <strong>Daily Earning Opportunities</strong>
          <span>Set your own price and accept bookings</span>
        </div>
      </li>
      <li>
        <div className="feature-icon">
          <FaStar />
        </div>
        <div className="feature-text">
          <strong>Customer Reviews & Ratings</strong>
          <span>Build trust with honest user feedback</span>
        </div>
      </li>
      <li>
        <div className="feature-icon">
          <FaHandshake />
        </div>
        <div className="feature-text">
          <strong>Dedicated Provider Support</strong>
          <span>Our team supports you every step</span>
        </div>
      </li>
    </ul>

    {/* Trust badge */}
    <div className="bp-trust">
      <FaShieldAlt />
      <span>Your data is safe and never shared with third parties.</span>
    </div>
  </div>
);

export default BecomeProvider;
