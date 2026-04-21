import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MessageCircle,
  Phone,
  Filter,
  UserPlus,
  MoreVertical,
  Calendar,
Users
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Full Name *</label>
          <input
            className="form-input"
            placeholder="e.g. Chidera Okafor"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">WhatsApp Number *</label>
          <input
            className="form-input"
            placeholder="e.g. 08012345678"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Client Category</label>
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
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Private Notes</label>
          <textarea
            className="form-textarea min-h-[120px]"
            placeholder="Any specific preferences or history..."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" className="btn btn-secondary flex-1" onClick={onCancel}>
          Discard
        </button>
        <button type="submit" className="btn btn-primary flex-1">
          Add Lead
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
    if (!c) return false;
    const name = c.name || "";
    const phone = c.phone || "";
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);
    const matchTag = tagFilter === "All" || c.tag === tagFilter;
    return matchSearch && matchTag;
  });

  return (
    <div className="p-6 lg:p-12 mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Customer Base</h1>
          <p className="text-text-secondary font-medium tracking-tight">
            Managing <span className="text-primary font-black">{customers.length}</span> individual relationships.
          </p>
        </div>
        <button
          className="btn btn-primary h-12 shadow-xl"
          onClick={() => {
            if (gate("customer", `Upgrade for unlimited customer management.`))
              setModal("add");
          }}
        >
          <UserPlus size={18} /> Add New Relationship
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            className="form-input pl-12 h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
            placeholder="Search leads by name or phone ledger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-text-muted text-[0.65rem] font-black uppercase tracking-widest mr-2">
            <Filter size={14} /> Filter
          </div>
          {["All", ...TAGS].map((t) => (
            <button
              key={t}
              className={`px-4 h-10 rounded-xl text-xs font-black transition-all ${tagFilter === t 
                ? "bg-primary text-black" 
                : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white"}`}
              onClick={() => setTagFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="card p-0 overflow-hidden shadow-2xl">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-text-muted mx-auto mb-6">
               <Users size={40} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No Leads Found</h3>
            <p className="text-text-secondary max-w-xs mx-auto font-medium">Try adjusting your filters or search terms to find who you're looking for.</p>
          </div>
        ) : (
          <div className="table-wrap border-none">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="min-w-[180px] sm:min-w-[240px]">Client / Identity</th>
                  <th className="min-w-[140px]">Engagement</th>
                  <th className="min-w-[100px]">Tier</th>
                  <th className="min-w-[160px]">Intel</th>
                  <th className="text-right">Manage</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="group">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                           <div className="avatar w-12 h-12 bg-white/5 border-white/10 text-white font-black text-lg">
                             {c.name ? c.name.charAt(0) : '?'}
                           </div>
                           <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-bg-primary shadow-lg" />
                        </div>
                        <div>
                          <div className="text-base font-black text-white leading-tight mb-1 group-hover:text-primary transition-colors">
                            {c.name || "Untitled Lead"}
                          </div>
                          <div className="flex items-center gap-2 text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">
                            <Calendar size={10} /> Joined {new Date(c.createdAt).toLocaleDateString("en-NG", { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        href={c.phone ? waLink(c.phone) : "#"}
                        target={c.phone ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`wa-btn ${!c.phone ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <MessageCircle size={14} />
                        {c.phone || "No Number"}
                      </a>
                    </td>
                    <td>
                      <Badge label={c.tag} />
                    </td>
                    <td className="max-w-[200px]">
                      <div className="text-xs font-medium text-text-secondary border-l border-white/10 pl-3 leading-relaxed truncate group-hover:whitespace-normal transition-all">
                        {c.notes || <span className="opacity-30 italic font-bold uppercase tracking-widest text-[0.5rem]">No Intel Collected</span>}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all"
                          onClick={() => setModal({ edit: c })}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all"
                          onClick={() => setModal({ del: c })}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === "add" && (
        <Modal title="Onboard New Lead" onClose={() => setModal(null)}>
          <CustomerForm
            onSave={(data) => {
              addCustomer(data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.edit && (
        <Modal title="Modify Relationship" onClose={() => setModal(null)}>
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

      {modal?.del && (
        <Modal title="Sever Relationship?" onClose={() => setModal(null)}>
          <div className="text-center p-4">
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
             </div>
             <p className="text-base text-text-secondary font-medium leading-relaxed mb-8 px-6">
               Are you certain you want to delete <strong className="text-white">{modal.del.name}</strong>? All associated history will be permanently erased.
             </p>
             <div className="flex gap-3">
               <button className="btn btn-secondary flex-1" onClick={() => setModal(null)}>Retain</button>
               <button className="btn btn-danger flex-1" onClick={() => { deleteCustomer(modal.del.id); setModal(null); }}>Delete Forever</button>
             </div>
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
