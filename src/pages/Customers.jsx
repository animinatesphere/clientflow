import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MessageCircle,
  Phone,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";

const TAGS = ["New", "Returning", "VIP"];

function CustomerForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    phone: initial.phone || "",
    tag: initial.tag || "New",
    notes: initial.notes || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          className="form-input"
          placeholder="e.g. Chidera Okafor"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">WhatsApp Number *</label>
        <input
          className="form-input"
          placeholder="e.g. 08012345678"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Customer Tag</label>
        <select
          className="form-select"
          value={form.tag}
          onChange={(e) => set("tag", e.target.value)}
        >
          {TAGS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-textarea"
          placeholder="Any notes about this customer..."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Customer
        </button>
      </div>
    </form>
  );
}

export default function Customers({ store }) {
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);
  const { customers, addCustomer, updateCustomer, deleteCustomer, waLink } =
    store;

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [modal, setModal] = useState(null); // 'add' | { edit: customer } | { del: customer }

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchTag = tagFilter === "All" || c.tag === tagFilter;
    return matchSearch && matchTag;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4"
        style={{ flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Customers</h2>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            {customers.length} total customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (
              gate(
                "customer",
                `You've reached the 20 customer limit on the free plan. Upgrade to add unlimited customers.`,
              )
            )
              setModal("add");
          }}
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <div className="search-bar" style={{ maxWidth: 280 }}>
          <Search className="search-bar-icon" />
          <input
            className="form-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search name or number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {["All", ...TAGS].map((t) => (
          <button
            key={t}
            className={`filter-chip ${tagFilter === t ? "active" : ""}`}
            onClick={() => setTagFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>
              {search || tagFilter !== "All"
                ? "No customers match your filter"
                : "No customers yet"}
            </h3>
            <p>
              {search || tagFilter !== "All"
                ? "Try a different search or tag"
                : "Add your first customer to get started"}
            </p>
            {!search && tagFilter === "All" && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => setModal("add")}
              >
                <Plus size={16} /> Add Customer
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Tag</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="avatar"
                          style={{ width: 32, height: 32, fontSize: "0.75rem" }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {c.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {new Date(c.createdAt).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href={waLink(c.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-btn"
                      >
                        <MessageCircle size={13} />
                        {c.phone}
                      </a>
                    </td>
                    <td>
                      <Badge label={c.tag} />
                    </td>
                    <td
                      style={{
                        maxWidth: 200,
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {c.notes || (
                        <span style={{ fontStyle: "italic", opacity: 0.5 }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Edit"
                          onClick={() => setModal({ edit: c })}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Delete"
                          style={{ color: "var(--red)" }}
                          onClick={() => setModal({ del: c })}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modal === "add" && (
        <Modal title="Add New Customer" onClose={() => setModal(null)}>
          <CustomerForm
            onSave={(data) => {
              addCustomer(data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal?.edit && (
        <Modal title="Edit Customer" onClose={() => setModal(null)}>
          <CustomerForm
            initial={modal.edit}
            onSave={(data) => {
              updateCustomer(modal.edit.id, data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {modal?.del && (
        <Modal title="Delete Customer?" onClose={() => setModal(null)}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {modal.del.name}
            </strong>
            ? This will also remove all their orders.
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
                deleteCustomer(modal.del.id);
                setModal(null);
              }}
            >
              <Trash2 size={15} /> Delete
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
