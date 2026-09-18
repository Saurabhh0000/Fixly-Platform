import { useCallback, useEffect, useMemo, useRef, useState, useContext } from "react";
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
  FaCompass,\n  FaCamera,\n  FaTrash,\n  FaEdit,\n  FaSave,\n  FaEnvelope,\n  FaBriefcase,\n  FaStar,\n  FaClock,\n  FaLocationArrow,
} from "react-icons/fa";
import { getMyProfile, updateMyProfile, uploadProfilePicture, removeProfilePicture, getMyAddresses, addAddress, updateAddress, deleteAddress } from "../api/profileApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/profile-settings.css";

const EMPTY_ADDRESS = { city: "", area: "", pincode: "" };

const ProfileSettings = () => {
  const { user, login } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [pictureBusy, setPictureBusy] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressMode, setAddressMode] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const role = profile?.role || user?.role;
  const isEditableRole = role === "USER" || role === "PROVIDER";

  const syncAuthUser = useCallback((data) => {
    login({ ...(user || {}), id: data.userId, fullName: data.fullName, phone: data.phone, email: data.email, role: data.role, providerId: data.provider?.providerId ?? user?.providerId, profilePicture: data.profilePicture || null });
  }, [login, user]);

  const loadProfile = useCallback(async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data);
      setProfileForm({ fullName: response.data.fullName || "", phone: response.data.phone || "" });
      syncAuthUser(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load your profile.");
    }
  }, [syncAuthUser]);

  const loadAddresses = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingAddresses(true);
      const response = await getMyAddresses(user.id);
      setAddresses(response.data || []);
    } catch {
      toast.error("Unable to load your saved addresses.");
    } finally {
      setLoadingAddresses(false);
    }
  }, [user?.id]);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => { if (user?.id) loadAddresses(); }, [user?.id, loadAddresses]);

  const roleLabel = useMemo(() => role === "PROVIDER" ? "Service Provider" : role === "ADMIN" ? "Administrator" : "User", [role]);
  const initials = (profile?.fullName || user?.fullName || "U").trim().charAt(0).toUpperCase();
  const profileImage = profile?.profilePicture ? (/^https?:\\/\\/i.test(profile.profilePicture) ? profile.profilePicture : (import.meta.env.VITE_API_BASE_URL || "").replace(/\\/$/, "") + (profile.profilePicture.startsWith("/") ? "" : "/") + profile.profilePicture) : "";

  const saveProfile = async () => {
    const fullName = profileForm.fullName.trim();
    const phone = profileForm.phone.trim();
    if (!fullName) return toast.error("Full name is required.");
    if (!/^[6-9]\\d{9}$/.test(phone)) return toast.error("Enter a valid 10-digit Indian mobile number.");
    try {
      setSavingProfile(true);
      const response = await updateMyProfile({ fullName, phone });
      setProfile(response.data);
      setProfileForm({ fullName: response.data.fullName || "", phone: response.data.phone || "" });
      syncAuthUser(response.data);
      setEditingProfile(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update your profile.");
    } finally { setSavingProfile(false); }
  };

  const handlePictureChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return toast.error("Only JPG, PNG and WEBP images are allowed.");
    if (file.size > 2 * 1024 * 1024) return toast.error("Profile picture must be 2 MB or smaller.");
    try {
      setPictureBusy(true);
      const response = await uploadProfilePicture(file);
      setProfile(response.data);
      syncAuthUser(response.data);
      toast.success("Profile picture updated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update your profile picture.");
    } finally { setPictureBusy(false); }
  };

  const handleRemovePicture = async () => {
    if (!profile?.profilePicture) return;
    try {
      setPictureBusy(true);
      const response = await removeProfilePicture();
      setProfile(response.data);
      syncAuthUser(response.data);
      toast.success("Profile picture removed.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to remove your profile picture.");
    } finally { setPictureBusy(false); }
  };

  const startAddAddress = () => { setAddressMode("add"); setEditingAddressId(null); setAddressForm(EMPTY_ADDRESS); };
  const startEditAddress = (address) => { setAddressMode("edit"); setEditingAddressId(address.id); setAddressForm({ city: address.city || "", area: address.area || "", pincode: address.pincode || "" }); };
  const cancelAddressForm = () => { setAddressMode(null); setEditingAddressId(null); setAddressForm(EMPTY_ADDRESS); };

  const saveAddress = async () => {
    const payload = { city: addressForm.city.trim(), area: addressForm.area.trim(), pincode: addressForm.pincode.trim() };
    if (!payload.city || !payload.area || !/^\\d{6}$/.test(payload.pincode)) return toast.error("Enter city, area and a valid 6-digit pincode.");
    try {
      setSavingAddress(true);
      if (addressMode === "edit") { await updateAddress(editingAddressId, payload); toast.success("Address updated successfully."); }
      else { await addAddress(user.id, payload); toast.success("Address added successfully."); }
      cancelAddressForm();
      await loadAddresses();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save the address.");
    } finally { setSavingAddress(false); }
  };

  const handleDeleteAddress = async (address) => {
    if (!window.confirm("Remove the address in " + address.area + ", " + address.city + "?")) return;
    try {
      setDeletingAddressId(address.id);
      await deleteAddress(address.id);
      toast.success("Address removed successfully.");
      await loadAddresses();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to remove the address.");
    } finally { setDeletingAddressId(null); }
  };

  const permanent = addresses[0];
  const alternatives = addresses.slice(1);
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
            <div className="pst-avatar-wrap">
              <div className="pst-avatar">
                {profileImage ? <img src={profileImage} alt="Profile" /> : <span className="pst-avatar-letter">{initials}</span>}
              </div>
              <button type="button" className="pst-avatar-camera" onClick={() => fileInputRef.current?.click()} disabled={pictureBusy} title="Change profile picture">
                <FaCamera />
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePictureChange} hidden />
            </div>
            <div className="pst-hero-info">
              <h3 className="pst-hero-name">{profile.fullName}</h3><span className="pst-hero-email"><FaEnvelope /> {profile.email}</span>
              <div className="pst-role-badge">
                <FaShieldAlt />
                {roleLabel}
              </div>
            </div>
          </div>
          <div className="pst-hero-actions">{profileImage && <button type="button" className="pst-picture-remove" onClick={handleRemovePicture} disabled={pictureBusy}><FaTrash /> {pictureBusy ? "Updating..." : "Remove photo"}</button>}<div className="pst-verified-tag"><FaCheckCircle /> Verified Account</div></div>
        </div>

        {/* ===== PERSONAL INFO CARD ===== */}
        <div className="pst-card">
          <div className="pst-card-header">
            <div className="pst-card-header-icon blue"><FaIdBadge /></div>
            <div><h3 className="pst-card-title">Personal Information</h3><p className="pst-card-subtitle">Your basic account details</p></div>
            {!editingProfile && <button type="button" className="pst-outline-action" onClick={() => setEditingProfile(true)}><FaEdit /> Edit profile</button>}
          </div>
          {editingProfile ? <>
            <div className="pst-form-grid pst-grid-2">
              <div className="pst-field"><label className="pst-label"><FaUser className="pst-label-icon" /> Full Name</label><div className="pst-input-wrap"><FaUser className="pst-box-icon" /><input value={profileForm.fullName} maxLength={100} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} /></div></div>
              <div className="pst-field"><label className="pst-label"><FaPhone className="pst-label-icon" /> Phone Number</label><div className="pst-input-wrap"><FaPhone className="pst-box-icon" /><input value={profileForm.phone} maxLength={10} inputMode="numeric" onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, "") })} /></div></div>
            </div>
            <div className="pst-email-readonly"><FaEnvelope /><div><strong>{profile.email}</strong><span>Email is currently your login identity.</span></div></div>
            <div className="pst-form-actions"><button className="pst-cancel-btn" type="button" onClick={() => { setEditingProfile(false); setProfileForm({ fullName: profile.fullName || "", phone: profile.phone || "" }); }} disabled={savingProfile}><FaTimes /> Cancel</button><button className="pst-save-btn" type="button" onClick={saveProfile} disabled={savingProfile}><FaSave /> {savingProfile ? "Saving..." : "Save changes"}</button></div>
          </> : <div className="pst-form-grid pst-grid-2">
            <div className="pst-field"><label className="pst-label"><FaUser className="pst-label-icon" /> Full Name</label><div className="pst-readonly-box"><FaUser className="pst-box-icon" /><span>{profile.fullName || "—"}</span></div></div>
            <div className="pst-field"><label className="pst-label"><FaPhone className="pst-label-icon" /> Phone Number</label><div className="pst-readonly-box"><FaPhone className="pst-box-icon" /><span>{profile.phone || "—"}</span></div></div>
            <div className="pst-field"><label className="pst-label"><FaEnvelope className="pst-label-icon" /> Email Address</label><div className="pst-readonly-box"><FaEnvelope className="pst-box-icon" /><span>{profile.email || "—"}</span></div></div>
          </div>}
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

        {/* ===== SAVED ADDRESSES / CRUD ===== */}
        {isEditableRole && <div className="pst-card pst-card-editable">
          <div className="pst-card-header">
            <div className="pst-card-header-icon violet"><FaMapPin /></div>
            <div><h3 className="pst-card-title">Saved Addresses</h3><p className="pst-card-subtitle">Add, update or remove addresses used for service bookings</p></div>
            {!addressMode && <button type="button" className="pst-add-btn" onClick={startAddAddress}><FaPlus /> Add New Address</button>}
          </div>

          {addressMode && <div className="pst-addr-form">
            <div className="pst-form-title"><span>{addressMode === "edit" ? "Edit address" : "Add new address"}</span><button type="button" onClick={cancelAddressForm}><FaTimes /></button></div>
            <div className="pst-form-grid pst-grid-3">
              <div className="pst-field"><label className="pst-label"><FaCity className="pst-label-icon" /> City *</label><div className="pst-input-wrap"><FaCity className="pst-box-icon" /><input value={addressForm.city} maxLength={100} placeholder="e.g. New Delhi" onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} /></div></div>
              <div className="pst-field"><label className="pst-label"><FaLocationArrow className="pst-label-icon" /> Area *</label><div className="pst-input-wrap"><FaLocationArrow className="pst-box-icon" /><input value={addressForm.area} maxLength={150} placeholder="e.g. Dwarka" onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })} /></div></div>
              <div className="pst-field"><label className="pst-label"><FaHashtag className="pst-label-icon" /> Pincode *</label><div className="pst-input-wrap"><FaHashtag className="pst-box-icon" /><input value={addressForm.pincode} maxLength={6} inputMode="numeric" placeholder="110075" onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "") })} /></div></div>
            </div>
            <div className="pst-form-actions"><button type="button" className="pst-cancel-btn" onClick={cancelAddressForm} disabled={savingAddress}><FaTimes /> Cancel</button><button type="button" className="pst-save-btn" onClick={saveAddress} disabled={savingAddress}><FaSave /> {savingAddress ? "Saving..." : addressMode === "edit" ? "Update address" : "Save address"}</button></div>
          </div>}

          {loadingAddresses ? <div className="pst-addr-skeleton"><div className="pst-skeleton-line" /><div className="pst-skeleton-line" /></div> :
            addresses.length > 0 ? <div className="pst-addr-list">{addresses.map((addr, idx) => <div className={"pst-addr-card " + (idx === 0 ? "pst-addr-primary" : "")} key={addr.id ?? idx}>
              <div className="pst-addr-card-icon"><FaMapMarkedAlt /></div>
              <div className="pst-addr-card-body"><span className="pst-addr-card-label">{idx === 0 ? "Primary Address" : "Alternative Address " + idx}</span><span className="pst-addr-card-text">{addr.area}, {addr.city} — {addr.pincode}</span></div>
              <div className="pst-addr-actions"><button type="button" className="pst-addr-edit" onClick={() => startEditAddress(addr)} title="Edit address"><FaEdit /></button><button type="button" className="pst-addr-delete" onClick={() => handleDeleteAddress(addr)} disabled={deletingAddressId === addr.id} title="Delete address"><FaTrash /></button></div>
            </div>)}</div> :
            !addressMode && <div className="pst-addr-empty"><FaCompass className="pst-addr-empty-icon" /><p>No saved addresses yet.</p><span>Add an address to make service booking easier.</span></div>}
        </div>}
      </div>
    </div>
  );
};

export default ProfileSettings;
