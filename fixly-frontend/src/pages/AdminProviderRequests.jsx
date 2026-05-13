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
} from "react-icons/fa";

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
      toast.error("Failed to load provider requests");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTION ================= */

  const updateStatus = async (providerId, action, successMessage) => {
    try {
      await fixlyApi.put(`/api/admin/providers/${providerId}/${action}`);

      toast.success(successMessage);

      loadProviders();
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="logo-loader">
          <div className="logo-stack">
            <div className="spinner-ring"></div>
            <div className="logo-circle">F</div>
          </div>
          <p>Loading Fixly…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-provider-page">
      <div className="admin-provider-header">
        <h2>Provider Verification Requests</h2>

        <p>
          Review provider applications, verify documents and approve providers.
        </p>
      </div>

      <div className="provider-grid">
        {providers.map((provider) => (
          <div key={provider.providerId} className="provider-card">
            {/* TOP */}

            <div className="provider-top">
              <div className="provider-avatar">
                <FaUserTie />
              </div>

              <div>
                <h3>{provider.fullName}</h3>

                <span
                  className={`status-badge ${provider.status.toLowerCase()}`}>
                  {provider.status}
                </span>
              </div>
            </div>

            {/* DETAILS */}

            <div className="provider-details">
              <p>
                <FaEnvelope />

                {provider.email}
              </p>

              <p>
                <FaPhone />

                {provider.phone}
              </p>

              <p>
                <FaIdCard />
                PAN: {provider.panCardNumber}
              </p>

              <p>Aadhaar: {provider.aadhaarNumber}</p>

              <p>Category: {provider.category}</p>

              <p>
                Experience:
                {provider.experienceYears} years
              </p>

              <p>₹ {provider.pricePerVisit}/visit</p>
            </div>

            {/* DOCUMENTS */}

            <div className="document-section">
              <a
                href={`http://localhost:8080/uploads/${provider.aadhaarFrontImage}`}
                target="_blank"
                rel="noreferrer">
                View Aadhaar Front
              </a>

              <a
                href={`http://localhost:8080/uploads/${provider.aadhaarBackImage}`}
                target="_blank"
                rel="noreferrer">
                View Aadhaar Back
              </a>
            </div>

            {/* ACTIONS */}

            <div className="provider-actions">
              <button
                className="verify-btn"
                onClick={() =>
                  updateStatus(
                    provider.providerId,
                    "verify",
                    "Provider under verification",
                  )
                }>
                <FaSearch />
              </button>

              <button
                className="approve-btn"
                onClick={() =>
                  updateStatus(
                    provider.providerId,
                    "approve",
                    "Provider approved",
                  )
                }>
                <FaCheckCircle />
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  updateStatus(
                    provider.providerId,
                    "reject",
                    "Provider rejected",
                  )
                }>
                <FaTimesCircle />
              </button>

              <button
                className="suspend-btn"
                onClick={() =>
                  updateStatus(
                    provider.providerId,
                    "suspend",
                    "Provider suspended",
                  )
                }>
                <FaBan />
              </button>

              <button
                className="unsuspend-btn"
                onClick={() =>
                  updateStatus(
                    provider.providerId,
                    "unsuspend",
                    "Suspension removed",
                  )
                }>
                <FaUndo />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProviderRequests;
