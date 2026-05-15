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
} from "react-icons/fa";

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

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    loadCategories();

    loadProviderStatus();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fixlyApi.get("/api/categories");

      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* ================= LOAD STATUS ================= */

  const loadProviderStatus = async () => {
    try {
      const res = await fixlyApi.get(`/api/providers/status/${user.id}`);

      setProviderStatus(res.data);
    } catch {
      // no provider yet
    }
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (loading) return;

    if (!form.categoryId) {
      toast.error("Please select category");
      return;
    }

    if (!form.panCardNumber) {
      toast.error("PAN card number required");
      return;
    }

    if (!form.aadhaarNumber) {
      toast.error("Aadhaar number required");
      return;
    }

    if (!form.aadhaarFrontImage) {
      toast.error("Upload Aadhaar front image");
      return;
    }

    if (!form.aadhaarBackImage) {
      toast.error("Upload Aadhaar back image");
      return;
    }
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (form.aadhaarFrontImage.size > maxSize) {
      toast.error("Front image must be less than 1MB");

      return;
    }

    if (form.aadhaarBackImage.size > maxSize) {
      toast.error("Back image must be less than 1MB");

      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(form.aadhaarFrontImage.type)) {
      toast.error("Only JPG, JPEG, PNG files are allowed for Aadhaar Front");

      return;
    }

    if (!allowedTypes.includes(form.aadhaarBackImage.type)) {
      toast.error("Only JPG, JPEG, PNG files are allowed for Aadhaar Back");

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully");

      loadProviderStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CATEGORY ================= */

  const selectedCategory = categories.find(
    (c) => c.id === Number(form.categoryId),
  );

  /* ================= STATUS UI ================= */

  const renderTimeline = () => {
    if (!providerStatus) return null;

    const status = providerStatus.status;

    return (
      <div className="provider-timeline">
        <div className="timeline-step active">
          <div className="timeline-icon">
            <FaCheckCircle />
          </div>

          <div>
            <h4>Application Submitted</h4>
            <p>Your application was submitted successfully.</p>
          </div>
        </div>

        <div
          className={`timeline-step ${
            status === "VERIFYING" || status === "APPROVED" ? "active" : ""
          }`}>
          <div className="timeline-icon">
            <FaSearch />
          </div>

          <div>
            <h4>Verification In Progress</h4>
            <p>Admin is reviewing your documents.</p>
          </div>
        </div>

        <div
          className={`timeline-step ${status === "APPROVED" ? "active" : ""}`}>
          <div className="timeline-icon">
            <FaUserCheck />
          </div>

          <div>
            <h4>Provider Approved</h4>
            <p>You can now login as provider.</p>
          </div>
        </div>

        <div className="timeline-status">
          {status === "PENDING" && "Your application is waiting for review."}

          {status === "VERIFYING" &&
            "Your documents are currently under verification."}

          {status === "APPROVED" &&
            "Congratulations! Your provider account is approved."}

          {status === "REJECTED" && "Your provider application was rejected."}

          {status === "SUSPENDED" && "Your provider account is suspended."}
        </div>
      </div>
    );
  };

  /* ================= APPROVED SCREEN ================= */

  if (providerStatus?.status === "APPROVED") {
    return (
      <div className="become-provider-page">
        <div className="become-provider-card">
          <h2 className="approved-title">
            <FaUserCheck />
            Provider Approved
          </h2>

          <p>Your provider account is approved.</p>

          <p>Please logout and login again to continue as Provider.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="become-provider-page">
      <div className="become-provider-card">
        <div className="become-provider-header">
          <h2>Become a Service Provider</h2>

          <p>Start offering services and earn with Fixly</p>
        </div>

        {/* ================= TIMELINE ================= */}

        {renderTimeline()}

        {/* ================= FORM ================= */}

        {(!providerStatus ||
          (providerStatus?.status === "REJECTED" && showReapplyForm)) && (

<div className="rejected-box">

  <h3>Application Rejected</h3>

  <p>
    Your provider request was rejected.
    Please update your details and
    submit again.
  </p>

  <button
    className="reapply-btn"
    onClick={() =>
      setShowReapplyForm(true)
    }
  >
    Reapply
  </button>

</div>
          )}

          <div className="become-provider-form">
            {/* CATEGORY */}

            <div className="input-group">
              <label>
                <FaBriefcase /> Service Category
              </label>

              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                  })
                }>
                <option value="">Select Category</option>

                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <div className="category-description">
                  💡 {selectedCategory.description}
                </div>
              )}
            </div>

            {/* EXPERIENCE */}

            <div className="input-group">
              <label>
                <FaBriefcase /> Experience (Years)
              </label>

              <input
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) =>
                  setForm({
                    ...form,
                    experienceYears: e.target.value,
                  })
                }
              />
            </div>

            {/* PRICE */}

            <div className="input-group price-input">
              <label>
                <FaRupeeSign /> Price Per Visit
              </label>

              <span>₹</span>

              <input
                type="number"
                min="1"
                value={form.pricePerVisit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricePerVisit: e.target.value,
                  })
                }
              />
            </div>

            {/* PAN */}

            <div className="input-group">
              <label>
                <FaIdCard /> PAN Card Number
              </label>

              <input
                type="text"
                placeholder="ABCDE1234F"
                value={form.panCardNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    panCardNumber: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            {/* AADHAAR */}

            <div className="input-group">
              <label>
                <FaShieldAlt /> Aadhaar Number
              </label>

              <input
                type="text"
                placeholder="123412341234"
                value={form.aadhaarNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    aadhaarNumber: e.target.value,
                  })
                }
              />
            </div>

            {/* FRONT IMAGE */}

            <div className="input-group">
              <label>
                <FaFileUpload /> Aadhaar Front Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    aadhaarFrontImage: e.target.files[0],
                  })
                }
              />
            </div>

            {/* BACK IMAGE */}

            <div className="input-group">
              <label>
                <FaFileUpload /> Aadhaar Back Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    aadhaarBackImage: e.target.files[0],
                  })
                }
              />
            </div>

            {/* BUTTON */}

            <button className="submit-btn" disabled={loading} onClick={submit}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        )}

        {/* INFO */}

        <div className="info-box">
          💡 Your documents will be verified by admin before approval.
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;
