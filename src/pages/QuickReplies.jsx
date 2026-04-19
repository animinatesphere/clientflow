import { useState } from "react";
import { Plus, Copy, Trash2, Pencil, ExternalLink, Check } from "lucide-react";
import Modal from "../components/ui/Modal";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";

function ReplyForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    message: initial.message || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    onSave(form);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Reply Title *</label>
        <input
          className="form-input"
          placeholder="e.g. Order Confirmation"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea
          className="form-textarea"
          placeholder="Write your quick reply here..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          required
          style={{ minHeight: 120 }}
        />
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: 4,
          }}
        >
          {form.message.length} characters · Use [Name], [Amount], [Item] as
          placeholders
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Reply
        </button>
      </div>
    </form>
  );
}

function ReplyCard({ reply, onCopy, onEdit, onDelete, copied }) {
  return (
    <div
      className="card"
      style={{ marginBottom: 12, transition: "transform 0.2s ease" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="card-header" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(37,211,102,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
            }}
          >
            💬
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            {reply.title}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            title="Edit"
            onClick={() => onEdit(reply)}
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            title="Delete"
            style={{ color: "var(--red)" }}
            onClick={() => onDelete(reply)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 14px",
          borderLeft: "3px solid rgba(37,211,102,0.3)",
          marginBottom: 12,
        }}
      >
        {reply.message}
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onCopy(reply)}
          style={{ flex: 1, justifyContent: "center" }}
        >
          {copied === reply.id ? (
            <>
              <Check size={13} style={{ color: "var(--green)" }} /> Copied!
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(reply.message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}
        >
          <ExternalLink size={13} /> Open WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function QuickReplies({ store }) {
  const { replies, addReply, updateReply, deleteReply, toast } = store;
  const [modal, setModal] = useState(null);
  const [copied, setCopied] = useState(null);
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);

  const handleCopy = (reply) => {
    navigator.clipboard.writeText(reply.message).then(() => {
      setCopied(reply.id);
      toast("Message copied to clipboard");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4"
        style={{ flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Quick Replies
          </h2>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            Pre-written messages to save time
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (
              gate(
                "reply",
                `Free plan includes 5 quick replies. Upgrade for unlimited replies.`,
              )
            )
              setModal("add");
          }}
        >
          <Plus size={16} /> New Reply
        </button>
      </div>

      {/* Tip */}
      <div
        style={{
          background: "rgba(37,211,102,0.06)",
          border: "1px solid rgba(37,211,102,0.15)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>💡</span>
        <span>
          Click <strong style={{ color: "var(--text-primary)" }}>Copy</strong>{" "}
          to copy a message, or{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            Open WhatsApp
          </strong>{" "}
          to send it directly. Use{" "}
          <code
            style={{
              background: "var(--bg-hover)",
              padding: "1px 5px",
              borderRadius: 4,
            }}
          >
            [Name]
          </code>{" "}
          as a placeholder for the customer's name.
        </span>
      </div>

      {/* Replies Grid */}
      {replies.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>No quick replies yet</h3>
            <p>Create your first template to save time when replying</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => setModal("add")}
            >
              <Plus size={16} /> Add Reply
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 0,
          }}
        >
          {replies.map((r) => (
            <ReplyCard
              key={r.id}
              reply={r}
              copied={copied}
              onCopy={handleCopy}
              onEdit={(r) => setModal({ edit: r })}
              onDelete={(r) => setModal({ del: r })}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {modal === "add" && (
        <Modal title="New Quick Reply" onClose={() => setModal(null)}>
          <ReplyForm
            onSave={(data) => {
              addReply(data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal?.edit && (
        <Modal title="Edit Reply" onClose={() => setModal(null)}>
          <ReplyForm
            initial={modal.edit}
            onSave={(data) => {
              updateReply(modal.edit.id, data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {modal?.del && (
        <Modal title="Delete Reply?" onClose={() => setModal(null)}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Delete the reply{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {modal.del.title}
            </strong>
            ?
          </p>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteReply(modal.del.id);
                setModal(null);
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Modal>
      )}
      {upgradeModal && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setUpgradeModal(false)}
        />
      )}
    </div>
  );
}
