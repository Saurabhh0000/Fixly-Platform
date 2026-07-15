import { useEffect, useState, useContext } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaLocationArrow,
  FaHashtag,
  FaCheckCircle,
  FaPlus,
  FaIdBadge,
  FaHome,
  FaMapPin,
  FaShieldAlt,
  FaTimes,
  FaMapMarkedAlt,
  FaCompass,
} from "react-icons/fa";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/profile-settings.css";

const EMPTY_ADDRESS = { city: "", area: "", pincode: "" };

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);

  const isEditableRole = user?.role === "USER" || user?.role === "PROVIDER";

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD ADDRESSES ================= */
  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await fixlyApi.get(`/api/addresses/${user.id}`);
      setAddresses(res.data || []);
    } catch {
      toast.error("Unable to load your addresses. Please refresh the page.", {
        duration: 4000,
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // First saved address is treated as the permanent address.
  // Everything after it is an alternative address the user has added.
  const permanent = addresses[0];
  const alternatives = addresses.slice(1);

  /* ================= ADD NEW ALTERNATIVE ADDRESS ================= */
  const openAddForm = () => {
    setNewAddress(EMPTY_ADDRESS);
    setShowAddForm(true);
  };

  const cancelAddForm = () => {
    setShowAddForm(false);
    setNewAddress(EMPTY_ADDRESS);
  };

  const saveNewAddress = async () => {
    if (!newAddress.city || !newAddress.area || !newAddress.pincode) {
      toast.error(
        "Please fill in all address fields — city, area, and pincode.",
        { duration: 3500 },
      );
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pincode)) {
      toast.error("Pincode must be a valid 6-digit number.", {
        duration: 3500,
      });
      return;
    }

    try {
      setSaving(true);
      await fixlyApi.post(`/api/addresses/${user.id}`, newAddress);
      toast.success("Alternative address added successfully!", {
        duration: 3500,
      });
      setShowAddForm(false);
      setNewAddress(EMPTY_ADDRESS);
      loadAddresses();
    } catch {
      toast.error("Failed to save address. Please try again.", {
        duration: 3500,
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= ROLE LABEL ================= */
  const roleLabel =
    user?.role === "PROVIDER"
      ? "Service Provider"
      : user?.role === "ADMIN"
        ? "Administrator"
        : "User";

  return (
    <div className="pst-wrapper">
      <div className="pst-container">
        {/* ===== PAGE HEADER ===== */}
        <div className="pst-page-header">
          <div className="pst-page-title-icon">
            <FaUser />
          </div>
          <div>
            <h2 className="pst-page-title">Profile Settings</h2>
            <p className="pst-page-sub">
              View and manage your personal information
            </p>
          </div>
        </div>

        {/* ===== HERO CARD ===== */}
        <div className="pst-hero-card">
          <div className="pst-hero-left">
            <div className="pst-avatar">
              <span className="pst-avatar-letter">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="pst-hero-info">
              <h3 className="pst-hero-name">{user?.fullName}</h3>
              <div className="pst-role-badge">
                <FaShieldAlt />
                {roleLabel}
              </div>
            </div>
          </div>
          <div className="pst-verified-tag">
            <FaCheckCircle />
            Verified Account
          </div>
        </div>

        {/* ===== PERSONAL INFO CARD ===== */}
        <div className="pst-card">
          <div className="pst-card-header">
            <div className="pst-card-header-icon blue">
              <FaIdBadge />
            </div>
            <div>
              <h3 className="pst-card-title">Personal Information</h3>
              <p className="pst-card-subtitle">Your basic account details</p>
            </div>
          </div>

          <div className="pst-form-grid pst-grid-2">
            <div className="pst-field">
              <label className="pst-label">
                <FaUser className="pst-label-icon" />
                Full Name
              </label>
              <div className="pst-readonly-box">
                <FaUser className="pst-box-icon" />
                <span>{user?.fullName || "—"}</span>
              </div>
            </div>

            <div className="pst-field">
              <label className="pst-label">
                <FaPhone className="pst-label-icon" />
                Phone Number
              </label>
              <div className="pst-readonly-box">
                <FaPhone className="pst-box-icon" />
                <span>{user?.phone || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PERMANENT ADDRESS CARD ===== */}
        {permanent && (
          <div className="pst-card">
            <div className="pst-card-header">
              <div className="pst-card-header-icon green">
                <FaHome />
              </div>
              <div>
                <h3 className="pst-card-title">Permanent Address</h3>
                <p className="pst-card-subtitle">Your primary saved address</p>
              </div>
              <span className="pst-primary-tag">Primary</span>
            </div>

            <div className="pst-form-grid pst-grid-3">
              <div className="pst-field">
                <label className="pst-label">
                  <FaCity className="pst-label-icon" />
                  City
                </label>
                <div className="pst-readonly-box">
                  <FaCity className="pst-box-icon" />
                  <span>{permanent.city || "—"}</span>
                </div>
              </div>

              <div className="pst-field">
                <label className="pst-label">
                  <FaMapMarkerAlt className="pst-label-icon" />
                  Area
                </label>
                <div className="pst-readonly-box">
                  <FaMapMarkerAlt className="pst-box-icon" />
                  <span>{permanent.area || "—"}</span>
                </div>
              </div>

              <div className="pst-field">
                <label className="pst-label">
                  <FaHashtag className="pst-label-icon" />
                  Pincode
                </label>
                <div className="pst-readonly-box">
                  <FaHashtag className="pst-box-icon" />
                  <span>{permanent.pincode || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ALTERNATIVE ADDRESSES CARD ===== */}
        {isEditableRole && (
          <div className="pst-card pst-card-editable">
            <div className="pst-card-header">
              <div className="pst-card-header-icon violet">
                <FaMapPin />
              </div>
              <div>
                <h3 className="pst-card-title">Alternative Addresses</h3>
                <p className="pst-card-subtitle">
                  Extra addresses you can choose from when booking a service
                </p>
              </div>

              {!showAddForm && (
                <button className="pst-add-btn" onClick={openAddForm}>
                  <FaPlus />
                  Add New Address
                </button>
              )}
            </div>

            {/* ---- SAVED ALTERNATIVE ADDRESSES LIST ---- */}
            {loadingAddresses ? (
              <div className="pst-addr-skeleton">
                <div className="pst-skeleton-line" />
                <div className="pst-skeleton-line" />
              </div>
            ) : alternatives.length > 0 ? (
              <div className="pst-addr-list">
                {alternatives.map((addr, idx) => (
                  <div className="pst-addr-card" key={addr.id ?? idx}>
                    <div className="pst-addr-card-icon">
                      <FaMapMarkedAlt />
                    </div>
                    <div className="pst-addr-card-body">
                      <span className="pst-addr-card-label">
                        Alternative Address {idx + 1}
                      </span>
                      <span className="pst-addr-card-text">
                        {addr.area}, {addr.city} — {addr.pincode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showAddForm && (
                <div className="pst-addr-empty">
                  <FaCompass className="pst-addr-empty-icon" />
                  <p>You haven't added any alternative addresses yet.</p>
                </div>
              )
            )}

            {/* ---- ADD NEW ADDRESS FORM ---- */}
            {showAddForm && (
              <div className="pst-addr-form">
                <div className="pst-form-grid pst-grid-3">
                  <div className="pst-field">
                    <label className="pst-label">
                      <FaCity className="pst-label-icon" />
                      City <span className="pst-required">*</span>
                    </label>
                    <div className="pst-input-wrap">
                      <FaCity className="pst-box-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="pst-field">
                    <label className="pst-label">
                      <FaLocationArrow className="pst-label-icon" />
                      Area <span className="pst-required">*</span>
                    </label>
                    <div className="pst-input-wrap">
                      <FaLocationArrow className="pst-box-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Andheri West"
                        value={newAddress.area}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            area: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="pst-field">
                    <label className="pst-label">
                      <FaHashtag className="pst-label-icon" />
                      Pincode <span className="pst-required">*</span>
                    </label>
                    <div className="pst-input-wrap">
                      <FaHashtag className="pst-box-icon" />
                      <input
                        type="text"
                        placeholder="e.g. 400053"
                        maxLength={6}
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            pincode: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pst-form-actions">
                  <button
                    className="pst-cancel-btn"
                    onClick={cancelAddForm}
                    disabled={saving}>
                    <FaTimes />
                    Cancel
                  </button>
                  <button
                    className="pst-save-btn"
                    onClick={saveNewAddress}
                    disabled={saving}>
                    <FaPlus className="pst-save-icon" />
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
