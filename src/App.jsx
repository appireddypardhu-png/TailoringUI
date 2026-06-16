import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
  Link
} from "react-router-dom";

import Home from "./pages/Home";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Orders from "./pages/Orders";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Poller from "./services/poller";

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

    try {
      Poller.onLogout();
    } catch (e) {
      // ignore
    }

    navigate("/");
  };

  useEffect(() => {
    try {
      Poller.init();
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        Poller.stop();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <div className="overflow-x-hidden">

      <div className="fixed top-0 left-0 right-0 z-50 bg-[#A79277] text-white px-4 py-3 shadow-lg">
        <div className="relative max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              className="text-sm font-medium rounded-lg px-3 py-2 hover:bg-white/15 transition"
              to="/"
            >
              Home
            </Link>

            <button
              className="sm:hidden rounded-lg border border-white/30 px-3 py-2 text-sm font-medium"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {isAuthenticated && (
              <>
                <NavLink
                  to="/customers"
                  className={({ isActive }) =>
                    `text-sm font-medium rounded-lg px-3 py-2 transition ${isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/15"}`
                  }
                >
                  Customers
                </NavLink>

                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `text-sm font-medium rounded-lg px-3 py-2 transition ${isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/15"}`
                  }
                >
                  Orders
                </NavLink>

                <NavLink
                  to="/order-history"
                  className={({ isActive }) =>
                    `text-sm font-medium rounded-lg px-3 py-2 transition ${isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/15"}`
                  }
                >
                  Order History
                </NavLink>

                <button
                  onClick={logout}
                  className="bg-red-500 px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {menuOpen && isAuthenticated && (
            <div className="absolute left-0 right-0 top-full bg-[#A79277] p-3 shadow-xl sm:hidden">
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/customers"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium rounded-lg px-3 py-2 transition ${isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/15"}`
                  }
                >
                  Customers
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium rounded-lg px-3 py-2 transition ${isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/15"}`
                  }
                >
                  Orders
                </NavLink>
                <NavLink
                  to="/order-history"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium rounded-lg px-3 py-2 transition ${isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/15"}`
                  }
                >
                  Order History
                </NavLink>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="bg-red-500 px-3 py-2 rounded-lg text-sm font-semibold"
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
            path="/order-history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>

    </div>
  );
}