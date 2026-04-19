import { useState } from "react";
import {
  Radio,
  Send,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Copy,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";

const TAGS = ["All", "New", "Returning", "VIP"];

export default function Broadcast({ store }) {
  const { customers, broadcasts, addBroadcast, waLink } = store;
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);
  const [targetTag, setTargetTag] = useState("All");
  const [message, setMessage] = useState("");
  const [isGuidMode, setIsGuidMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentIds, setSentIds] = useState(new Set());

  const recipients =
    targetTag === "All"
      ? customers
      : customers.filter((c) => c.tag === targetTag);

  const handleStartBroadcast = () => {
    if (!message.trim() || recipients.length === 0) return;
    addBroadcast({
      message,
      targetTag,
      recipientCount: recipients.length,
    });
    setIsGuidMode(true);
    setCurrentIndex(0);
    setSentIds(new Set());
  };

  const handleNext = () => {
    if (currentIndex < recipients.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentRecipient = recipients[currentIndex];

  const handleSendCurrent = () => {
    if (!currentRecipient) return;
    setSentIds((prev) => new Set([...prev, currentRecipient.id]));
    const link = waLink(currentRecipient.phone, message);
    window.open(link, "_blank");
  };

  const copyAllNumbers = () => {
    const numbers = recipients.map((r) => r.phone).join(", ");
    navigator.clipboard.writeText(numbers);
    store.toast("All numbers copied for WhatsApp Broadcast List");
  };

  // ── Mode: Guided Wizard ──
  if (isGuidMode) {
    const progress = ((currentIndex + 1) / recipients.length) * 100;
    const isSent = currentRecipient && sentIds.has(currentRecipient.id);

    return (
      <div className="page-content lp-anim-in">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="flex items-center justify-between mb-6">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsGuidMode(false)}
            >
              <X size={16} /> Exit Broadcast
            </button>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--green)",
              }}
            >
              MODE: Guided Broadcast 📡
            </div>
          </div>

          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                <span>
                  Recipient {currentIndex + 1} of {recipients.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "var(--bg-hover)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "var(--green)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* Recipient Details */}
            <div style={{ marginBottom: 32 }}>
              <div
                className="avatar"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: "1.8rem",
                  margin: "0 auto 16px",
                }}
              >
                {currentRecipient?.name.charAt(0)}
              </div>
              <h2
                style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}
              >
                {currentRecipient?.name}
              </h2>
              <div
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  marginBottom: 12,
                }}
              >
                {currentRecipient?.phone}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span
                  className={`badge badge-${currentRecipient?.tag.toLowerCase()}`}
                >
                  {currentRecipient?.tag}
                </span>
              </div>
            </div>

            {/* Message Preview */}
            <div
              style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-md)",
                padding: 20,
                textAlign: "left",
                border: "1px solid var(--border)",
                marginBottom: 32,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                MESSAGE PREVIEW
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </p>
            </div>

            {/* Action */}
            <button
              className={`lp-cta-btn lp-cta-btn--large`}
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleSendCurrent}
            >
              {isSent ? (
                <>
                  <CheckCircle size={20} /> Open Again
                </>
              ) : (
                <>
                  <Send size={20} /> Send to{" "}
                  {currentRecipient?.name.split(" ")[0]}
                </>
              )}
              <div className="lp-cta-shine" />
            </button>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleNext}
                disabled={currentIndex === recipients.length - 1}
              >
                Next Recipient <ChevronRight size={18} />
              </button>
            </div>

            {currentIndex === recipients.length - 1 && (
              <div
                style={{
                  marginTop: 24,
                  fontSize: "0.85rem",
                  color: "var(--green)",
                  fontWeight: 600,
                }}
              >
                ✨ You've reached the end of the list!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Mode: Composition ──
  return (
    <div className="page-content lp-anim-in">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                Broadcast
              </h2>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Send professional bulk updates systematically
              </p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">1. Select Recipients</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={copyAllNumbers}
                title="Copy all numbers for native WhatsApp Broadcast List"
              >
                <Copy size={14} /> Copy Numbers
              </button>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {TAGS.map((t) => (
                <button
                  key={t}
                  className={`filter-chip ${targetTag === t ? "active" : ""}`}
                  onClick={() => setTargetTag(t)}
                >
                  {t === "All"
                    ? `👥 All (${customers.length})`
                    : `${t} (${customers.filter((c) => c.tag === t).length})`}
                </button>
              ))}
            </div>

            <div
              style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {recipients.length} recipients selected
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {recipients.slice(0, 12).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "var(--bg-hover)",
                      borderRadius: 99,
                      padding: "2px 8px",
                      fontSize: "0.72rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {c.name.split(" ")[0]}
                  </div>
                ))}
                {recipients.length > 12 && (
                  <span
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
                  >
                    +{recipients.length - 12} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              2. Compose Message
            </h3>
            <textarea
              className="form-input"
              style={{ minHeight: 160, padding: 16, fontSize: "0.9rem" }}
              placeholder="e.g. Hello [Name]! 👋 We have a special gift for you today..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              <div className="flex items-center gap-1">
                <AlertCircle size={12} /> Personalized tags coming soon
              </div>
              <span>{message.length} chars</span>
            </div>
          </div>

          <button
            className={`lp-cta-btn lp-cta-btn--large ${!message.trim() || recipients.length === 0 ? "disabled" : ""}`}
            style={{
              width: "100%",
              justifyContent: "center",
              opacity: !message.trim() || recipients.length === 0 ? 0.5 : 1,
            }}
            disabled={!message.trim() || recipients.length === 0}
            onClick={() => {
              if (!store.canAdd.broadcast) {
                gate(
                  "broadcast",
                  "Broadcast is a Pro feature. Upgrade to send messages to all your customers at once.",
                );
                return;
              }
              handleStartBroadcast();
            }}
          >
            <Radio size={20} />
            <span>Start Guided Broadcast</span>
            <ArrowRight size={18} />
            <div className="lp-cta-shine" />
          </button>
        </div>

        {/* Sidebar History */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>
            Broadcast History
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {broadcasts.length === 0 ? (
              <div
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                }}
              >
                No history yet
              </div>
            ) : (
              broadcasts.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: 12,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ color: "var(--green)" }}>
                      {b.recipientCount} Recipients
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {new Date(b.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {b.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {upgradeModal && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setUpgradeModal(false)}
        />
      )}
    </div>
  );
}
