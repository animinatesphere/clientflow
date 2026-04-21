import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, footer, maxWidth = "max-w-lg" }) {
  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-bg-primary/80 backdrop-blur-md transition-all duration-500 animate-in fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`card w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-white/10 animate-in slide-in-from-bottom-4 duration-500`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
          <h2 className="text-xl font-black text-white tracking-tighter">{title}</h2>
          <button 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
