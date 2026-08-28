import { useEffect, useState, useCallback } from "react";
import {
  FaUserPlus,
  FaBriefcase,
  FaCalendarCheck,
  FaCheckCircle,
  FaThumbsUp,
  FaTimesCircle,
  FaPauseCircle,
  FaPlayCircle,
  FaBell,
} from "react-icons/fa";
import { getRecentActivity } from "../../api/adminAnalyticsApi";

const ICONS = {
  ACCOUNT: <FaUserPlus />,
  PROVIDER: <FaBriefcase />,
  BOOKING: <FaCalendarCheck />,
  COMPLETED: <FaCheckCircle />,
  APPROVAL: <FaThumbsUp />,
  REJECTION: <FaTimesCircle />,
  SUSPENDED: <FaPauseCircle />,
  UNSUSPENDED: <FaPlayCircle />,
};

const RecentActivity = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
    let active = true;
    setStatus("loading");
    getRecentActivity(10)
      .then((res) => {
        if (!active) return;
        setItems(res.data);
        setStatus(res.data.length === 0 ? "empty" : "ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div>
          <h3 className="adm-chart-title">Recent Platform Activity</h3>
          <p className="adm-chart-sub">Latest events across Fixly</p>
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">Unable to load activity</div>
          <div>
            <button className="adm-retry-btn" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No recent activity</div>
          Platform events will show up here as they happen.
        </div>
      )}
      {status === "ready" && (
        <div className="adm-activity-list">
          {items.map((item, i) => (
            <div className="adm-activity-row" key={i}>
              <div className="adm-activity-icon">
                {ICONS[item.type] || <FaBell />}
              </div>
              <div className="adm-activity-body">
                <span className="adm-activity-title">{item.title}</span>
                <span className="adm-activity-message">{item.message}</span>
              </div>
              <span className="adm-activity-time">{item.timeAgo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
