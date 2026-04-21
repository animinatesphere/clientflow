import { Circle } from 'lucide-react';

const CONFIG = {
  // Customer Tags
  New:       { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  Returning: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  VIP:       { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  
  // Order Statuses
  Pending:   { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  Paid:      { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  Delivered: { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' },

  // Invoice Statuses
  unpaid:    { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  paid:      { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' },
  overdue:   { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
};

export default function Badge({ label }) {
  const style = CONFIG[label] || CONFIG.New;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[0.65rem] font-black uppercase tracking-widest leading-none ${style.bg} ${style.border} ${style.text}`}>
      <div className={`w-1 h-1 rounded-full bg-current`} />
      {label}
    </span>
  );
}
