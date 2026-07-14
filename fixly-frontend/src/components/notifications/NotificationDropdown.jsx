import { useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  const navigate = useNavigate();
  const latest = notifications.slice(0, 5);
  const hasUnread = notifications.some((n) => !n.read);

  const goToAll = () => {
    onClose();
    navigate("/notifications");
  };

  return (
    <div className="fnotif-dropdown" role="menu">
      <div className="fnotif-dd-head">
        <span className="fnotif-dd-title">Notifications</span>
        {hasUnread && (
          <button
            type="button"
            className="fnotif-mark-all"
            onClick={onMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="fnotif-dd-body">
        {loading ? (
          <div className="fnotif-empty">Loading…</div>
        ) : latest.length === 0 ? (
          <div className="fnotif-empty">You're all caught up 🎉</div>
        ) : (
          latest.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>

      <div className="fnotif-dd-footer">
        <button type="button" className="fnotif-view-all" onClick={goToAll}>
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
