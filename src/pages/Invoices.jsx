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
  Receipt,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";

const STATUS_CONFIG = {
  unpaid: { color: "var(--amber)", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", icon: Clock },
  paid: { color: "var(--green)", bg: "rgba(37,211,102,0.06)", border: "rgba(37,211,102,0.2)", icon: CheckCircle },
  overdue: { color: "var(--red)", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.2)", icon: X },
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
  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { description: "", qty: 1, price: "" }] }));
  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const subtotal = form.items.reduce((s, it) => s + (Number(it.qty) * Number(it.price) || 0), 0);
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const taxAmt = ((subtotal - discountAmt) * Number(form.tax)) / 100;
  const total = subtotal - discountAmt + taxAmt;

  const handleOrderChange = (orderId) => {
    set("orderId", orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Client *</label>
          <select className="form-select" value={form.customerId} onChange={(e) => set("customerId", e.target.value)} required>
            <option value="">Choose Source</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Link Pipeline</label>
          <select className="form-select" value={form.orderId} onChange={(e) => handleOrderChange(e.target.value)}>
            <option value="">Standalone Doc</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.item} (₦{Number(o.amount).toLocaleString()})</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Your Brand Identity</label>
          <input className="form-input" placeholder="e.g. Studio Ade" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Settlement Deadline</label>
          <input className="form-input" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Line Items Specification *</label>
        <div className="space-y-3">
          {form.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1">
                 <input className="form-input text-xs" placeholder="Service entry" value={item.description} onChange={(e) => setItem(i, "description", e.target.value)} required />
              </div>
              <div className="w-16">
                 <input className="form-input text-xs text-center" type="number" min="1" value={item.qty} onChange={(e) => setItem(i, "qty", e.target.value)} />
              </div>
              <div className="w-24">
                 <input className="form-input text-xs" type="number" placeholder="₦" value={item.price} onChange={(e) => setItem(i, "price", e.target.value)} required />
              </div>
              <button type="button" onClick={() => removeItem(i)} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-0.5">
                <X size={14} />
              </button>
            </div>
          ))}
          <button type="button" className="text-[0.65rem] font-black uppercase tracking-widest text-primary hover:text-white transition-colors" onClick={addItem}>
            + Add Line Specification
          </button>
        </div>
      </div>

      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex justify-between text-xs font-bold text-text-secondary">
          <span>Contract Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        {form.discount > 0 && (
          <div className="flex justify-between text-xs font-black text-red-400">
            <span>Client Discount ({form.discount}%)</span>
            <span>-₦{discountAmt.toLocaleString()}</span>
          </div>
        )}
        <div className="h-px bg-white/5 my-2" />
        <div className="flex justify-between">
          <span className="text-sm font-black text-white">Project Valuation</span>
          <span className="text-xl font-black text-primary tracking-tighter">₦{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" className="btn btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary flex-1">Issue Document</button>
      </div>
    </form>
  );
}

