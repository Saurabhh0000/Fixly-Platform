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
} from "react-icons/fa";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/profile-settings.css";

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);

  const isEditableRole = user?.role === "USER" || user?.role === "PROVIDER";

  const [addresses, setAddresses] = useState([]);
  const [altAddress, setAltAddress] = useState({
    city: "",
    area: "",
    pincode: "",
  });

  /* ================= LOAD ADDRESSES ================= */
  const loadAddresses = async () => {
    try {
      const res = await fixlyApi.get(`/api/addresses/${user.id}`);
      setAddresses(res.data || []);

      if (res.data?.length > 1) {
        setAltAddress(res.data[1]);
      }
    } catch {
      toast.error("Unable to load your addresses. Please refresh the page.", {
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    if (user?.id) loadAddresses();
  }, [user]);

  /* ================= SAVE ALTERNATIVE ADDRESS ================= */
  const saveAltAddress = async () => {
    if (!altAddress.city || !altAddress.area || !altAddress.pincode) {
      toast.error(
        "Please fill in all address fields — city, area, and pincode.",
        {
          duration: 3500,
        },
      );
      return;
    }

    try {
      await fixlyApi.post(`/api/addresses/${user.id}`, altAddress);
      toast.success("Alternative address saved successfully!", {
        duration: 3500,
      });
      loadAddresses();
    } catch {
      toast.error("Failed to save address. Please try again.", {
        duration: 3500,
      });
    }
  };

  const permanent = addresses[0];

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
            <h3 className="pst-card-title">Personal Information</h3>
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
              <h3 className="pst-card-title">Permanent Address</h3>
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

        {/* ===== ALTERNATIVE ADDRESS CARD ===== */}
        {isEditableRole && (
          <div className="pst-card pst-card-editable">
            <div className="pst-card-header">
              <div className="pst-card-header-icon violet">
                <FaMapPin />
              </div>
              <div>
                <h3 className="pst-card-title">Alternative Address</h3>
                <p className="pst-card-subtitle">
                  Add a second address for service bookings
                </p>
              </div>
            </div>

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
                    value={altAddress.city}
                    onChange={(e) =>
                      setAltAddress({ ...altAddress, city: e.target.value })
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
                    value={altAddress.area}
                    onChange={(e) =>
                      setAltAddress({ ...altAddress, area: e.target.value })
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
                    value={altAddress.pincode}
                    onChange={(e) =>
                      setAltAddress({ ...altAddress, pincode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pst-save-row">
              <button className="pst-save-btn" onClick={saveAltAddress}>
                <FaPlus className="pst-save-icon" />
                Save Alternative Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
