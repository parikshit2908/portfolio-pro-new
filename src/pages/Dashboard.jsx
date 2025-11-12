import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase/config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar responsive toggle
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 992) setSidebarOpen(false);
  };

  // 🔄 Fetch analytics data from Supabase
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from("analytics")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;

        setAnalytics(data || []);
        setTotalUsers(data.length);
        const visits = data.reduce((sum, item) => sum + (item.visits || 0), 0);
        setTotalVisits(visits);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Error fetching analytics:", err.message);
        setAnalytics([]);
        setTotalUsers(0);
        setTotalVisits(0);
      }
    };

    fetchAnalytics();

    // Optional: real-time updates if you want live analytics
    const channel = supabase
      .channel("analytics-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analytics" },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/create-portfolio", icon: "bi-file-earmark-plus", label: "Create Portfolio" },
    { path: "/customize-templates", icon: "bi-palette", label: "Customize Templates" },
    { path: "/upload-resume", icon: "bi-file-earmark-arrow-up", label: "Upload Resume" },
    { path: "/upload-portfolio", icon: "bi-cloud-upload", label: "Upload Portfolio" },
    { path: "/settings", icon: "bi-gear", label: "Settings" },
  ];

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            <i className="bi bi-kanban"></i> PortfolioPro
          </h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <i className={`bi ${sidebarOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt={user.user_metadata.display_name} />
            ) : (
              <i className="bi bi-person-circle"></i>
            )}
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <p className="user-name">{user?.user_metadata?.display_name || "User"}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                  title={!sidebarOpen ? item.label : ""}
                  onClick={handleNavClick}
                >
                  <i className={item.icon}></i>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="sidebar-footer">
          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : ""}
          >
            <i className="bi bi-box-arrow-right"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-top">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <i className="bi bi-list"></i>
            </button>
            <div>
              <h1 className="dashboard-title">Dashboard Overview</h1>
              <p className="dashboard-subtitle">
                Welcome back, {user?.user_metadata?.display_name || user?.email || "User"}! 👋
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="dashboard-cards-grid">
          <div
            className="dashboard-card"
            onClick={() =>
              document.querySelector(".chart-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <div className="dashboard-card-icon">
              <i className="bi bi-graph-up"></i>
            </div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">View Analytics</h3>
              <p className="dashboard-card-description">
                Track your portfolio performance and visitor engagement metrics
              </p>
            </div>
            <div className="dashboard-card-arrow">
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/ask-ai")}>
            <div className="dashboard-card-icon improve-resume">
              <i className="bi bi-file-earmark-check"></i>
            </div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Improve your Resume</h3>
              <p className="dashboard-card-description">
                Get AI-powered suggestions to optimize your resume for better results
              </p>
            </div>
            <div className="dashboard-card-arrow">
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h2 className="chart-title">Traffic Overview</h2>
            <p className="chart-subtitle">Analytics data visualization</p>
            {lastUpdated && (
              <p className="text-muted small">Last updated at {lastUpdated}</p>
            )}
          </div>
          {analytics.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-bar-chart"></i>
              <p>No analytics data available yet.</p>
              <p className="text-muted">Data will appear here once it's collected.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-secondary)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="visits"
                  fill="var(--accent-primary)"
                  radius={[8, 8, 0, 0]}
                  name="Visits"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>
    </div>
  );
}
