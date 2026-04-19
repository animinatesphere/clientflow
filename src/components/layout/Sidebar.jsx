import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MessageSquare,
  Radio,
  MessageCircle,
  ChevronRight,
  Settings as SettingsIcon,
  LogOut,
  Receipt,
} from "lucide-react";

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  { id: "customers", label: "Customers", icon: Users, path: "/customers" },
  { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
  {
    id: "quick-replies",
    label: "Quick Replies",
    icon: MessageSquare,
    path: "/quick-replies",
  },
  { id: "broadcast", label: "Broadcast", icon: Radio, path: "/broadcast" },
  { id: "settings", label: "Settings", icon: SettingsIcon, path: "/settings" },
  { id: "invoices", label: "Invoices", icon: Receipt, path: "/invoices" },
];

export default function Sidebar({ isOpen, onClose, user, onLogout }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 99,
          }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <Link
          to="/dashboard"
          className="sidebar-logo"
          style={{ textDecoration: "none" }}
          onClick={onClose}
        >
          <div className="sidebar-logo-icon">
            <MessageCircle size={20} color="#000" fill="#000" />
          </div>
          <div className="sidebar-logo-text">
            Client<span>Flow</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {/* // eslint-disable-next-line no-unused-vars */}
          {NAV.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={onClose}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <>
                  <Icon className="nav-icon" />
                  <span style={{ flex: 1 }}>{label}</span>
                  {isActive && <ChevronRight size={14} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div
          className="sidebar-footer"
          style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              className="avatar"
              style={{
                width: 36,
                height: 36,
                fontSize: "0.8rem",
                background: "var(--green)",
                color: "#000",
              }}
            >
              {user?.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Free Plan
              </div>
            </div>
            <Link
              to="/settings"
              className="btn btn-ghost btn-sm"
              style={{ padding: 4 }}
              onClick={onClose}
              title="Settings"
            >
              <SettingsIcon size={16} />
            </Link>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              color: "var(--red)",
              fontSize: "0.78rem",
            }}
            onClick={onLogout}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
