const TAG_MAP = {
  New:       'badge-new',
  Returning: 'badge-returning',
  VIP:       'badge-vip',
  Pending:   'badge-pending',
  Paid:      'badge-paid',
  Delivered: 'badge-delivered',
};

const TAG_DOTS = {
  New:       '🔵',
  Returning: '🟢',
  VIP:       '🟡',
  Pending:   '🟠',
  Paid:      '🔵',
  Delivered: '🟢',
};

export default function Badge({ label }) {
  return (
    <span className={`badge ${TAG_MAP[label] || 'badge-new'}`}>
      {TAG_DOTS[label]} {label}
    </span>
  );
}
