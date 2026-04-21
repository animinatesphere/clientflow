import { useState } from "react";
import {
  Radio,
  Send,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Copy,
  AlertCircle,
  X,
  ArrowRight,
  MessageSquare,
  Zap,
} from "lucide-react";
import UpgradeModal from "../components/ui/UpgradeModal";
import { usePlan } from "../hooks/usePlan";

const TAGS = ["All", "New", "Returning", "VIP"];

export default function Broadcast({ store }) {
  const { customers, broadcasts, addBroadcast, waLink } = store;
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);
  const [targetTag, setTargetTag] = useState("All");
  const [message, setMessage] = useState("");
  const [isGuidMode, setIsGuidMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentIds, setSentIds] = useState(new Set());

  const recipients =
    targetTag === "All"
      ? customers
      : customers.filter((c) => c.tag === targetTag);

  const handleStartBroadcast = () => {
    if (!message.trim() || recipients.length === 0) return;
    addBroadcast({
      message,
      targetTag,
      recipientCount: recipients.length,
    });
    setIsGuidMode(true);
    setCurrentIndex(0);
    setSentIds(new Set());
  };

  const handleNext = () => {
    if (currentIndex < recipients.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentRecipient = recipients[currentIndex];

  const handleSendCurrent = () => {
    if (!currentRecipient) return;
    setSentIds((prev) => new Set([...prev, currentRecipient.id]));
    const link = waLink(currentRecipient.phone, message);
    window.open(link, "_blank");
  };

  const copyAllNumbers = () => {
    const numbers = recipients.map((r) => r.phone).join(", ");
    navigator.clipboard.writeText(numbers);
    store.toast("Broadcasting pool copied to clipboard ✅");
  };

  // ── Mode: Mission Control (Guided Wizard) ──
  if (isGuidMode) {
    const progress = ((currentIndex + 1) / recipients.length) * 100;
    const isSent = currentRecipient && sentIds.has(currentRecipient.id);

    return (
      <div className="p-6 lg:p-12 mt-20 max-w-4xl mx-auto fadeInUp">
        <div className="flex items-center justify-between mb-12">
            <button
              className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
              onClick={() => setIsGuidMode(false)}
            >
              <X size={16} /> Abort Mission
            </button>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
               <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </div>
               <span className="text-[0.65rem] font-black text-primary uppercase tracking-widest leading-none">Guided Broadcast Active</span>
            </div>
        </div>

        <div className="card p-12 bg-white/[0.01] border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            {/* Progress Visualization */}
            <div className="mb-16">
               <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Transmission Progress</div>
                    <div className="text-3xl font-black text-white">{currentIndex + 1}<span className="text-text-muted text-xl font-bold"> / {recipients.length}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">{Math.round(progress)}%</div>
                  </div>
               </div>
               <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-primary shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-700 ease-out" 
                    style={{ width: `${progress}%` }} 
                  />
               </div>
            </div>

            {/* Current Recipient Profile */}
            <div className="flex flex-col items-center text-center mb-16">
               <div className="relative mb-6">
                  <div className="avatar w-24 h-24 text-2xl border-white/10 bg-gradient-to-tr from-white/5 to-transparent text-white font-black shadow-2xl">
                    {currentRecipient?.name.charAt(0)}
                  </div>
                  {isSent && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-xl animate-bounce">
                      <CheckCircle size={16} />
                    </div>
                  )}
               </div>
               <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{currentRecipient?.name}</h2>
               <div className="flex items-center gap-3">
                  <span className="text-text-secondary font-bold tracking-tight">{currentRecipient?.phone}</span>
                  <Badge label={currentRecipient?.tag} />
               </div>
            </div>

            {/* Message Preview Interface */}
            <div className="bg-bg-surface/50 border border-white/5 rounded-[2rem] p-8 mb-16 relative group">
               <div className="absolute -top-3 left-8 px-4 py-1 bg-bg-surface border border-white/10 rounded-full text-[0.6rem] font-black text-text-muted uppercase tracking-widest mb-4">
                 Transmission Content
               </div>
               <p className="text-text-secondary leading-relaxed font-medium italic whitespace-pre-wrap">
                 {message}
               </p>
            </div>

            {/* Main Action Primary */}
            <button
              className={`w-full h-20 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all duration-300 active:scale-[0.98] ${isSent ? 'bg-white/10 text-white' : 'bg-primary text-black shadow-[0_0_50px_rgba(37,211,102,0.3)]'}`}
              onClick={handleSendCurrent}
            >
              <Send size={24} className={isSent ? 'opacity-50' : 'animate-pulse'} />
              <span className="text-lg font-black uppercase tracking-widest">{isSent ? 'Retransmit Phase' : 'Initiate WhatsApp Send'}</span>
            </button>

            {/* Post-Action Navigation */}
            <div className="flex gap-4 mt-8">
               <button 
                 className={`btn btn-secondary flex-1 h-16 ${currentIndex === 0 ? 'opacity-20 pointer-events-none' : ''}`}
                 onClick={handlePrev}
               >
                 <ChevronLeft size={20} /> Preceding
               </button>
               <button 
                 className={`btn btn-secondary flex-1 h-16 bg-white/[0.04] ${currentIndex === recipients.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}
                 onClick={handleNext}
               >
                 Succeeding <ChevronRight size={20} />
               </button>
            </div>

            {currentIndex === recipients.length - 1 && (
               <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-sm font-black text-primary uppercase tracking-widest">End of Transmission Pool Reached</p>
               </div>
            )}
        </div>
      </div>
    );
  }

  // ── Mode: Composition & Strategy ──
  return (
    <div className="p-6 lg:p-12 mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Composer */}
        <div className="lg:col-span-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Mass Distribution</h1>
              <p className="text-text-secondary font-medium tracking-tight">Strategizing <span className="text-primary font-black">{broadcasts.length}</span> individual campaigns.</p>
            </div>
          </div>

          {/* Step 1: Segmentation */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-lg font-black text-white leading-none mb-1">1. Target Segmentation</h3>
                  <p className="text-xs font-bold text-text-muted mt-2">Choose the client tier for this distribution</p>
               </div>
               <button onClick={copyAllNumbers} className="btn btn-secondary text-xs font-black uppercase tracking-widest h-10 px-4">
                  <Copy size={14} /> Pool Numbers
               </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {TAGS.map((t) => (
                <button
                  key={t}
                  className={`px-6 py-3 rounded-xl text-[0.7rem] font-black uppercase tracking-widest transition-all ${targetTag === t 
                    ? "bg-primary text-black shadow-lg" 
                    : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-secondary border border-white/5"}`}
                  onClick={() => setTargetTag(t)}
                >
                  {t === "All" ? `All Entities (${customers.length})` : `${t} Tier (${customers.filter(c => c.tag === t).length})`}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <div className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Active Distribution Pool ({recipients.length})</div>
                <div className="flex flex-wrap gap-2">
                  {recipients.slice(0, 15).map((c) => (
                    <div key={c.id} className="px-3 py-1 bg-white/5 rounded-lg text-[0.65rem] font-bold text-text-secondary border border-white/5">
                      {c.name.split(" ")[0]}
                    </div>
                  ))}
                  {recipients.length > 15 && (
                    <span className="text-[0.65rem] font-black text-primary px-3 py-1 bg-primary/5 rounded-lg border border-primary/20">
                      + {recipients.length - 15} More Entities
                    </span>
                  )}
                </div>
            </div>
          </div>

          {/* Step 2: Content Strategy */}
          <div className="card mb-12">
            <h3 className="text-lg font-black text-white leading-none mb-4">2. Transmission Strategy</h3>
            <textarea
              className="form-textarea min-h-[220px] p-6 text-base leading-relaxed tracking-tight bg-white/[0.01] border-white/5 focus:bg-white/[0.02]"
              placeholder="e.g. Greetings [Name]! We've reserved a unique position in our upcoming release just for you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center mt-6">
               <div className="flex items-center gap-2 text-text-muted text-[0.65rem] font-black uppercase tracking-widest">
                  <Zap size={14} className="text-primary" /> Personalized placeholders coming soon
               </div>
               <div className="text-xs font-black text-text-muted uppercase tracking-widest">{message.length} Characters</div>
            </div>
          </div>

          <button
            className={`w-full h-20 rounded-[2rem] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden group ${!message.trim() || recipients.length === 0 ? "opacity-30 pointer-events-none" : "bg-primary text-black hover:scale-[1.01] active:scale-95"}`}
            disabled={!message.trim() || recipients.length === 0}
            onClick={() => {
              if (gate("broadcast", "Broadcast is a Pro-tier capability. Upgrade to unlock mass distribution tools.")) 
                handleStartBroadcast();
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Radio size={24} className="animate-pulse" />
            <span className="text-lg font-black uppercase tracking-[0.2em] leading-none">Initiate Guided Campaign</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Campaign History */}
        <div className="lg:col-span-4 space-y-8">
           <div className="card bg-white/[0.01] border-white/5">
              <h3 className="font-black text-[0.65rem] uppercase tracking-[0.2em] text-text-muted mb-8 leading-none">Campaign Archive</h3>
              <div className="space-y-6">
                {broadcasts.length === 0 ? (
                  <div className="py-20 text-center opacity-30 italic">
                    <MessageSquare size={32} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No previous broadcasts</p>
                  </div>
                ) : (
                  broadcasts.map((b) => (
                    <div key={b.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl group cursor-pointer hover:border-primary/20 transition-all">
                       <div className="flex justify-between items-start mb-3">
                          <div className="text-[0.6rem] font-black text-primary uppercase tracking-widest">
                            {b.recipientCount} Distribution Points
                          </div>
                          <div className="text-[0.6rem] font-bold text-text-muted">{new Date(b.sentAt).toLocaleDateString()}</div>
                       </div>
                       <p className="text-xs font-medium text-text-secondary leading-relaxed line-clamp-2 italic">
                         "{b.message}"
                       </p>
                    </div>
                  ))
                )}
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                 <AlertCircle size={24} />
              </div>
              <h4 className="font-black text-white mb-2">Smart Distribution</h4>
              <p className="text-xs text-text-secondary font-medium leading-relaxed italic opacity-80">
                To maintain high account reputation, ClientFlow uses a guided sending system. This prevents WhatsApp automated detection and keeps your business secure.
              </p>
           </div>
        </div>
      </div>

      {upgradeModal && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setUpgradeModal(false)}
        />
      )}
    </div>
  );
}
