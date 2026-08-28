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
  FaCalendarCheck,
  FaStore,
} from "react-icons/fa";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";
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
            <div className="adm-kpi-span-6">
              <div className="adm-skeleton-card" style={{ height: 148 }} />
            </div>
            <div className="adm-kpi-span-3">
              <div className="adm-skeleton-card" style={{ height: 148 }} />
            </div>
            <div className="adm-kpi-span-3">
              <div className="adm-skeleton-card" style={{ height: 148 }} />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="adm-kpi-span-3" key={i}>
                <div className="adm-skeleton-card" />
              </div>
            ))}
            <div className="adm-kpi-span-12">
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
              <div className="adm-kpi-span-6">
                <AdminStatCard
                  size="lg"
                  tone="revenue"
                  icon={<FaRupeeSign />}
                  title="Total Revenue"
                  value={`₹${overview.totalRevenue.toLocaleString("en-IN")}`}
                  subtitle="Completed bookings, selected period"
                />
              </div>
              <div className="adm-kpi-span-3">
                <AdminStatCard
                  size="lg"
                  tone="blue"
                  icon={<FaClipboardList />}
                  title="Total Bookings"
                  value={overview.totalBookings.toLocaleString("en-IN")}
                  subtitle="Selected period"
                />
              </div>
              <div className="adm-kpi-span-3">
                <AdminStatCard
                  size="lg"
                  tone="purple"
                  icon={<FaUserTie />}
                  title="Total Providers"
                  value={overview.totalProviders.toLocaleString("en-IN")}
                  subtitle={`${overview.approvedProviders} approved · ${overview.pendingProviders} pending`}
                />
              </div>

              <div className="adm-kpi-span-3">
                <AdminStatCard
                  tone="indigo"
                  icon={<FaUsers />}
                  title="Total Users"
                  value={overview.totalUsers.toLocaleString("en-IN")}
                  subtitle="All time"
                />
              </div>
              <div className="adm-kpi-span-3">
                <AdminStatCard
                  tone="green"
                  icon={<FaCheckCircle />}
                  title="Completed"
                  value={overview.completedBookings.toLocaleString("en-IN")}
                  subtitle={`${overview.bookingCompletionRate}% completion rate`}
                />
              </div>
              <div className="adm-kpi-span-3">
                <AdminStatCard
                  tone="amber"
                  icon={<FaHourglassHalf />}
                  title="Pending"
                  value={overview.pendingBookings.toLocaleString("en-IN")}
                  subtitle="Awaiting provider response"
                />
              </div>
              <div className="adm-kpi-span-3">
                <AdminStatCard
                  tone="red"
                  icon={<FaTimesCircle />}
                  title="Cancelled"
                  value={overview.cancelledBookings.toLocaleString("en-IN")}
                  subtitle={`${overview.bookingCancellationRate}% cancellation rate`}
                />
              </div>

              <div className="adm-kpi-span-12">
                <AdminStatCard
                  size="banner"
                  tone="slate"
                  icon={<FaChartLine />}
                  title="Average Booking Value"
                  value={`₹${overview.averageBookingValue.toFixed(0)}`}
                  subtitle="Per completed booking"
                />
              </div>
            </div>

            <div className="adm-section-title-row">
              <span
                className="adm-title-icon adm-title-icon-lg adm-title-icon-green"
                aria-hidden="true">
                <FaCalendarCheck />
              </span>
              <h3 className="adm-section-title">Booking Performance</h3>
            </div>
            <div className="adm-bento-row">
              <BookingAnalytics />
            </div>
            <div className="adm-bento-row adm-bento-row-2">
              <BookingStatusChart overview={overview} />
              <RevenueAnalytics />
            </div>

            <div className="adm-section-title-row">
              <span
                className="adm-title-icon adm-title-icon-lg adm-title-icon-purple"
                aria-hidden="true">
                <FaStore />
              </span>
              <h3 className="adm-section-title">Marketplace Performance</h3>
            </div>
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
    </AdminLayout>
  );
};

export default AdminDashboard;
