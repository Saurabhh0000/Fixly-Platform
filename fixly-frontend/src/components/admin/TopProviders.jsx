import { useEffect, useState, useCallback } from "react";
import { FaStar, FaTrophy } from "react-icons/fa";
import { getTopProviders } from "../../api/adminAnalyticsApi";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const TopProviders = () => {
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
    let active = true;
    setStatus("loading");
    getTopProviders(5)
      .then((res) => {
        if (!active) return;
        setProviders(res.data);
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
        <div className="adm-chart-title-row">
          <span
            className="adm-title-icon adm-title-icon-amber"
            aria-hidden="true">
            <FaTrophy />
          </span>
          <div>
            <h3 className="adm-chart-title">Top Performing Providers</h3>
            <p className="adm-chart-sub">
              Ranked by completed bookings, all time
            </p>
          </div>
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">Unable to load analytics</div>
          We couldn't retrieve provider rankings.
          <div>
            <button className="adm-retry-btn" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">
          <div className="adm-chart-empty-title">No provider data yet</div>
          Top providers will appear here once bookings are completed.
        </div>
      )}
      {status === "ready" && (
        <div className="adm-top-providers-list">
          {providers.map((p, i) => (
            <div className="adm-top-provider-row" key={p.providerId}>
              <span
                className={`adm-top-provider-rank ${i === 0 ? "adm-top-provider-rank-1" : ""}`}>
                {i + 1}
              </span>
              {p.avatarUrl ? (
                <img
                  className="adm-top-provider-avatar"
                  src={p.avatarUrl}
                  alt={p.fullName}
                />
              ) : (
                <div className="adm-top-provider-avatar" aria-hidden="true">
                  {initials(p.fullName)}
                </div>
              )}
              <div className="adm-top-provider-info">
                <span className="adm-top-provider-name">{p.fullName}</span>
                <span className="adm-top-provider-category">{p.category}</span>
              </div>
              <div className="adm-top-provider-stats">
                <span>{p.completedBookings} completed</span>
                <span className="adm-top-provider-rating">
                  <FaStar /> {p.rating.toFixed(1)} ({p.ratingCount})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProviders;
