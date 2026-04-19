import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Radio,
  Plus,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import UpgradeModal from "../components/ui/UpgradeModal";
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  iconBg,
  change,
  prefix = "",
}) {
  return (
    <div
      className="stat-card"
      style={{ "--accent": accent, "--icon-bg": iconBg }}
    >
      <div className="stat-card-icon">
        <Icon size={20} color={accent} />
      </div>
      <div className="stat-card-value" style={{ color: accent }}>
        {prefix}
        {typeof value === "number" ? value.toLocaleString("en-NG") : value}
      </div>
      <div className="stat-card-label">{label}</div>
      {change && <div className="stat-card-change">{change}</div>}
    </div>
  );
}

export default function Dashboard({ store }) {
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { stats, customers, orders, getCustomer, formatNaira } = store;

  const recentOrders = orders.slice(0, 5);
  const recentCustomers = customers.slice(0, 4);

  return (
    <div className="page-content">
      {/* Stat Grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          accent="var(--green)"
          iconBg="rgba(37,211,102,0.12)"
          change="↑ Growing steadily"
        />
        <StatCard
          label="Active Orders"
          value={stats.activeOrders}
          icon={ShoppingBag}
          accent="var(--amber)"
          iconBg="rgba(245,158,11,0.12)"
          change={
            stats.activeOrders > 0
              ? `${stats.activeOrders} need attention`
              : "All clear!"
          }
        />
        <StatCard
          label="Revenue Earned"
          value={stats.revenue}
          prefix="₦"
          icon={TrendingUp}
          accent="var(--blue)"
          iconBg="rgba(59,130,246,0.12)"
          change="From delivered orders"
        />
        <StatCard
          label="Broadcasts Sent"
          value={stats.broadcastsSent}
          icon={Radio}
          accent="var(--purple)"
          iconBg="rgba(139,92,246,0.12)"
          change="Total messages sent"
        />
      </div>
      {store.plan === "free" && (
        <div
          className="card mb-4"
          style={{
            border: "1px solid rgba(245,158,11,0.2)",
            background: "rgba(245,158,11,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3 className="card-title" style={{ color: "var(--amber)" }}>
              Free Plan Usage
            </h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowUpgrade(true)}
            >
              Upgrade ↗
            </button>
          </div>
          {[
            { label: "Customers", used: store.customers.length, max: 20 },
            { label: "Invoices", used: store.invoices.length, max: 3 },
            { label: "Replies", used: store.replies.length, max: 5 },
          ].map(({ label, used, max }) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: used >= max ? "var(--red)" : "var(--text-muted)",
                  }}
                >
                  {used} / {max}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "var(--bg-hover)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min((used / max) * 100, 100)}%`,
                    height: "100%",
                    background:
                      used >= max
                        ? "var(--red)"
                        : used / max > 0.7
                          ? "var(--amber)"
                          : "var(--green)",
                    borderRadius: 99,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Quick Actions */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/customers")}
          >
            <Plus size={16} /> Add Customer
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/orders")}
          >
            <ShoppingBag size={16} /> New Order
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/broadcast")}
          >
            <Radio size={16} /> Send Broadcast
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/quick-replies")}
          >
            <MessageCircle size={16} /> Quick Replies
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <Link
              to="/orders"
              className="btn btn-ghost btn-sm"
              style={{ textDecoration: "none" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <p>No orders yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentOrders.map((order) => {
                const customer = getCustomer(order.customerId);
                return (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      background: "var(--bg-surface)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {order.item}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: 2,
                        }}
                      >
                        {customer?.name || "Unknown"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginLeft: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatNaira(order.amount)}
                      </span>
                      <Badge label={order.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Customers</h3>
            <Link
              to="/customers"
              className="btn btn-ghost btn-sm"
              style={{ textDecoration: "none" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentCustomers.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <p>No customers yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentCustomers.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="avatar">{c.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {c.phone}
                    </div>
                  </div>
                  <Badge label={c.tag} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp tip banner */}
      <div
        style={{
          marginTop: 16,
          background:
            "linear-gradient(135deg, rgba(37,211,102,0.1), rgba(37,211,102,0.03))",
          border: "1px solid rgba(37,211,102,0.2)",
          borderRadius: "var(--radius-lg)",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: "1.8rem" }}>💡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>
            Pro Tip
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Click any customer's phone number to chat with them instantly on
            WhatsApp. Use <strong>Quick Replies</strong> to save time with
            pre-written messages.
          </div>
        </div>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
