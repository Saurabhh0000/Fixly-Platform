import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";
import "../../styles/notifications.css";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <div className="fnotif-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`fnotif-bell ${open ? "fnotif-bell-active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}>
        <FaBell />
        {unreadCount > 0 && (
          <span className="fnotif-badge">{displayCount}</span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