function InvoicePreview({ invoice, customer, onMarkPaid, formatNaira }) {
  const handlePrint = () => window.print();
  const handleCopyLink = () => {
    const text = `📄 *OFFICIAL INVOICE ${invoice.invoiceNumber}*\nFrom: *${invoice.businessName || "Service Provider"}*\nClient: *${customer?.name}*\nDate: ${new Date(invoice.createdAt).toLocaleDateString()}\nTotal Due: *₦${Number(invoice.total).toLocaleString()}*\n----------------------------------------\nGenerated via ClientFlow CRM`.trim();
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fadeInUp">
      <div id="invoice-doc" className="bg-white text-black p-12 md:p-20 rounded-[2.5rem] shadow-3xl mb-8 relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute top-10 right-10 opacity-[0.03] select-none pointer-events-none transform rotate-[-15deg]">
          <Receipt size={300} />
        </div>

        <div className="flex justify-between items-start mb-16 relative z-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase">{invoice.businessName || "MY BRAND"}</h1>
            <p className="text-gray-400 text-[0.65rem] font-bold uppercase tracking-[0.2em]">Transaction Record</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-primary leading-none mb-1">{invoice.invoiceNumber}</h2>
            <p className="text-gray-400 text-[0.65rem] font-bold uppercase tracking-widest">{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16 relative z-10">
          <div>
            <p className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest mb-4">Billed To Identity</p>
            <p className="text-lg font-black">{customer?.name}</p>
            <p className="text-sm font-medium text-gray-500 mt-1">{customer?.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest mb-4">Maturity Date</p>
            <p className="text-lg font-black">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Immediate'}</p>
          </div>
        </div>

        <table className="w-full mb-12 relative z-10">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="bg-transparent border-none text-left p-4 text-[0.65rem] text-gray-400 font-black">DESCRIPTION</th>
              <th className="bg-transparent border-none text-center p-4 text-[0.65rem] text-gray-400 font-black">QTY</th>
              <th className="bg-transparent border-none text-right p-4 text-[0.65rem] text-gray-400 font-black">UNIT</th>
              <th className="bg-transparent border-none text-right p-4 text-[0.65rem] text-gray-400 font-black">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 italic">
                <td className="p-4 font-bold text-sm text-gray-800">{item.description}</td>
                <td className="p-4 text-center font-bold text-sm text-gray-500">{item.qty}</td>
                <td className="p-4 text-right font-bold text-sm text-gray-800">₦{Number(item.price).toLocaleString()}</td>
                <td className="p-4 text-right font-black text-sm text-black">₦{(Number(item.qty) * Number(item.price)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-[300px] relative z-10">
           <div className="flex justify-between items-center mb-2 font-bold text-sm text-gray-500">
             <span>Gross Sum</span>
             <span>₦{Number(invoice.subtotal).toLocaleString()}</span>
           </div>
           {invoice.discount > 0 && <div className="flex justify-between items-center mb-2 font-black text-sm text-red-500"><span>Client Discount</span><span>-₦{((invoice.subtotal * invoice.discount)/100).toLocaleString()}</span></div>}
           <div className="h-px bg-black my-4" />
           <div className="flex justify-between items-center">
             <span className="font-black text-lg">FINAL DUE</span>
             <span className="font-black text-2xl text-primary tracking-tighter">₦{Number(invoice.total).toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <button className="btn btn-secondary h-14" onClick={handleCopyLink}>Copy Lead Link</button>
        <button className="btn btn-secondary h-14" onClick={handlePrint}>Download as PDF</button>
        {invoice.status === 'unpaid' && (
           <button className="btn btn-primary h-14" onClick={() => onMarkPaid(invoice.id)}>Confirm Collection</button>
        )}
      </div>
    </div>
  );
}

export default function Invoices({ store }) {
  const { invoices, customers, orders, addInvoice, updateInvoice, deleteInvoice, getCustomer, formatNaira } = store;
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);

  const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);
  const unpaidVal = invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + Number(i.total), 0);
  const paidVal = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.total), 0);

  const handleMarkPaid = (id) => {
    updateInvoice(id, { status: "paid", paidAt: new Date().toISOString() });
    setModal(null);
    store.toast("Settlement Locked ✅", "success");
  };

  return (
    <div className="p-6 lg:p-12 mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Billing Center</h1>
          <p className="text-text-secondary font-medium tracking-tight">Managing <span className="text-primary font-black">{invoices.length}</span> issued documents.</p>
        </div>
        <button className="btn btn-primary h-12 shadow-xl" onClick={() => {
           if (gate("invoice", "Invoicing is a Pro feature. Upgrade to issue unlimited documents.")) setModal("add");
        }}>
          <Plus size={18} /> Generate New Document
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card group">
            <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Uncollected Revenue</div>
            <div className="text-3xl font-black text-amber-500 tracking-tighter">₦{unpaidVal.toLocaleString()}</div>
        </div>
        <div className="card group">
            <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Verified Revenue</div>
            <div className="text-3xl font-black text-primary tracking-tighter">₦{paidVal.toLocaleString()}</div>
        </div>
        <div className="card group">
            <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Total Documents</div>
            <div className="text-3xl font-black text-white tracking-tighter">{invoices.length}</div>
        </div>
        <div className="card border-primary/20 bg-primary/5 flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <div className="text-right">
              <div className="text-[0.6rem] font-black uppercase tracking-widest text-primary/60">System Status</div>
              <div className="text-xs font-black text-white uppercase tracking-widest">Compliant</div>
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card p-0 overflow-hidden shadow-2xl transition-all duration-500">
        <div className="flex border-b border-white/5 bg-white/[0.01]">
           {["all", "unpaid", "paid"].map(f => (
             <button key={f} className={`px-8 py-5 text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all relative ${filter === f ? 'text-primary' : 'text-text-muted hover:text-text-secondary'}`} onClick={() => setFilter(f)}>
               {f}
               {filter === f && <div className="absolute bottom-0 left-8 right-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,211,102,1)]" />}
             </button>
           ))}
        </div>
        <div className="table-wrap border-none rounded-none">
          <table className="w-full">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Client Identity</th>
                <th>Phase Valuation</th>
                <th>System Status</th>
                <th className="text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const client = getCustomer(inv.customerId);
                const config = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.id} className="group italic border-b border-white/[0.03] last:border-none">
                    <td className="font-extrabold text-primary text-sm tracking-tight">{inv.invoiceNumber}</td>
                    <td className="font-black text-white">{client?.name || 'Unknown Client'}</td>
                    <td className="font-extrabold text-white">{formatNaira(inv.total)}</td>
                    <td>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-widest border" style={{ color: config.color, background: config.bg, borderColor: config.border }}>
                          <config.icon size={12} />
                          {inv.status}
                        </span>
                    </td>
                    <td className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all" onClick={() => setModal({ view: inv })}><Eye size={16} /></button>
                           <button className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all" onClick={() => setModal({ edit: inv })}><Pencil size={16} /></button>
                           <button className="w-10 h-10 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all" onClick={() => setModal({ del: inv })}><Trash2 size={16} /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals Mapping */}
      {modal === "add" && (
        <Modal title="Generate Core Document" onClose={() => setModal(null)}>
          <InvoiceForm customers={customers} orders={orders} invoices={invoices} onSave={(data) => { addInvoice(data); setModal(null); }} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.edit && (
        <Modal title="Modify Legal Data" onClose={() => setModal(null)}>
          <InvoiceForm initial={modal.edit} customers={customers} orders={orders} invoices={invoices} onSave={(data) => { updateInvoice(modal.edit.id, data); setModal(null); }} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.view && (
        <Modal title={modal.view.invoiceNumber} onClose={() => setModal(null)}>
          <InvoicePreview invoice={modal.view} customer={getCustomer(modal.view.customerId)} onMarkPaid={handleMarkPaid} formatNaira={formatNaira} />
        </Modal>
      )}

      {modal?.del && (
        <Modal title="Void Transaction?" onClose={() => setModal(null)}>
          <div className="text-center p-4">
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
             </div>
             <p className="text-base text-text-secondary font-medium leading-relaxed mb-8 px-6">
               Are you certain you want to void document <strong className="text-white">{modal.del.invoiceNumber}</strong>? This cannot be undone.
             </p>
             <div className="flex gap-3">
               <button className="btn btn-secondary flex-1" onClick={() => setModal(null)}>Retain Record</button>
               <button className="btn btn-danger flex-1" onClick={() => { deleteInvoice(modal.del.id); setModal(null); }}>Void permanently</button>
             </div>
          </div>
        </Modal>
      )}

      {upgradeModal && <UpgradeModal reason={upgradeReason} onClose={() => setUpgradeModal(false)} />}
    </div>
  );
}
