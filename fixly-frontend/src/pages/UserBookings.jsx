import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import fixlyApi from "../api/fixlyApi";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUserTie,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/fixly-bookings.css";
import ReviewModal from "./ReviewModal";
import emptyBookingsImg from "../assets/empty-bookings.png";
import UserLayout from "../layouts/UserLayout";

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadBookings = async () => {
    try {
      const res = await fixlyApi.get(`/api/bookings/user/${user.id}`);
      setBookings(res.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadBookings();
  }, [user?.id]);

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
      <div className="bookings-page-bg">
        <Container className="py-5">
          <header className="mb-4">
            <h2 className="fw-bold">My Bookings</h2>
            <p className="text-muted">Your service reservations</p>
          </header>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <img src={emptyBookingsImg} alt="No bookings" />
              <h4>No bookings yet</h4>
              <p>Start by booking your first service.</p>
              <button
                className="book-service-btn"
                onClick={() => navigate("/search")}>
                Book Service
              </button>
            </div>
          ) : (
            <Row className="g-4">
              {bookings.map((b) => (
                <Col key={b.bookingId} xs={12} md={6} lg={4}>
                  <div className="reservation-card blue-card">
                    {/* HEADER */}
                    <div className="card-header">
                      <span className="category">{b.category}</span>

                      {/* ✅ ALWAYS VISIBLE */}
                      <span
                        className={`status-badges ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </div>

                    {/* PROVIDER */}
                    <div className="provider-name">
                      <FaUserTie className="icon-provider" />
                      <span>{b.providerName || "Assigned Provider"}</span>
                    </div>

                    {/* DATE */}
                    <div className="card-date">
                      <FaCalendarAlt className="icon-date" />
                      {new Date(b.serviceDate).toLocaleDateString("en-IN")}
                    </div>

                    {/* LOCATION */}
                    <div className="card-location">
                      <FaMapMarkerAlt className="icon-location" />
                      {b.area}, {b.city}, {b.pincode}
                    </div>

                    {/* OTP */}
                    {b.status === "ACCEPTED" && b.otp && (
                      <>
                        <div className="otp-box">
                          <span className="otp-label">Service OTP</span>
                          <span className="otp-value">{b.otp}</span>
                        </div>

                        <div className="otp-warning">
                          <FaExclamationTriangle />
                          <span>Share OTP only after service completion</span>
                        </div>
                      </>
                    )}

                    <div className="divider" />

                    {/* PRICE */}
                    <div className="amount-row">
                      <span>Net Amount</span>
                      <span className="price">
                        <FaRupeeSign /> {b.price}
                      </span>
                    </div>

                    {/* REVIEW */}
                    {b.status === "COMPLETED" && (
                      <div className="review-section">
                        {!b.reviewed ? (
                          <button
                            className="review-btn"
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowReview(true);
                            }}>
                            ⭐ Rate Service
                          </button>
                        ) : (
                          <div className="rated-badge">
                            ⭐ {b.rating} / 5 • Rated
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>

        {showReview && selectedBooking && (
          <ReviewModal
            booking={selectedBooking}
            onClose={() => setShowReview(false)}
            onSuccess={() => {
              toast.success("Review added successfully");
              setShowReview(false);
              loadBookings();
            }}
          />
        )}
      </div>
    </UserLayout>
  );
};

export default UserBookings;
