import {
  FaTools,
  FaClock,
  FaWallet,
  FaStar,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaRocket,
} from "react-icons/fa";
import "../../styles/fixly-provider-footer.css";

const ProviderFooter = () => {
  return (
    <footer className="provider-footer">
      {/* TOP */}
      <div className="provider-footer-top">
        <div className="provider-brand">
          <h3>
            Fix<span>ly</span> Provider
          </h3>

          <p className="provider-desc">
            Grow your service business with Fixly. Get consistent bookings,
            trusted customers, and timely payouts — all in one platform.
          </p>

          <div className="provider-badges">
            <span>
              <FaTools /> More Jobs
            </span>
            <span>
              <FaClock /> Flexible Schedule
            </span>
            <span>
              <FaWallet /> Secure Payouts
            </span>
            <span>
              <FaStar /> Ratings & Reviews
            </span>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="provider-social">
          <h4>Connect with Fixly</h4>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="provider-footer-bottom">
        <p>© {new Date().getFullYear()} Fixly • Provider Dashboard</p>
        <p className="footer-text">
          <span>Empowering service professionals</span>
          <FaRocket className="footer-bottom-icon" />
        </p>
      </div>
    </footer>
  );
};

export default ProviderFooter;
