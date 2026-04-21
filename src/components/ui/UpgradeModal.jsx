import { X, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

const FEATURES = [
  "Unlimited client relationships",
  "Unlimited transaction ledgers",
  "Unlimited communication templates",
  "Mass Distribution (Broadcast)",
  "Real-time Revenue Intel",
  "Enterprise Data Export",
  "Elite Account Support",
];

export default function UpgradeModal({ onClose, reason }) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-bg-primary/90 backdrop-blur-md animate-in fade-in transition-all duration-500"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card max-w-[480px] w-full p-8 md:p-12 border-primary/20 bg-gradient-to-br from-primary/10 via-bg-card to-bg-card shadow-[0_0_100px_-20px_rgba(37,211,102,0.2)] relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700"
      >
        {/* Glow Element */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(37,211,102,0.4)] mx-auto mb-6 transform hover:rotate-12 transition-transform">
            <Zap size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-3">Upgrade to Elite</h2>
          {reason && (
            <div className="mx-auto max-w-xs p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[0.7rem] font-bold uppercase tracking-widest leading-relaxed">
              {reason}
            </div>
          )}
        </div>

        {/* Pricing Architecture */}
        <div className="text-center mb-10 py-8 border-y border-white/5 bg-white/[0.01]">
          <div className="text-[0.65rem] font-black text-text-muted uppercase tracking-[0.3em] mb-2">Total Monthly Investment</div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black text-white tracking-tighter">₦1,500</span>
            <span className="text-text-muted font-bold">/mo</span>
          </div>
          <p className="text-[0.7rem] font-bold text-text-muted mt-3 italic underline decoration-primary/30 underline-offset-4 pointer-events-none opacity-60">Cancel your subscription at any phase.</p>
        </div>

        {/* Feature Matrix */}
        <div className="space-y-4 mb-10">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm font-medium text-text-secondary group">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-125 transition-transform">
                <CheckCircle2 size={14} />
              </div>
              <span className="group-hover:text-white transition-colors">{f}</span>
            </div>
          ))}
        </div>

        {/* Action Engine */}
        <button
          className="btn btn-primary w-full h-16 text-lg shadow-2xl relative overflow-hidden group mb-6"
          onClick={() => {
            window.open("https://paystack.shop/pay/01et7r1cnq", "_blank");
            onClose();
          }}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <Zap size={20} className="animate-pulse" />
          <span className="font-black uppercase tracking-widest">Authorize Upgrade</span>
          <div className="lp-cta-shine" />
        </button>

        <div className="flex items-center justify-center gap-4 text-[0.6rem] font-black text-text-muted uppercase tracking-widest opacity-60">
           <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> Priority Security</div>
           <div className="w-1 h-1 rounded-full bg-text-muted" />
           <div className="flex items-center gap-1.5">Verified Network</div>
        </div>
      </div>
    </div>
  );
}
