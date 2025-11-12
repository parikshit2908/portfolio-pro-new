import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Layouts & Contexts
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AskAI from "./pages/AskAI";
import Contact from "./pages/Contact";
import PortfolioForm from "./pages/PortfolioForm";
import Settings from "./pages/Settings";
import UploadResume from "./pages/UploadResume";
import UploadPortfolio from "./pages/UploadPortfolio";
import GetInspired from "./pages/GetInspired"; // ✅ NEW PAGE IMPORT

const App = () => {
  const location = useLocation();

  // Hide Navbar & Footer on specific pages
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/create-portfolio",
    "/dashboard",
    "/ask-ai",
    "/settings",
    "/upload-resume",
    "/upload-portfolio",
    "/get-inspired", // ✅ Added to hide Navbar if desired (remove if you want Navbar visible here)
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <ThemeProvider>
      {/* ✅ Show Navbar only when needed */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-portfolio"
          element={
            <ProtectedRoute>
              <PortfolioForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ask-ai"
          element={
            <ProtectedRoute>
              <AskAI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-portfolio"
          element={
            <ProtectedRoute>
              <UploadPortfolio />
            </ProtectedRoute>
          }
        />

        {/* 💡 New Get Inspired Route */}
        <Route
          path="/get-inspired"
          element={
            <ProtectedRoute>
              <GetInspired />
            </ProtectedRoute>
          }
        />

        {/* 🧭 Fallback Route */}
        <Route path="*" element={<Login />} />
      </Routes>

      {/* ✅ Hide Footer when Navbar is hidden */}
      {!shouldHideNavbar && <Footer />}
    </ThemeProvider>
  );
};

export default App;
