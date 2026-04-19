import { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Download,
  Send,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  X,
  Copy,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";
const STATUS_COLORS = {
  unpaid: { color: "var(--amber)", bg: "rgba(245,158,11,0.1)" },
  paid: { color: "var(--green)", bg: "rgba(37,211,102,0.1)" },
  overdue: { color: "var(--red)", bg: "rgba(239,68,68,0.1)" },
};

function generateInvoiceNumber(invoices) {
  const count = invoices.length + 1;
  return `INV-${String(count).padStart(4, "0")}`;
}

function InvoiceForm({
  initial = {},
  customers,
  orders,
  invoices,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({
    customerId: initial.customerId || "",
    orderId: initial.orderId || "",
    businessName: initial.businessName || "",
    businessPhone: initial.businessPhone || "",
    businessEmail: initial.businessEmail || "",
    items: initial.items?.length
      ? initial.items
      : [{ description: "", qty: 1, price: "" }],
    discount: initial.discount || 0,
    tax: initial.tax || 0,
    notes: initial.notes || "",
    dueDate: initial.dueDate || "",
    status: initial.status || "unpaid",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const setItem = (i, k, v) => {
    const items = [...form.items];
    items[i] = { ...items[i], [k]: v };
    setForm((f) => ({ ...f, items }));
  };

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { description: "", qty: 1, price: "" }],
    }));

  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const subtotal = form.items.reduce(
    (s, it) => s + (Number(it.qty) * Number(it.price) || 0),
    0,
  );
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const taxAmt = ((subtotal - discountAmt) * Number(form.tax)) / 100;
  const total = subtotal - discountAmt + taxAmt;

  // Pre-fill items from order
  const handleOrderChange = (orderId) => {
    set("orderId", orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      set("customerId", order.customerId);
      setForm((f) => ({
        ...f,
        orderId,
        customerId: order.customerId,
        items: [{ description: order.item, qty: 1, price: order.amount }],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerId || form.items.length === 0) return;
    onSave({
      ...form,
      invoiceNumber: initial.invoiceNumber || generateInvoiceNumber(invoices),
      subtotal,
      total,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Customer *</label>
          <select
            className="form-select"
            value={form.customerId}
            onChange={(e) => set("customerId", e.target.value)}
            required
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Link to Order (optional)</label>
          <select
            className="form-select"
            value={form.orderId}
            onChange={(e) => handleOrderChange(e.target.value)}
          >
            <option value="">None</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.item} — ₦{Number(o.amount).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
      >
        <div className="form-group">
          <label className="form-label">Your Business Name</label>
          <input
            className="form-input"
            placeholder="Ade Graphics"
            value={form.businessName}
            onChange={(e) => set("businessName", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Business Phone</label>
          <input
            className="form-input"
            placeholder="08012345678"
            value={form.businessPhone}
            onChange={(e) => set("businessPhone", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            className="form-input"
            type="date"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="form-group">
        <label className="form-label">Items *</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {form.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 100px 32px",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                className="form-input"
                placeholder="Description"
                value={item.description}
                onChange={(e) => setItem(i, "description", e.target.value)}
                required
              />
              <input
                className="form-input"
                type="number"
                placeholder="Qty"
                min="1"
                value={item.qty}
                onChange={(e) => setItem(i, "qty", e.target.value)}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Price ₦"
                min="0"
                value={item.price}
                onChange={(e) => setItem(i, "price", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--red)",
                  padding: 4,
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={addItem}
            style={{ alignSelf: "flex-start" }}
          >
            <Plus size={14} /> Add Line Item
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Discount (%)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            max="100"
            value={form.discount}
            onChange={(e) => set("discount", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">VAT / Tax (%)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            max="100"
            value={form.tax}
            onChange={(e) => set("tax", e.target.value)}
          />
        </div>
      </div>

      {/* Totals Preview */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          marginBottom: 16,
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginBottom: 4,
          }}
        >
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString("en-NG")}</span>
        </div>
        {form.discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "var(--red)",
              marginBottom: 4,
            }}
          >
            <span>Discount ({form.discount}%)</span>
            <span>-₦{discountAmt.toLocaleString("en-NG")}</span>
          </div>
        )}
        {form.tax > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginBottom: 4,
            }}
          >
            <span>Tax ({form.tax}%)</span>
            <span>₦{taxAmt.toLocaleString("en-NG")}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "0.95rem",
            borderTop: "1px solid var(--border)",
            paddingTop: 8,
            marginTop: 4,
          }}
        >
          <span>Total</span>
          <span style={{ color: "var(--green)" }}>
            ₦{total.toLocaleString("en-NG")}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-textarea"
          placeholder="e.g. Payment via bank transfer to GTBank 0123456789"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <FileText size={15} /> Create Invoice
        </button>
      </div>
    </form>
  );
}

function InvoicePreview({ invoice, customer, onMarkPaid }) {
  const handlePrint = () => window.print();

  const handleCopyLink = () => {
    const text = `
*INVOICE ${invoice.invoiceNumber}*
${invoice.businessName || "My Business"}
────────────────────
Customer: ${customer?.name}
Date: ${new Date(invoice.createdAt).toLocaleDateString("en-NG")}
${invoice.dueDate ? `Due: ${new Date(invoice.dueDate).toLocaleDateString("en-NG")}` : ""}
────────────────────
${invoice.items.map((i) => `• ${i.description} x${i.qty} = ₦${(Number(i.qty) * Number(i.price)).toLocaleString("en-NG")}`).join("\n")}
────────────────────
${invoice.discount > 0 ? `Discount: -${invoice.discount}%\n` : ""}TOTAL: ₦${Number(invoice.total).toLocaleString("en-NG")}
────────────────────
${invoice.notes || ""}
    `.trim();
    navigator.clipboard.writeText(text);
  };

  const statusStyle = STATUS_COLORS[invoice.status] || STATUS_COLORS.unpaid;

  return (
    <div>
      {/* Invoice Card */}
      <div
        id="invoice-print"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: 28,
          marginBottom: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 4 }}
            >
              {invoice.businessName || "My Business"}
            </h2>
            {invoice.businessPhone && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {invoice.businessPhone}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--green)",
              }}
            >
              {invoice.invoiceNumber}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              {new Date(invoice.createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 6,
                padding: "2px 10px",
                borderRadius: 99,
                fontSize: "0.7rem",
                fontWeight: 700,
                color: statusStyle.color,
                background: statusStyle.bg,
              }}
            >
              {invoice.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div
          style={{
            marginBottom: 20,
            padding: "12px 14px",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              marginBottom: 4,
              textTransform: "uppercase",
            }}
          >
            Bill To
          </div>
          <div style={{ fontWeight: 700 }}>{customer?.name}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {customer?.phone}
          </div>
        </div>

        {/* Items Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 16,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 0",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                DESCRIPTION
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                QTY
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 0",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                PRICE
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 0",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", fontSize: "0.875rem" }}>
                  {item.description}
                </td>
                <td
                  style={{
                    padding: "10px 0",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {item.qty}
                </td>
                <td
                  style={{
                    padding: "10px 0",
                    textAlign: "right",
                    fontSize: "0.875rem",
                  }}
                >
                  ₦{Number(item.price).toLocaleString("en-NG")}
                </td>
                <td
                  style={{
                    padding: "10px 0",
                    textAlign: "right",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  ₦
                  {(Number(item.qty) * Number(item.price)).toLocaleString(
                    "en-NG",
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 40,
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            <span>Subtotal</span>
            <span>₦{Number(invoice.subtotal).toLocaleString("en-NG")}</span>
          </div>
          {invoice.discount > 0 && (
            <div
              style={{
                display: "flex",
                gap: 40,
                fontSize: "0.8rem",
                color: "var(--red)",
              }}
            >
              <span>Discount ({invoice.discount}%)</span>
              <span>
                -₦
                {((invoice.subtotal * invoice.discount) / 100).toLocaleString(
                  "en-NG",
                )}
              </span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div
              style={{
                display: "flex",
                gap: 40,
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              <span>Tax ({invoice.tax}%)</span>
              <span>
                ₦
                {(
                  ((invoice.subtotal -
                    (invoice.subtotal * invoice.discount) / 100) *
                    invoice.tax) /
                  100
                ).toLocaleString("en-NG")}
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 40,
              fontWeight: 800,
              fontSize: "1.05rem",
              borderTop: "2px solid var(--border)",
              paddingTop: 8,
              marginTop: 4,
            }}
          >
            <span>TOTAL</span>
            <span style={{ color: "var(--green)" }}>
              ₦{Number(invoice.total).toLocaleString("en-NG")}
            </span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              borderLeft: "3px solid var(--green)",
            }}
          >
            {invoice.notes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={handleCopyLink}
        >
          <Copy size={14} /> Copy for WhatsApp
        </button>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={handlePrint}
        >
          <Download size={14} /> Print / Save PDF
        </button>
        {invoice.status === "unpaid" && (
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => onMarkPaid(invoice.id)}
          >
            <CheckCircle size={14} /> Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
}

export default function Invoices({ store }) {
  const {
    invoices,
    customers,
    orders,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getCustomer,
    formatNaira,
  } = store;
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);
  const filtered =
    filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((s, i) => s + Number(i.total), 0);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.total), 0);

  const handleMarkPaid = (id) => {
    updateInvoice(id, { status: "paid", paidAt: new Date().toISOString() });
    setModal(null);
    store.toast("Invoice marked as paid!", "success");
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
            Invoices & Receipts
          </h2>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            {invoices.length} total ·{" "}
            {invoices.filter((i) => i.status === "unpaid").length} unpaid
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (
              gate(
                "invoice",
                `Free plan includes 3 invoices. Upgrade to create unlimited invoices.`,
              )
            )
              setModal("add");
          }}
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          className="stat-card"
          style={{
            "--accent": "var(--amber)",
            "--icon-bg": "rgba(245,158,11,0.12)",
          }}
        >
          <div className="stat-card-icon">
            <Clock size={20} color="var(--amber)" />
          </div>
          <div className="stat-card-value" style={{ color: "var(--amber)" }}>
            ₦{totalUnpaid.toLocaleString("en-NG")}
          </div>
          <div className="stat-card-label">Unpaid</div>
        </div>
        <div
          className="stat-card"
          style={{
            "--accent": "var(--green)",
            "--icon-bg": "rgba(37,211,102,0.12)",
          }}
        >
          <div className="stat-card-icon">
            <CheckCircle size={20} color="var(--green)" />
          </div>
          <div className="stat-card-value" style={{ color: "var(--green)" }}>
            ₦{totalPaid.toLocaleString("en-NG")}
          </div>
          <div className="stat-card-label">Collected</div>
        </div>
        <div
          className="stat-card"
          style={{
            "--accent": "var(--blue)",
            "--icon-bg": "rgba(59,130,246,0.12)",
          }}
        >
          <div className="stat-card-icon">
            <FileText size={20} color="var(--blue)" />
          </div>
          <div className="stat-card-value" style={{ color: "var(--blue)" }}>
            {invoices.length}
          </div>
          <div className="stat-card-label">Total Invoices</div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-row" style={{ marginBottom: 16 }}>
        {["all", "unpaid", "paid", "overdue"].map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🧾</div>
            <h3>No invoices yet</h3>
            <p>
              Create your first invoice to start getting paid professionally
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => setModal("add")}
            >
              <Plus size={16} /> New Invoice
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const customer = getCustomer(inv.customerId);
                  const statusStyle =
                    STATUS_COLORS[inv.status] || STATUS_COLORS.unpaid;
                  return (
                    <tr key={inv.id}>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--green)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {inv.invoiceNumber}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            className="avatar"
                            style={{
                              width: 28,
                              height: 28,
                              fontSize: "0.7rem",
                            }}
                          >
                            {customer?.name?.charAt(0) || "?"}
                          </div>
                          <span
                            style={{ fontSize: "0.875rem", fontWeight: 600 }}
                          >
                            {customer?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ₦{Number(inv.total).toLocaleString("en-NG")}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 99,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: statusStyle.color,
                            background: statusStyle.bg,
                          }}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(inv.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="View"
                            onClick={() => setModal({ view: inv })}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Edit"
                            onClick={() => setModal({ edit: inv })}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Delete"
                            style={{ color: "var(--red)" }}
                            onClick={() => setModal({ del: inv })}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modal === "add" && (
        <Modal title="Create Invoice" onClose={() => setModal(null)}>
          <InvoiceForm
            customers={customers}
            orders={orders}
            invoices={invoices}
            onSave={(data) => {
              addInvoice(data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal?.edit && (
        <Modal title="Edit Invoice" onClose={() => setModal(null)}>
          <InvoiceForm
            initial={modal.edit}
            customers={customers}
            orders={orders}
            invoices={invoices}
            onSave={(data) => {
              updateInvoice(modal.edit.id, data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* View Modal */}
      {modal?.view && (
        <Modal
          title={`Invoice ${modal.view.invoiceNumber}`}
          onClose={() => setModal(null)}
        >
          <InvoicePreview
            invoice={modal.view}
            customer={getCustomer(modal.view.customerId)}
            onClose={() => setModal(null)}
            onMarkPaid={handleMarkPaid}
            formatNaira={formatNaira}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {modal?.del && (
        <Modal title="Delete Invoice?" onClose={() => setModal(null)}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Delete invoice{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {modal.del.invoiceNumber}
            </strong>
            ? This cannot be undone.
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
                deleteInvoice(modal.del.id);
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
