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

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);

    navigate("/");
  };

  return (
    <div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-[#A79277] text-white flex gap-6 px-8 py-4 items-center">

        <Link to="/">
          Home
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/customers">
              Customers
            </Link>

            <Link to="/orders">
              Orders
            </Link>

            <Link to="/measurements">
              Measurements
            </Link>

            <Link to="/billing">
              Billing
            </Link>

            <button
              onClick={logout}
              className="ml-auto bg-red-500 px-4 py-2 rounded-xl"
            >
              Logout
            </button>
          </>
        )}

      </div>

      <div className="pt-20">

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