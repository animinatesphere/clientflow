import { useState } from 'react';
import { Plus, Trash2, Pencil, MessageCircle, GripVertical, ShoppingBag, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const STATUSES = ['Pending', 'Paid', 'Delivered'];

const COL_CONFIG = {
  Pending: { 
    accent: '#f59e0b', 
    bg: 'rgba(245,158,11,0.03)', 
    border: 'rgba(245,158,11,0.1)',
    icon: Clock
  },
  Paid: { 
    accent: '#3b82f6', 
    bg: 'rgba(59,130,246,0.03)', 
    border: 'rgba(59,130,246,0.1)',
    icon: ArrowUpRight
  },
  Delivered: { 
    accent: '#25D366', 
    bg: 'rgba(37,211,102,0.03)', 
    border: 'rgba(37,211,102,0.1)',
    icon: CheckCircle2
  },
};

function OrderForm({ initial = {}, customers, onSave, onCancel }) {
  const [form, setForm] = useState({
    customerId: initial.customerId || (customers[0]?.id || ''),
    item:       initial.item || '',
    amount:     initial.amount || '',
    status:     initial.status || 'Pending',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerId || !form.item.trim() || !form.amount) return;
    onSave({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Client Source *</label>
          <select className="form-select" value={form.customerId} onChange={e => set('customerId', e.target.value)} required>
            {customers.length === 0
              ? <option value="">No clients found — onboard one first</option>
              : customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)
            }
          </select>
        </div>
        <div className="form-group">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Project / Service Description *</label>
          <input className="form-input" placeholder="e.g. Graphic Design Masterclass" value={form.item} onChange={e => set('item', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">Valuation (₦) *</label>
            <input className="form-input" type="number" placeholder="0" min="0" value={form.amount} onChange={e => set('amount', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1 mb-2 block">System Phase</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" className="btn btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary flex-1">Initialize Order</button>
      </div>
    </form>
  );
}

function KanbanCard({ order, customer, formatNaira, waLink, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-white/10 hover:text-white cursor-pointer transition-colors" onClick={() => onEdit(order)}>
           <Pencil size={14} />
         </div>
      </div>
      
      <div className="flex gap-4">
        <div className="pt-1.5 text-text-muted/40 cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-white mb-4 pr-6 leading-relaxed truncate group-hover:whitespace-normal">
            {order.item}
          </h4>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="avatar w-6 h-6 text-[0.6rem] bg-bg-surface border-white/5">
              {customer?.name?.charAt(0) || '?'}
            </div>
            <span className="text-xs font-bold text-text-secondary truncate">{customer?.name || 'Unknown Client'}</span>
          </div>
          
          <div className="flex items-end justify-between gap-4 pt-4 border-t border-white/[0.03]">
             <div>
                <div className="text-[0.6rem] font-black text-text-muted uppercase tracking-widest mb-1">Contract Value</div>
                <div className="text-lg font-black text-primary">{formatNaira(order.amount)}</div>
             </div>
             
             <div className="flex gap-1">
               <a href={waLink(customer?.phone || '')} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#25D36610] text-[#25D366] hover:bg-[#25D36620] transition-colors">
                  <MessageCircle size={14} />
               </a>
               <button className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors" onClick={() => onDelete(order)}>
                  <Trash2 size={14} />
               </button>
             </div>
          </div>
          
          <div className="mt-4">
            <select
              className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[0.7rem] font-black uppercase tracking-widest text-text-secondary focus:ring-0 transition-colors"
              value={order.status}
              onChange={e => onStatusChange(order.id, { status: e.target.value })}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders({ store }) {
  const { orders, customers, addOrder, updateOrder, deleteOrder, getCustomer, formatNaira, waLink } = store;
  const [modal, setModal] = useState(null);

  const colRevenue = (status) =>
    orders.filter(o => o.status === status).reduce((s, o) => s + (Number(o.amount) || 0), 0);

  return (
    <div className="p-6 lg:p-12 mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Order Ledger</h1>
          <p className="text-text-secondary font-medium tracking-tight">
            Tracking <span className="text-primary font-black">{orders.length}</span> active pipelines.
          </p>
        </div>
        <button className="btn btn-primary h-12 shadow-xl" onClick={() => setModal('add')}>
          <Plus size={18} /> Log New Transaction
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {STATUSES.map(status => {
          const config = COL_CONFIG[status];
          const Icon = config.icon;
          const colOrders = orders.filter(o => o.status === status);
          return (
            <div
              key={status}
              className="flex flex-col min-h-[500px] h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.01]" style={{ color: config.accent }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{status}</h3>
                    <p className="text-[0.65rem] font-bold text-text-muted mt-0.5">{colOrders.length} {colOrders.length === 1 ? 'Project' : 'Projects'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">Col Revenue</div>
                  <div className="text-lg font-black text-white">{formatNaira(colRevenue(status))}</div>
                </div>
              </div>

              {/* Kanban Column */}
              <div 
                className="flex-1 p-4 rounded-[2rem] border border-white/[0.04] space-y-4"
                style={{ background: `linear-gradient(180deg, ${config.bg} 0%, transparent 100%)` }}
              >
                {colOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center opacity-40">
                     <ShoppingBag size={40} className="text-text-muted mb-4" />
                     <p className="text-xs font-black uppercase tracking-widest text-text-muted">No Pipeline Data</p>
                  </div>
                ) : (
                  colOrders.map(order => (
                    <KanbanCard
                      key={order.id}
                      order={order}
                      customer={getCustomer(order.customerId)}
                      formatNaira={formatNaira}
                      waLink={waLink}
                      onEdit={o => setModal({ edit: o })}
                      onDelete={o => setModal({ del: o })}
                      onStatusChange={updateOrder}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {modal === 'add' && (
        <Modal title="Initialize Transaction" onClose={() => setModal(null)}>
          <OrderForm
            customers={customers}
            onSave={data => { addOrder(data); setModal(null); }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.edit && (
        <Modal title="Modify Project Data" onClose={() => setModal(null)}>
          <OrderForm
            initial={modal.edit}
            customers={customers}
            onSave={data => { updateOrder(modal.edit.id, data); setModal(null); }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.del && (
        <Modal title="Discard Pipeline?" onClose={() => setModal(null)}>
          <div className="text-center p-4">
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
             </div>
             <p className="text-base text-text-secondary font-medium leading-relaxed mb-8 px-6">
               Are you certain you want to delete the order for <strong className="text-white">{modal.del.item}</strong>? This data will be purged.
             </p>
             <div className="flex gap-3">
               <button className="btn btn-secondary flex-1" onClick={() => setModal(null)}>Retain</button>
               <button className="btn btn-danger flex-1" onClick={() => { deleteOrder(modal.del.id); setModal(null); }}>Discard permanently</button>
             </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
