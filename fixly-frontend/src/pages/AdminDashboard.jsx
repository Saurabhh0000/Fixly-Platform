import { useEffect, useState } from "react";
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
import AdminFooter from "../components/AdminFooter";
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

  useEffect(() => {
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

  return (
    <AdminLayout>
      <div className="adm-wrapper">
        <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

        {status === "loading" && (
          <div className="adm-kpi-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="adm-skeleton-card" key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="adm-chart-empty adm-page-error">
            Some analytics could not be loaded. Please refresh the page.
          </div>
        )}

        {status === "ready" && overview && (
          <>
            <div className="adm-kpi-grid">
              <AdminStatCard
                icon={<FaUsers />}
                title="Total Users"
                value={overview.totalUsers.toLocaleString()}
                subtitle="All time"
              />
              <AdminStatCard
                icon={<FaUserTie />}
                title="Total Providers"
                value={overview.totalProviders.toLocaleString()}
                subtitle={`${overview.approvedProviders} approved · ${overview.pendingProviders} pending`}
              />
              <AdminStatCard
                icon={<FaClipboardList />}
                title="Total Bookings"
                value={overview.totalBookings.toLocaleString()}
                subtitle="Selected period"
              />
              <AdminStatCard
                icon={<FaCheckCircle />}
                title="Completed Bookings"
                value={overview.completedBookings.toLocaleString()}
                subtitle={`${overview.bookingCompletionRate}% completion rate`}
              />
              <AdminStatCard
                icon={<FaHourglassHalf />}
                title="Pending Bookings"
                value={overview.pendingBookings.toLocaleString()}
                subtitle="Awaiting provider response"
              />
              <AdminStatCard
                icon={<FaTimesCircle />}
                title="Cancelled Bookings"
                value={overview.cancelledBookings.toLocaleString()}
                subtitle={`${overview.bookingCancellationRate}% cancellation rate`}
              />
              <AdminStatCard
                icon={<FaRupeeSign />}
                title="Total Revenue"
                value={`₹${overview.totalRevenue.toLocaleString()}`}
                subtitle="Completed bookings, selected period"
              />
              <AdminStatCard
                icon={<FaChartLine />}
                title="Average Booking Value"
                value={`₹${overview.averageBookingValue.toFixed(0)}`}
                subtitle="Per completed booking"
              />
            </div>

            <BookingAnalytics />
            <ProviderAnalytics />
            <RevenueAnalytics />
            <BookingStatusChart overview={overview} />
            <CategoryPerformance period={period} />
            <TopProviders />
            <RecentActivity />
          </>
        )}
      </div>
      <AdminFooter />
    </AdminLayout>
  );
};

export default AdminDashboard;
