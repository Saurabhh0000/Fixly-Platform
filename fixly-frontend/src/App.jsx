import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/FixlyNavbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import UserBookings from "./pages/UserBookings";
import SearchResults from "./pages/SearchResults";
import BookService from "./pages/BookService";
import BecomeProvider from "./pages/BecomeProvider";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import AdminProviderRequests from "./pages/AdminProviderRequests";
import HelpSupport from "./pages/HelpSupport";
import NotificationPage from "./pages/NotificationPage";

import PrivateRoute from "./components/PrivateRoute";
import AdminCategories from "./pages/AdminCategories";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";
import ContactManagement from "./pages/ContactManagement";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact" element={<Contact />} />
        {/* PROFILE & SECURITY */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/help-support"
          element={
            <PrivateRoute>
              <HelpSupport />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          }
        />

        {/* USER */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/bookings"
          element={
            <PrivateRoute role="USER">
              <UserBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/become-provider"
          element={
            <PrivateRoute role="USER">
              <BecomeProvider />
            </PrivateRoute>
          }
        />

        {/* PROVIDER */}
        <Route
          path="/provider/dashboard"
          element={
            <PrivateRoute role="PROVIDER">
              <ProviderDashboard />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <PrivateRoute role="ADMIN">
              <ContactManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/providers"
          element={
            <PrivateRoute role="ADMIN">
              <AdminProviderRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute role="ADMIN">
              <AdminCategories />
            </PrivateRoute>
          }
        />
        {/* BOOK SERVICE */}
        <Route
          path="/book"
          element={
            <PrivateRoute>
              <BookService />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
