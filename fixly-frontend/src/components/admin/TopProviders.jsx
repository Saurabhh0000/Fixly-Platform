import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { getTopProviders } from "../../api/adminAnalyticsApi";

const TopProviders = () => {
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
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

  return (
    <div className="adm-chart-card">
      <div className="adm-chart-card-header">
        <div>
          <h3 className="adm-chart-title">Top Performing Providers</h3>
          <p className="adm-chart-sub">
            Ranked by completed bookings, all time
          </p>
        </div>
      </div>

      {status === "loading" && (
        <div className="adm-chart-skeleton">Loading dashboard...</div>
      )}
      {status === "error" && (
        <div className="adm-chart-empty">Unable to load analytics.</div>
      )}
      {status === "empty" && (
        <div className="adm-chart-empty">No provider data available.</div>
      )}
      {status === "ready" && (
        <div className="adm-top-providers-list">
          {providers.map((p, i) => (
            <div className="adm-top-provider-row" key={p.providerId}>
              <span className="adm-top-provider-rank">{i + 1}</span>
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
