import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={16} color="var(--green)" />,
  error:   <AlertCircle size={16} color="var(--red)" />,
  info:    <Info size={16} color="var(--blue)" />,
};

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {ICONS[t.type]}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
