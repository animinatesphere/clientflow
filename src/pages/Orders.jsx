import { useState } from 'react';
import { Plus, Trash2, Pencil, MessageCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const STATUSES = ['Pending', 'Paid', 'Delivered'];

const COL_COLORS = {
  Pending:   { accent: 'var(--amber)', bg: 'rgba(245,158,11,0.08)', dot: '🟠' },
  Paid:      { accent: 'var(--blue)',  bg: 'rgba(59,130,246,0.08)', dot: '🔵' },
  Delivered: { accent: 'var(--green)', bg: 'rgba(37,211,102,0.08)', dot: '🟢' },
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Customer *</label>
        <select className="form-select" value={form.customerId} onChange={e => set('customerId', e.target.value)} required>
          {customers.length === 0
            ? <option value="">No customers yet — add one first</option>
            : customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)
          }
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Item / Service *</label>
        <input className="form-input" placeholder="e.g. Logo Design, 5 Flyers" value={form.item} onChange={e => set('item', e.target.value)} required />
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Amount (₦) *</label>
          <input className="form-input" type="number" placeholder="0" min="0" value={form.amount} onChange={e => set('amount', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Order</button>
      </div>
    </form>
  );
}

function KanbanCard({ order, customer, formatNaira, waLink, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="kanban-card">
      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 6 }}>
        {order.item}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div className="avatar" style={{ width: 24, height: 24, fontSize: '0.6rem' }}>
          {customer?.name?.charAt(0) || '?'}
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{customer?.name || 'Unknown'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          {formatNaira(order.amount)}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      {/* Status change */}
      <select
        className="form-select"
        value={order.status}
        onChange={e => onStatusChange(order.id, { status: e.target.value })}
        style={{ fontSize: '0.75rem', padding: '5px 10px', marginBottom: 10 }}
      >
        {STATUSES.map(s => <option key={s}>{s}</option>)}
      </select>
      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {customer && (
          <a href={waLink(customer.phone)} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{ flex: 1, justifyContent: 'center' }}>
            <MessageCircle size={12} /> Chat
          </a>
        )}
        <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => onEdit(order)}>
          <Pencil size={13} />
        </button>
        <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: 'var(--red)' }} onClick={() => onDelete(order)}>
          <Trash2 size={13} />
        </button>
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
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Orders</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Kanban */}
      <div className="kanban-grid">
        {STATUSES.map(status => {
          const col = COL_COLORS[status];
          const colOrders = orders.filter(o => o.status === status);
          return (
            <div
              key={status}
              className="kanban-col"
              style={{ background: col.bg, borderColor: `${col.accent}22` }}
            >
              <div className="kanban-col-header">
                <div className="kanban-col-title" style={{ color: col.accent }}>
                  {col.dot} {status}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {formatNaira(colRevenue(status))}
                  </span>
                  <span style={{
                    background: col.accent,
                    color: '#000',
                    borderRadius: 99,
                    width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.68rem', fontWeight: 700,
                  }}>
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {colOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No {status.toLowerCase()} orders
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
          );
        })}
      </div>

      {/* Add Modal */}
      {modal === 'add' && (
        <Modal title="New Order" onClose={() => setModal(null)}>
          <OrderForm
            customers={customers}
            onSave={data => { addOrder(data); setModal(null); }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal?.edit && (
        <Modal title="Edit Order" onClose={() => setModal(null)}>
          <OrderForm
            initial={modal.edit}
            customers={customers}
            onSave={data => { updateOrder(modal.edit.id, data); setModal(null); }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {modal?.del && (
        <Modal title="Delete Order?" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Delete order <strong style={{ color: 'var(--text-primary)' }}>{modal.del.item}</strong>? This cannot be undone.
          </p>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => { deleteOrder(modal.del.id); setModal(null); }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
