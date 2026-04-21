import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Copy,
  MessageSquare,
  Zap,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";

function ReplyForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    content: initial.content || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Shortkey / Title *</label>
          <input
            className="form-input"
            placeholder="e.g. Welcome Message"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Message Content *</label>
          <textarea
            className="form-textarea min-h-[160px]"
            placeholder="What should be sent to the customer..."
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" className="btn btn-secondary flex-1" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary flex-1">
          Save Quick Reply
        </button>
      </div>
    </form>
  );
}

export default function QuickReplies({ store }) {
  const { replies, addReply, updateReply, deleteReply } = store;
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const filtered = replies.filter((r) => {
    if (!r) return false;
    const title = r.title || "";
    const content = r.content || "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      content.toLowerCase().includes(search.toLowerCase())
    );
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    store.toast("Message copied to clipboard ✅");
  };

  return (
    <div className="p-6 lg:p-12 mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Knowledge Base</h1>
          <p className="text-text-secondary font-medium tracking-tight">
            Storing <span className="text-primary font-black">{replies.length}</span> standardized transmission blocks.
          </p>
        </div>
        <button
          className="btn btn-primary h-12 shadow-xl"
          onClick={() => {
            if (gate("reply", `Upgrade for unlimited quick replies.`))
              setModal("add");
          }}
        >
          <Plus size={18} /> New Transmission Block
        </button>
      </div>

      {/* Control Bar */}
      <div className="mb-12 relative group h-14">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
        <input
          className="form-input pl-14 h-full bg-white/[0.01] border-white/5 rounded-2xl"
          placeholder="Search through saved communication templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <div className="py-32 text-center card border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-text-muted mx-auto mb-6">
               <Zap size={32} />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Empty Repository</h3>
            <p className="text-text-secondary font-medium max-w-xs mx-auto">Standardize your responses to save hours of manual typing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div key={r.id} className="card group flex flex-col h-full bg-white/[0.01] hover:bg-white/[0.02]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white" onClick={() => setModal({ edit: r })}>
                      <Pencil size={14} />
                   </button>
                   <button className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10" onClick={() => setModal({ del: r })}>
                      <Trash2 size={14} />
                   </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">{r.title}</h3>
              
              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8 relative group/msg">
                <p className="text-sm font-medium text-text-secondary leading-relaxed line-clamp-4 italic italic">
                  "{r.content}"
                </p>
                <div className="absolute inset-0 bg-bg-surface/80 opacity-0 group-hover/msg:opacity-100 backdrop-blur-sm flex items-center justify-center transition-all rounded-2xl">
                   <button 
                     onClick={() => copyToClipboard(r.content)}
                     className="btn btn-primary h-10 px-6 text-xs text-black font-black"
                   >
                     <Copy size={14} /> Copy Content
                   </button>
                </div>
              </div>

               <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted italic">
                 <span>Template {r.id ? r.id.slice(0,4) : '####'}</span>
                 <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">Ready to transmit</span>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals Mapping */}
      {modal === "add" && (
        <Modal title="Create New Template" onClose={() => setModal(null)}>
          <ReplyForm
            onSave={(data) => {
              addReply(data);
              setModal(null);
            }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.edit && (
        <Modal title="Modify Static Template" onClose={() => setModal(null)}>
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

      {modal?.del && (
        <Modal title="Purge Template?" onClose={() => setModal(null)}>
          <div className="text-center p-4">
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
             </div>
             <p className="text-base text-text-secondary font-medium leading-relaxed mb-8 px-6">
               Are you certain you want to purge <strong className="text-white">{modal.del.title}</strong> from your knowledge base?
             </p>
             <div className="flex gap-3">
               <button className="btn btn-secondary flex-1" onClick={() => setModal(null)}>Cancel</button>
               <button className="btn btn-danger flex-1" onClick={() => { deleteReply(modal.del.id); setModal(null); }}>Purge Forever</button>
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
