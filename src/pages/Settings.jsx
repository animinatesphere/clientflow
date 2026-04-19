import { useState } from "react";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Trash2,
  LogOut,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import UpgradeModal from "../components/ui/UpgradeModal";

export default function Settings({ store }) {
  // eslint-disable-next-line no-unused-vars
  const { user, logout, signOut, formatNaira } = store;
  const [showUpgrade, setShowUpgrade] = useState(false);
  const isPro = store.user?.role === "pro";
  return (
    <div className="page-content lp-anim-in">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 24 }}>
          Account Settings
        </h2>

        <div
          style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 }}
        >
          {/* Tabs Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "billing", label: "Billing & Plans", icon: CreditCard },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`btn btn-ghost`}
                style={{
                  justifyContent: "flex-start",
                  color:
                    tab.id === "profile"
                      ? "var(--green)"
                      : "var(--text-secondary)",
                }}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-ghost"
                style={{
                  color: "var(--red)",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
                onClick={async () => {
                  await signOut();
                  logout();
                }}
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Profile Section */}
            <div className="card">
              <h3 className="card-title" style={{ fontSize: "1.25rem" }}>
                {isPro ? "Pro Plan" : "Starter Plan (Free)"}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  className="avatar"
                  style={{
                    width: 64,
                    height: 64,
                    fontSize: "1.5rem",
                    background: "var(--green)",
                    color: "#000",
                  }}
                >
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700 }}>{user?.name || "User"}</h4>
                  <p
                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                  >
                    {user?.email}
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginLeft: "auto" }}
                >
                  Edit Profile
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input className="form-input" defaultValue={user?.name} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" defaultValue={user?.email} />
              </div>
            </div>

            {/* Plan Section */}
            <div
              className="card"
              style={{
                background:
                  "linear-gradient(135deg, var(--bg-card) 0%, rgba(37,211,102,0.05) 100%)",
                border: "1px solid rgba(37,211,102,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div className="badge badge-new" style={{ marginBottom: 8 }}>
                    CURRENT PLAN
                  </div>
                  <h3 className="card-title" style={{ fontSize: "1.25rem" }}>
                    Starter Plan (Free)
                  </h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>₦0</div>
                  <div
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    per month
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <CheckCircle size={14} color="var(--green)" /> 20 Customers
                  maximum
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <CheckCircle size={14} color="var(--green)" /> Basic Dashboard
                </div>
              </div>

              {!isPro && (
                <button
                  className="lp-cta-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setShowUpgrade(true)}
                >
                  <CreditCard size={18} /> Upgrade to Pro — ₦1,500/mo
                  <div className="lp-cta-shine" />
                </button>
              )}
            </div>

            {/* Danger Zone */}
            <div
              className="card"
              style={{ border: "1px solid rgba(239, 68, 68, 0.2)" }}
            >
              <h3
                className="card-title"
                style={{ color: "var(--red)", marginBottom: 8 }}
              >
                Danger Zone
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                Deleting your account will permanently remove all customers,
                orders, and data.
              </p>
              <button
                className="btn btn-ghost"
                style={{
                  color: "var(--red)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
