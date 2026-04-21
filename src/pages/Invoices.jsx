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
import Logo from "../components/ui/Logo";

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
    const text = `📄 *OFFICIAL TAX INVOICE ${invoice.invoiceNumber}*\nFrom: *${invoice.businessName || "Service Provider"}*\nClient: *${customer?.name}*\nTotal: *${formatNaira(invoice.total)}*\n----------------------------------------\nGenerated via ClientFlow Business Suite`.trim();
    navigator.clipboard.writeText(text);
  };

  const isPaid = invoice.status === 'paid';

  return (
    <div className="fadeInUp">
      <div id="invoice-doc" className="bg-white text-black p-10 md:p-14 lg:p-20 rounded-none shadow-3xl mb-8 relative overflow-hidden border border-gray-200">
        {/* Enterprise Header */}
        <div className="flex justify-between items-start mb-14">
          <div className="flex items-center gap-4">
             <Logo size={60} />
             <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">{invoice.businessName || "Registered Business"}</h1>
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{invoice.businessEmail || "Official Document #"+invoice.invoiceNumber}</p>
             </div>
          </div>
          <div className="text-right">
             <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">TAX INVOICE</h2>
             <div className="inline-flex gap-2 items-center bg-gray-50 px-3 py-1 border border-gray-100 rounded">
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Document ID</span>
                <span className="text-xs font-black text-primary">{invoice.invoiceNumber}</span>
             </div>
          </div>
        </div>

        {/* Global Metadata Bar */}
        <div className="grid grid-cols-3 gap-0 border-y border-gray-900 mb-14">
           <div className="p-4 border-r border-gray-100">
              <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
              <p className="text-sm font-black">{new Date(invoice.createdAt).toLocaleDateString()}</p>
           </div>
           <div className="p-4 border-r border-gray-100">
              <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
              <p className="text-sm font-black">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Immediate'}</p>
           </div>
           <div className="p-4 bg-gray-50/50">
              <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className={`text-sm font-black uppercase ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>{invoice.status}</p>
           </div>
        </div>

        {/* Parties Section */}
        <div className="grid grid-cols-2 gap-20 mb-14">
           <div>
              <p className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest mb-4">Issuer Particulars</p>
              <h3 className="text-lg font-black text-gray-900 mb-1">{invoice.businessName || "Primary Provider"}</h3>
              <p className="text-sm font-medium text-gray-500">{invoice.businessPhone || "Contact detail pending"}</p>
              <p className="text-sm font-medium text-gray-500">{invoice.businessEmail || "billing@clientflow.io"}</p>
           </div>
           <div>
              <p className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest mb-4">Recipient Identity</p>
              <h3 className="text-lg font-black text-gray-900 mb-1">{customer?.name || "Client Name"}</h3>
              <p className="text-sm font-medium text-gray-500">{customer?.phone}</p>
              <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                 <p className="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em]">Billed To</p>
              </div>
           </div>
        </div>

        {/* Items Table */}
        <div className="mb-14 overflow-x-auto">
           <table className="w-full border-collapse">
              <thead>
                 <tr className="bg-gray-900 text-white">
                    <th className="text-left p-4 text-[0.65rem] font-black uppercase tracking-widest">Service Description</th>
                    <th className="text-center p-4 text-[0.65rem] font-black uppercase tracking-widest w-24">Qty</th>
                    <th className="text-right p-4 text-[0.65rem] font-black uppercase tracking-widest w-32">Unit Rate</th>
                    <th className="text-right p-4 text-[0.65rem] font-black uppercase tracking-widest w-32">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
                 {invoice.items.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                       <td className="p-4 font-bold text-sm text-gray-800">{item.description}</td>
                       <td className="p-4 text-center font-bold text-sm text-gray-500">{item.qty}</td>
                       <td className="p-4 text-right font-mono text-sm text-gray-800 font-bold">{formatNaira(item.price)}</td>
                       <td className="p-4 text-right font-mono text-sm text-black font-black">{formatNaira(Number(item.qty) * Number(item.price))}</td>
                    </tr>
                 ))}
                 {/* Empty rows to fill space */}
                 {[...Array(Math.max(0, 3 - invoice.items.length))].map((_, i) => (
                    <tr key={`empty-${i}`} className="h-12"><td colSpan="4"></td></tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Totals & Terms */}
        <div className="grid grid-cols-2 gap-20 mb-14">
           <div className="space-y-6">
              <div>
                 <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest mb-4">Settlement Details</p>
                 <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-y-2 text-[0.65rem]">
                       <span className="font-bold text-gray-400 uppercase">Bank:</span>
                       <span className="font-black text-gray-900">PROCEEDING BANK PLC</span>
                       <span className="font-bold text-gray-400 uppercase">Account:</span>
                       <span className="font-black text-gray-900">0123456789</span>
                       <span className="font-bold text-gray-400 uppercase">Name:</span>
                       <span className="font-black text-gray-900">{invoice.businessName || "Studio Ade"}</span>
                    </div>
                 </div>
              </div>
              <p className="text-[0.65rem] text-gray-400 font-medium italic leading-relaxed">
                 Notes: Please include Invoice ID as reference for bank transfers. All payments should be made strictly to the account details provided above.
              </p>
           </div>
           <div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Valuation Subtotal</span>
                    <span className="font-mono">{formatNaira(invoice.subtotal)}</span>
                 </div>
                 {invoice.discount > 0 && (
                    <div className="flex justify-between items-center text-sm font-black text-red-500">
                       <span>Corporate Discount ({invoice.discount}%)</span>
                       <span className="font-mono">-{formatNaira((invoice.subtotal * invoice.discount)/100)}</span>
                    </div>
                 )}
                 <div className="h-px bg-gray-100 my-2" />
                 <div className="bg-gray-900 text-white p-6 rounded-xl flex justify-between items-center">
                    <div>
                       <span className="block text-[0.6rem] font-black text-white/50 uppercase tracking-widest mb-1">Total Amount Due</span>
                       <span className="text-3xl font-black tracking-tighter">{formatNaira(invoice.total)}</span>
                    </div>
                    <Receipt size={32} className="opacity-20 translate-x-2" />
                 </div>
              </div>
           </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-20 pt-10 border-t border-gray-100">
           <div>
              <p className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest mb-1">Generated Via</p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-tight">ClientFlow Business Suite v2.4</p>
           </div>
           <div className="text-right">
              <div className="w-48 border-b-2 border-gray-900 mb-2" />
              <p className="text-[0.6rem] font-black text-gray-900 uppercase tracking-widest">Authorized Signatory</p>
           </div>
        </div>

        {/* RUBBER STAMP PAID */}
        {isPaid && (
          <div className="absolute top-[60%] right-[10%] rotate-[-25deg] pointer-events-none select-none">
             <div className="border-[6px] border-green-600 px-10 py-4 rounded-2xl flex flex-col items-center justify-center opacity-70">
                <p className="text-6xl font-black text-green-600 tracking-tighter uppercase mb-1">PAID</p>
                <p className="text-[0.6rem] font-black text-green-600 uppercase tracking-[0.4em] leading-none">Verified Record</p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button className="btn btn-secondary h-14 group" onClick={handleCopyLink}>
           <Copy size={18} className="group-hover:scale-110 transition-transform" />
           Copy Transmission Link
        </button>
        <button className="btn btn-secondary h-14 group" onClick={handlePrint}>
           <Download size={18} className="group-hover:scale-110 transition-transform" />
           Export PDF Document
        </button>
        {invoice.status === 'unpaid' && (
           <button className="btn btn-primary h-14" onClick={() => onMarkPaid(invoice.id)}>
              <CheckCircle size={18} />
              Confirm Collection
           </button>
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
        <Modal title={modal.view.invoiceNumber} onClose={() => setModal(null)} maxWidth="max-w-4xl">
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
