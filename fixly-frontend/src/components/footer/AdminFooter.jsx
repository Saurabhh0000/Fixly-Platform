import {
  FaUserShield,
  FaUsersCog,
  FaChartLine,
  FaDatabase,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "../../styles/fixly-admin-footer.css";

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      {/* TOP */}
      <div className="admin-footer-top">
        {/* BRAND */}
        <div className="admin-brand">
          <h3>
            Fix<span>ly</span> Admin
          </h3>

          <p className="admin-desc">
            Centralized control panel to manage users, providers, bookings,
            payments, and overall platform growth with security and precision.
          </p>

          <div className="admin-badges">
            <span>
              <FaUserShield /> Secure Platform
            </span>
            <span>
              <FaUsersCog /> User Management
            </span>
            <span>
              <FaChartLine /> Analytics
            </span>
            <span>
              <FaDatabase /> Data Control
            </span>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="admin-social">
          <h4>Admin Network</h4>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="admin-footer-bottom">
        <p>© {new Date().getFullYear()} Fixly • Admin Dashboard</p>
        <p>Powering the Fixly ecosystem ⚙️</p>
      </div>
    </footer>
  );
};

export default AdminFooter;
