import React, { useEffect, useState, useContext } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaSmile,
  FaUserTie,
  FaStar,
  FaMapMarkerAlt,
  FaListUl,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import fixlyApi from "../api/fixlyApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/fixly-dashboard.css";
import UserLayout from "../layouts/UserLayout";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!user?.id) return;

    const loadBookings = async () => {
      try {
        const res = await fixlyApi.get(`/api/bookings/user/${user.id}`);
        setBookings(res.data || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) return; // ✅ important
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const filteredBookings =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

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
    <UserLayout>
      <div className="dashboard-wrapper">
        {/* ================= WELCOME ================= */}
        <div className="dashboard-header">
          <div className="welcome-box">
            <div className="welcome-icon-bg">
              <FaSmile />
            </div>
            <div>
              <h2>
                Welcome back, <span>{user?.fullName} ! 👋</span>
              </h2>
              <p>Your bookings, simplified and organized</p>
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="booking-filter-bar">
          <button
            className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}>
            <FaListUl />
            <span>All Booking</span>
          </button>

          <button
            className={`filter-btn ${filter === "PENDING" ? "active" : ""}`}
            onClick={() => setFilter("PENDING")}>
            <FaHourglassHalf />
            <span>Pending</span>
          </button>

          <button
            className={`filter-btn ${filter === "ACCEPTED" ? "active" : ""}`}
            onClick={() => setFilter("ACCEPTED")}>
            <FaClock />
            <span>Accepted</span>
          </button>

          <button
            className={`filter-btn ${filter === "CANCELLED" ? "active" : ""}`}
            onClick={() => setFilter("CANCELLED")}>
            <FaTimesCircle />
            <span>Cancelled</span>
          </button>

          <button
            className={`filter-btn ${filter === "COMPLETED" ? "active" : ""}`}
            onClick={() => setFilter("COMPLETED")}>
            <FaCheckCircle />
            <span>Completed</span>
          </button>
        </div>

        {/* ================= CARDS ================= */}
        {filteredBookings.length === 0 ? (
          <div className="empty-recent">
            <FaCalendarAlt className="empty-icon" />
            <h4>No bookings found</h4>
            <p>Your bookings will appear here once available.</p>
          </div>
        ) : (
          <div className="booking-card-grid">
            {filteredBookings.map((b) => (
              <div key={b.bookingId} className="booking-profile-card">
                {/* TOP ROW */}
                <div className="card-top-row">
                  <span className="category-badge">{b.category}</span>

                  <span className={`status-badge ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>

                <div className="provider-info">
                  <FaUserTie />
                  <span>{b.providerName || "Assigned Provider"}</span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <FaCalendarAlt />
                    <span>
                      {new Date(b.serviceDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <div className="info-row">
                    <FaMapMarkerAlt />
                    <span>
                      {b.area}, {b.city}
                    </span>
                  </div>

                  <div className="info-row">
                    <FaStar />
                    <span>
                      {b.rating ? `${b.rating.toFixed(1)} / 5` : "Not rated"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
