import { useEffect, useState, useContext } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaCamera,
  FaTrash,
  FaPlus,
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
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (user?.id) loadAddresses();
  }, [user]);

  /* ================= SAVE ALTERNATIVE ADDRESS ================= */
  const saveAltAddress = async () => {
    if (!altAddress.city || !altAddress.area || !altAddress.pincode) {
      return toast.error("All fields are required");
    }

    try {
      await fixlyApi.post(`/api/addresses/${user.id}`, altAddress);
      toast.success("Alternative address saved");
      loadAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  const permanent = addresses[0];
  const alternative = addresses[1];

  return (
    <div className="ps-wrapper">
      <div className="ps-card">
        {/* HEADER */}
        <h2 className="ps-title">Personal Information</h2>

        {/* AVATAR */}
        <div className="ps-avatar-section">
          <div className="ps-avatar">
            <FaUser />
          </div>
          <div className="ps-avatar-actions">
            <button className="btn upload">
              <FaCamera /> Upload
            </button>
            <button className="btn remove">
              <FaTrash /> Remove
            </button>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="ps-form">
          <div className="ps-field">
            <label>Full Name</label>
            <input value={user.fullName} readOnly />
          </div>

          <div className="ps-field">
            <label>Phone</label>
            <input value={user.phone} readOnly />
          </div>
        </div>

        {/* PERMANENT ADDRESS */}
        {permanent && (
          <>
            <h3 className="ps-section-title">Permanent Address</h3>

            <div className="ps-form">
              <div className="ps-field">
                <label>City</label>
                <input value={permanent.city} readOnly />
              </div>

              <div className="ps-field">
                <label>Area</label>
                <input value={permanent.area} readOnly />
              </div>

              <div className="ps-field">
                <label>Pincode</label>
                <input value={permanent.pincode} readOnly />
              </div>
            </div>
          </>
        )}

        {/* ALTERNATIVE ADDRESS */}
        {isEditableRole && (
          <>
            <h3 className="ps-section-title">Alternative Address</h3>

            <div className="ps-form">
              <div className="ps-field">
                <label>City</label>
                <input
                  value={altAddress.city}
                  onChange={(e) =>
                    setAltAddress({ ...altAddress, city: e.target.value })
                  }
                />
              </div>

              <div className="ps-field">
                <label>Area</label>
                <input
                  value={altAddress.area}
                  onChange={(e) =>
                    setAltAddress({ ...altAddress, area: e.target.value })
                  }
                />
              </div>

              <div className="ps-field">
                <label>Pincode</label>
                <input
                  value={altAddress.pincode}
                  onChange={(e) =>
                    setAltAddress({ ...altAddress, pincode: e.target.value })
                  }
                />
              </div>
            </div>

            <button className="ps-save-btn" onClick={saveAltAddress}>
              <FaPlus /> Save Alternative Address
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
