import {
  FaCalendarAlt,
  FaStar,
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaCheck,
  FaBell,
  FaUserCheck,
  FaMapMarkerAlt,
  FaUserShield,
  FaUserCog,
} from "react-icons/fa";
import { formatRelativeTime } from "../../utils/formatRelativeTime";

// Maps each backend notification "type" to an icon + color class
const ICON_MAP = {
  BOOKING: {
    icon: FaCalendarAlt,
    cls: "fnotif-icon-booking",
  },

  REVIEW: {
    icon: FaStar,
    cls: "fnotif-icon-review",
  },

  PROVIDER: {
    icon: FaTools,
    cls: "fnotif-icon-provider",
  },

  ADDRESS: {
    icon: FaMapMarkerAlt,
    cls: "fnotif-icon-address",
  },

  CATEGORY: {
    icon: FaTools,
    cls: "fnotif-icon-category",
  },

  ACCOUNT: {
    icon: FaUserShield,
    cls: "fnotif-icon-account",
  },

  VERIFYING: {
    icon: FaUserCog,
    cls: "fnotif-icon-verifying",
  },

  APPROVAL: {
    icon: FaCheckCircle,
    cls: "fnotif-icon-approval",
  },

  REJECTION: {
    icon: FaTimesCircle,
    cls: "fnotif-icon-rejection",
  },

  SUSPENDED: {
    icon: FaBan,
    cls: "fnotif-icon-suspended",
  },

  UNSUSPENDED: {
    icon: FaUserCheck,
    cls: "fnotif-icon-unsuspended",
  },

  COMPLETED: {
    icon: FaCheck,
    cls: "fnotif-icon-completed",
  },

  DEFAULT: {
    icon: FaBell,
    cls: "fnotif-icon-default",
  },
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, title, message, type, read, createdAt } = notification;
  const { icon: Icon, cls } = ICON_MAP[type] || ICON_MAP.DEFAULT;

  const handleClick = () => {
    if (!read) onMarkAsRead(id);
  };

  return (
    <button
      type="button"
      className={`fnotif-item ${!read ? "fnotif-item-unread" : ""}`}
      onClick={handleClick}>
      <span className={`fnotif-item-icon ${cls}`}>
        <Icon />
      </span>

      <span className="fnotif-item-body">
        <span className="fnotif-item-title">{title}</span>
        <span className="fnotif-item-message">{message}</span>
        <span className="fnotif-item-time">
          {formatRelativeTime(createdAt)}
        </span>
      </span>

      {!read && <span className="fnotif-item-dot" aria-hidden="true" />}
    </button>
  );
};

export default NotificationItem;
