import { X, CheckCircle, Zap } from "lucide-react";

const FEATURES = [
  "Unlimited customers",
  "Unlimited orders & invoices",
  "Unlimited quick replies",
  "Broadcast to all customers",
  "Sales analytics & reports",
  "Export to Excel/CSV",
  "Priority support",
];

export default function UpgradeModal({ onClose, reason }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="card lp-anim-in"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 32,
          borderRadius: 24,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(37,211,102,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Zap size={28} color="var(--green)" />
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
            Upgrade to Pro
          </h2>
          {reason && (
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              {reason}
            </p>
          )}
        </div>

        {/* Price */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            padding: "16px 0",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "var(--green)",
            }}
          >
            ₦1,500
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            per month · cancel anytime
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "0.875rem",
              }}
            >
              <CheckCircle size={16} color="var(--green)" />
              <span style={{ color: "var(--text-secondary)" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="lp-cta-btn"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => {
            // Paystack will go here later
            alert(
              "Paystack integration coming soon! For now contact us on WhatsApp to upgrade.",
            );
            onClose();
          }}
        >
          <Zap size={18} /> Upgrade Now — ₦1,500/mo
          <div className="lp-cta-shine" />
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: 12,
          }}
        >
          🔒 Secure payment · Nigerian business · Cancel anytime
        </p>
      </div>
    </div>
  );
}
