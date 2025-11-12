import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    }
  };

  // Active route highlighting
  const isActive = (path) => location.pathname === path;

  // Animation variants
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    rest: { opacity: 1 },
    hover: { opacity: 0.8, transition: { duration: 0.2 } },
  };

  const themeToggleVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 15, scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg custom-navbar-bg sticky-top"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
    >
      <div className="container-fluid px-4">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold">
          PortfolioPro
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Center navigation links */}
          <div className="navbar-nav mx-auto d-flex align-items-center gap-2">
            <motion.div initial="rest" whileHover="hover" variants={linkVariants}>
              <Link
                to="/"
                className={`nav-link mx-2 custom-nav-link-color ${
                  isActive("/") ? "active-nav" : ""
                }`}
              >
                Home
              </Link>
            </motion.div>

            <motion.div initial="rest" whileHover="hover" variants={linkVariants}>
              <Link
                to="/dashboard"
                className={`nav-link mx-2 custom-nav-link-color ${
                  isActive("/dashboard") ? "active-nav" : ""
                }`}
              >
                Dashboard
              </Link>
            </motion.div>

            <motion.div initial="rest" whileHover="hover" variants={linkVariants}>
              <Link
                to="/get-inspired"
                className={`nav-link mx-2 custom-nav-link-color ${
                  isActive("/get-inspired") ? "active-nav" : ""
                }`}
              >
                Get Inspired
              </Link>
            </motion.div>

            <motion.div initial="rest" whileHover="hover" variants={linkVariants}>
              <Link
                to="/ask-ai"
                className={`nav-link mx-2 custom-nav-link-color ${
                  isActive("/ask-ai") ? "active-nav" : ""
                }`}
              >
                Improve Resume
              </Link>
            </motion.div>

            <motion.div initial="rest" whileHover="hover" variants={linkVariants}>
              <Link
                to="/contact"
                className={`nav-link mx-2 custom-nav-link-color ${
                  isActive("/contact") ? "active-nav" : ""
                }`}
              >
                Contact Us
              </Link>
            </motion.div>
          </div>

          {/* Right section: theme toggle + auth */}
          <div className="d-flex align-items-center">
            {/* Theme toggle */}
            <motion.button
              className="btn theme-toggle-btn"
              onClick={toggleTheme}
              initial="rest"
              whileHover="hover"
              variants={themeToggleVariants}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <i className="bi bi-moon-stars-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </motion.button>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="me-3 user-greeting">
                  Hi,{" "}
                  {user?.firstName ||
                    user?.name ||
                    user?.email?.split("@")[0]}
                </span>
                <motion.button
                  onClick={handleLogout}
                  className="btn custom-login-btn fw-bold"
                  initial="rest"
                  whileHover="hover"
                  variants={buttonVariants}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <>
                <motion.div initial="rest" whileHover="hover" variants={linkVariants} className="me-3">
                  <Link to="/login" className="btn custom-login-btn fw-bold">
                    Login
                  </Link>
                </motion.div>
                <motion.div initial="rest" whileHover="hover" variants={buttonVariants}>
                  <Link to="/signup" className="btn custom-cta-btn fw-bold">
                    Create Your Portfolio
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
