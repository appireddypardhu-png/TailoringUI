import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Orders from "./pages/Orders";
import Measurements from "./pages/Measurements";
import Billing from "./pages/Billing";
import Login from "./pages/Login";

import "./style.css";

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated
    ? children
    : <Navigate to="/login" />;
}

export default function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      localStorage.getItem("isAuthenticated") === "true"
    );
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);

    navigate("/");
  };

  return (
    <div className="overflow-x-hidden">

      <div className="fixed top-0 left-0 right-0 z-50 bg-[#A79277] text-white px-4 py-4">
        <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link className="text-sm font-semibold" to="/">
              Home
            </Link>

            <button
              className="sm:hidden rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-3">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm font-semibold">
                  Dashboard
                </Link>

                <Link to="/customers" className="text-sm font-semibold">
                  Customers
                </Link>

                <Link to="/orders" className="text-sm font-semibold">
                  Orders
                </Link>

                <Link to="/measurements" className="text-sm font-semibold">
                  Measurements
                </Link>

                <Link to="/billing" className="text-sm font-semibold">
                  Billing
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {menuOpen && isAuthenticated && (
            <div className="absolute left-0 right-0 top-full bg-[#A79277] p-4 shadow-xl sm:hidden">
              <div className="flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold"
                >
                  Dashboard
                </Link>
                <Link
                  to="/customers"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold"
                >
                  Customers
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold"
                >
                  Orders
                </Link>
                <Link
                  to="/measurements"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold"
                >
                  Measurements
                </Link>
                <Link
                  to="/billing"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold"
                >
                  Billing
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="bg-red-500 px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-28 sm:pt-20">

        <Routes>

          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
              />
            }
          />

          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/:customerId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CustomerDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/measurements"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Measurements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Billing />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>

    </div>
  );
}