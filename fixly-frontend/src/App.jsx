import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
