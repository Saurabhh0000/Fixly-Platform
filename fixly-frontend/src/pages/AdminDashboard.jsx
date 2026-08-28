import { useEffect, useState, useCallback } from "react";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaRupeeSign,
  FaChartLine,
} from "react-icons/fa";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";
import AdminFooter from "../components/footer/AdminFooter";
import AnalyticsHeader from "../components/admin/AnalyticsHeader";
import AdminStatCard from "../components/admin/AdminStatCard";
import BookingAnalytics from "../components/admin/BookingAnalytics";
import ProviderAnalytics from "../components/admin/ProviderAnalytics";
import RevenueAnalytics from "../components/admin/RevenueAnalytics";
import BookingStatusChart from "../components/admin/BookingStatusChart";
import CategoryPerformance from "../components/admin/CategoryPerformance";
import TopProviders from "../components/admin/TopProviders";
import RecentActivity from "../components/admin/RecentActivity";
import { getOverview } from "../api/adminAnalyticsApi";
import "../styles/fixly-admin.css";

const AdminDashboard = () => {
  const [period, setPeriod] = useState("month");
  const [overview, setOverview] = useState(null);
  const [status, setStatus] = useState("loading");

  const load = useCallback(() => {
    let active = true;
    setStatus("loading");
    getOverview(period)
      .then((res) => {
        if (!active) return;
        setOverview(res.data);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        toast.error("Unable to load dashboard analytics.", { duration: 4000 });
      });
    return () => {
      active = false;
    };
  }, [period]);

  useEffect(() => load(), [load]);

  return (
    <AdminLayout>
      <div className="adm-wrapper">
        <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

        {status === "loading" && (
          <div className="adm-kpi-grid">
            <div className="adm-kpi-revenue">
              <div className="adm-skeleton-card" style={{ height: 168 }} />
            </div>
            <div className="adm-kpi-bookings">
              <div className="adm-skeleton-card" style={{ height: 168 }} />
            </div>
            <div className="adm-kpi-providers">
              <div className="adm-skeleton-card" style={{ height: 168 }} />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="adm-kpi-users" key={i}>
                <div className="adm-skeleton-card" />
              </div>
            ))}
            <div className="adm-kpi-avg">
              <div className="adm-skeleton-card" style={{ height: 96 }} />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="adm-chart-card adm-page-error">
            <div className="adm-chart-empty-title">
              Unable to load analytics
            </div>
            We couldn't retrieve the latest dashboard data.
            <div>
              <button className="adm-retry-btn" onClick={load}>
                Retry
              </button>
            </div>
          </div>
        )}

        {status === "ready" && overview && (
          <>
            <div className="adm-kpi-grid">
              <div className="adm-kpi-revenue">
                <AdminStatCard
                  size="lg"
                  tone="revenue"
                  icon={<FaRupeeSign />}
                  title="Total Revenue"
                  value={`₹${overview.totalRevenue.toLocaleString("en-IN")}`}
                  subtitle="Completed bookings, selected period"
                />
              </div>
              <div className="adm-kpi-bookings">
                <AdminStatCard
                  size="lg"
                  tone="info"
                  icon={<FaClipboardList />}
                  title="Total Bookings"
                  value={overview.totalBookings.toLocaleString("en-IN")}
                  subtitle="Selected period"
                />
              </div>
              <div className="adm-kpi-providers">
                <AdminStatCard
                  icon={<FaUserTie />}
                  title="Total Providers"
                  value={overview.totalProviders.toLocaleString("en-IN")}
                  subtitle={`${overview.approvedProviders} approved · ${overview.pendingProviders} pending`}
                />
              </div>

              <div className="adm-kpi-users">
                <AdminStatCard
                  icon={<FaUsers />}
                  title="Total Users"
                  value={overview.totalUsers.toLocaleString("en-IN")}
                  subtitle="All time"
                />
              </div>
              <div className="adm-kpi-completed">
                <AdminStatCard
                  tone="default"
                  icon={<FaCheckCircle />}
                  title="Completed Bookings"
                  value={overview.completedBookings.toLocaleString("en-IN")}
                  subtitle={`${overview.bookingCompletionRate}% completion rate`}
                />
              </div>
              <div className="adm-kpi-pending">
                <AdminStatCard
                  tone="warning"
                  icon={<FaHourglassHalf />}
                  title="Pending Bookings"
                  value={overview.pendingBookings.toLocaleString("en-IN")}
                  subtitle="Awaiting provider response"
                />
              </div>
              <div className="adm-kpi-cancelled">
                <AdminStatCard
                  tone="danger"
                  icon={<FaTimesCircle />}
                  title="Cancelled Bookings"
                  value={overview.cancelledBookings.toLocaleString("en-IN")}
                  subtitle={`${overview.bookingCancellationRate}% cancellation rate`}
                />
              </div>

              <div className="adm-kpi-avg">
                <AdminStatCard
                  size="avg"
                  tone="neutral"
                  icon={<FaChartLine />}
                  title="Average Booking Value"
                  value={`₹${overview.averageBookingValue.toFixed(0)}`}
                  subtitle="Per completed booking"
                />
              </div>
            </div>

            <h3 className="adm-section-title">Booking Performance</h3>
            <div className="adm-bento-row">
              <BookingAnalytics />
            </div>
            <div className="adm-bento-row adm-bento-row-2">
              <BookingStatusChart overview={overview} />
              <RevenueAnalytics />
            </div>

            <h3 className="adm-section-title">Marketplace Performance</h3>
            <div className="adm-bento-row adm-bento-row-2">
              <CategoryPerformance period={period} />
              <ProviderAnalytics />
            </div>

            <div className="adm-bento-row">
              <TopProviders />
            </div>
            <div className="adm-bento-row">
              <RecentActivity />
            </div>
          </>
        )}
      </div>
      <AdminFooter />
    </AdminLayout>
  );
};

export default AdminDashboard;
