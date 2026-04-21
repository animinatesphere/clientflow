import { useState, useEffect, useRef } from "react";
import { 
  Globe, 
  CheckCircle, 
  Share2, 
  Copy, 
  Image as ImageIcon, 
  Trash2, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus,
  X,
  Palette,
  Eye,
  Camera,
  MapPin,
  MessageSquare
} from "lucide-react";
import html2canvas from "html2canvas";
import { usePlan } from "../hooks/usePlan";
import Badge from "../components/ui/Badge";
import UpgradeModal from "../components/ui/UpgradeModal";

const ACCENT_COLORS = [
  { name: "WhatsApp Green", value: "#25D366" },
  { name: "SaaS Blue", value: "#3b82f6" },
  { name: "Elite Gold", value: "#eab308" },
  { name: "Cyber Purple", value: "#a855f7" },
  { name: "Ferrari Red", value: "#ef4444" },
  { name: "Sky Turquoise", value: "#06b6d4" },
];

export default function BusinessProfile({ store }) {
  const { businessProfile, saveBusinessProfile, plan, limits, canAdd, toast, waLink } = store;
  const { upgradeModal, upgradeReason, setUpgradeModal, gate } = usePlan(store);
  const previewRef = useRef(null);

  const [form, setForm] = useState({
    businessName: businessProfile?.businessName || "",
    username: businessProfile?.username || "",
    tagline: businessProfile?.tagline || "",
    about: businessProfile?.about || "",
    whatsapp: businessProfile?.whatsapp || "",
    instagram: businessProfile?.instagram || "",
    twitter: businessProfile?.twitter || "",
    location: businessProfile?.location || "",
    avatarUrl: businessProfile?.avatarUrl || "",
    accentColor: businessProfile?.accentColor || "#25D366",
    services: businessProfile?.services || [],
    isPublished: businessProfile?.isPublished !== undefined ? businessProfile.isPublished : true,
  });

  const [newService, setNewService] = useState("");

  const isPro = plan === 'pro';

  // Auto-username generation from business name
  useEffect(() => {
    if (!form.username && form.businessName) {
      const slug = form.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setForm(f => ({ ...f, username: slug }));
    }
  }, [form.businessName]);

  const handleSave = () => {
    if (!gate("broadcast", "Business Profile Page is a Pro-tier capability. Upgrade to unlock your shareable landing page.")) return;
    saveBusinessProfile(form);
  };

  const handleServiceAdd = (e) => {
    if (e.key === "Enter" && newService.trim()) {
      e.preventDefault();
      if (form.services.length >= 8) {
        toast("Maximum 8 services allowed", "info");
        return;
      }
      setForm(f => ({ ...f, services: [...f.services, newService.trim()] }));
      setNewService("");
    }
  };

  const removeService = (idx) => {
    setForm(f => ({ ...f, services: f.services.filter((_, i) => i !== idx) }));
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/biz/${form.username}`;
    navigator.clipboard.writeText(url);
    toast("Landing page URL copied! 📎");
  };

  const exportAsImage = async () => {
    if (!previewRef.current) return;
    toast("Generating High-Res Image...");
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      backgroundColor: "#0F1115",
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `${form.username}-profile.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast("Profile Card Downloaded ✅");
  };

  // Profile strength calculation
  const strengthPoints = [
    form.avatarUrl,
    form.tagline,
    form.about,
    form.whatsapp,
    form.services.length > 0
  ].filter(Boolean).length;
  const strength = strengthPoints * 20;

  return (
    <div className="p-6 lg:p-12 mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic">Entity Identity</h1>
          <div className="flex items-center gap-4">
             <p className="text-text-secondary font-medium tracking-tight">Status: <span className={form.isPublished ? "text-primary font-black" : "text-amber-500 font-black"}>{form.isPublished ? "Live & Transmitting" : "Internal Draft"}</span></p>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary">Pro Tier Verified</span>
             </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn btn-primary h-12 shadow-xl group">
             <Zap size={18} className="group-hover:animate-pulse" /> Finalize Transmission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* EDIT SECTION */}
        <div className="xl:col-span-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card bg-white/[0.01] border-white/5 relative overflow-hidden group">
                 <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Internal Reach</div>
                 <div className="text-3xl font-black text-white tracking-tighter">{businessProfile?.views || 0}</div>
                 <div className="text-xs font-bold text-text-muted mt-1">Global Views</div>
                 <div className="absolute top-4 right-4 text-primary opacity-20"><Eye size={24} /></div>
              </div>
              <div className="card bg-white/[0.01] border-white/5 md:col-span-2">
                 <div className="flex justify-between items-end mb-4">
                    <div>
                       <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Identity Strength</div>
                       <div className="text-2xl font-black text-white">{strength}%</div>
                    </div>
                    <div className="text-[0.65rem] font-black text-primary uppercase tracking-widest">{strength === 100 ? "Identity Optimized" : "Incomplete Profile"}</div>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-700" style={{ width: `${strength}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Form Column */}
        <div className={`xl:col-span-7 space-y-8 ${!isPro && 'blur-md pointer-events-none select-none relative'}`}>
           {!isPro && (
             <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="card bg-bg-surface/50 backdrop-blur-xl border-primary/20 p-12 text-center shadow-2xl max-w-md mx-auto">
                   <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8">
                      <Zap size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 italic">Exclusive Pro Feature</h3>
                   <p className="text-text-secondary leading-relaxed mb-10">Professional Business Profiles are reserved for Growth Pro users. Establish your brand authority with a shareable URL.</p>
                   <button 
                     className="btn btn-primary w-full h-14"
                     onClick={() => setUpgradeModal(true)}
                   >
                     Unlock Your Profile Page
                   </button>
                </div>
             </div>
           )}
           
           {/* Section: Core Identity */}
           <div className="card bg-white/[0.01] border-white/5">
              <h3 className="text-lg font-black text-white mb-8 border-b border-white/5 pb-4">1. Core Particulars</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Official Name</label>
                    <input className="form-input" placeholder="e.g. Ade Ventures" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Universal Slug</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold leading-none">/biz/</span>
                       <input className="form-input pl-14" placeholder="ade-ventures" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/\s/g, "-")})} />
                    </div>
                 </div>
              </div>
              <div className="space-y-2 mb-8">
                 <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Signature Tagline</label>
                 <input className="form-input" placeholder="e.g. Premium Lagos Design Collective" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Business Narrative (Max 300 Chars)</label>
                 <textarea className="form-textarea h-32" maxLength={300} placeholder="Tell your story..." value={form.about} onChange={e => setForm({...form, about: e.target.value})} />
                 <div className="text-[0.65rem] text-right font-black text-text-muted mt-2">{form.about.length} / 300</div>
              </div>
           </div>

           {/* Section: Contact & Socials */}
           <div className="card bg-white/[0.02] border-white/10">
              <h3 className="text-lg font-black text-white mb-8 border-b border-white/5 pb-4">2. Transmission Lines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2 text-primary">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">WhatsApp Pool</label>
                    <input className="form-input border-primary/20 bg-primary/5 focus:bg-primary/10" placeholder="e.g. 08012345678" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Fixed Location</label>
                    <input className="form-input" placeholder="e.g. Ikeja, Lagos" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Instagram Identity</label>
                    <input className="form-input" placeholder="@handle" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Twitter Handle</label>
                    <input className="form-input" placeholder="@handle" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} />
                 </div>
              </div>
           </div>

           {/* Section: Services & Branding */}
           <div className="card bg-white/[0.01] border-white/5">
              <h3 className="text-lg font-black text-white mb-8 border-b border-white/5 pb-4">3. Premium Specification</h3>
              
              <div className="space-y-2 mb-10">
                 <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Service Listing (Press Enter)</label>
                 <div className="flex gap-2 mb-4">
                    <input className="form-input" placeholder="e.g. Brand Identity Design" value={newService} onChange={e => setNewService(e.target.value)} onKeyDown={handleServiceAdd} />
                    <button className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5" onClick={() => handleServiceAdd({ key: "Enter", preventDefault: () => {}, target: { value: newService } })}>
                       <Plus size={18} />
                    </button>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {form.services.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-lg group">
                         <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary">{s}</span>
                         <button onClick={() => removeService(i)} className="text-primary hover:text-red-500"><X size={12} /></button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1 block mb-4">Branding Accent Color</label>
                 <div className="flex flex-wrap gap-4">
                    {ACCENT_COLORS.map(c => (
                      <button 
                        key={c.value} 
                        onClick={() => setForm({...form, accentColor: c.value})}
                        className={`w-12 h-12 rounded-2xl relative transition-transform hover:scale-110 ${form.accentColor === c.value ? 'ring-4 ring-white ring-offset-4 ring-offset-bg-primary' : ''}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                         {form.accentColor === c.value && <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-lg"><CheckCircle size={20} /></div>}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="mt-12 flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                 <div>
                    <div className="text-sm font-black text-white mb-1">Landing Page Visibility</div>
                    <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-widest">Publicly Accessible URL</div>
                 </div>
                 <div className="relative inline-flex items-center cursor-pointer" onClick={() => setForm({...form, isPublished: !form.isPublished})}>
                    <input type="checkbox" className="sr-only peer" checked={form.isPublished} readOnly />
                    <div className="w-14 h-7 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                 </div>
              </div>
           </div>

           {/* SHARING TOOLS */}
           <div className="card bg-bg-surface/30 border-white/10 p-10 mt-12">
              <h3 className="text-2xl font-black text-white italic tracking-tighter mb-8">Share Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <button onClick={handleCopyLink} className="btn btn-secondary h-14 bg-white/5 border-white/5">
                    <Copy size={18} /> Copy Link
                 </button>
                 <a 
                   href={`https://wa.me/?text=Check out my official business profile on ClientFlow: ${window.location.host}/biz/${form.username}`} 
                   target="_blank"
                   className="btn btn-secondary h-14 bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20"
                 >
                    <MessageSquare size={18} /> WhatsApp
                 </a>
                 <a 
                   href={`https://twitter.com/intent/tweet?text=Explore our professional world on ClientFlow: &url=${window.location.host}/biz/${form.username}`} 
                   target="_blank"
                   className="btn btn-secondary h-14 bg-[#1DA1F2]/10 border-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
                 >
                    <Globe size={18} /> Twitter
                 </a>
                 <button onClick={exportAsImage} className="btn btn-secondary h-14 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                    <ImageIcon size={18} /> Card Export
                 </button>
              </div>
           </div>
        </div>

        {/* RIGHT PREVIEW COLUMN */}
        <div className="xl:col-span-5 sticky top-32">
           <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-text-muted italic">Transmission Live Preview</span>
              </div>
              
              {/* MOBILE MOCKUP */}
              <div className="relative w-full max-w-[360px] aspect-[9/18.5] bg-[#0F1115] rounded-[3.5rem] border-[8px] border-[#1C1F26] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                 {/* Internal Content (The actual Landing Page layout but embedded) */}
                 <div ref={previewRef} className="h-full overflow-y-auto no-scrollbar bg-bg-primary text-white text-[12px] pb-10">
                    <div className="h-28" style={{ backgroundColor: form.accentColor }}></div>
                    <div className="px-6 -mt-10">
                       <div className="w-20 h-20 rounded-full border-4 border-[#0F1115] bg-[#1a1c21] flex items-center justify-center italic text-lg font-black overflow-hidden">
                          {form.avatarUrl ? <img src={form.avatarUrl} className="w-full h-full object-cover" /> : form.businessName.charAt(0) || "U"}
                       </div>
                       <h4 className="mt-4 text-xl font-black tracking-tighter leading-none">{form.businessName || "Unnamed Business"}</h4>
                       <p className="mt-1 text-text-secondary leading-tight opacity-70">{form.tagline || "Brand Narrative Here..."}</p>
                       
                       <div className="flex items-center gap-1.5 mt-3 text-[10px] uppercase font-black tracking-tighter opacity-40">
                          <MapPin size={8} /> {form.location || "Online"}
                       </div>

                       <div className="mt-6 flex flex-col gap-2">
                          <button className="h-10 rounded-xl bg-primary text-black font-black uppercase flex items-center justify-center gap-2">
                             <MessageSquare size={14} /> WhatsApp
                          </button>
                       </div>

                       <div className="mt-10 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                          <h6 className="font-black uppercase tracking-widest text-[9px] mb-3 text-text-muted">Origins</h6>
                          <p className="text-text-secondary font-medium leading-relaxed italic line-clamp-4">
                             "{form.about || "Your brand story unfolds here with elegance and precision. Scale your reach effortlessly."}"
                          </p>
                       </div>

                       <div className="mt-10">
                          <h6 className="font-black uppercase tracking-widest text-[9px] mb-4 text-text-muted">Directives</h6>
                          <div className="grid grid-cols-2 gap-2">
                             {(form.services.length > 0 ? form.services : ["Core Offering", "Specification"]).map((s, i) => (
                               <div key={i} className="p-2 border border-white/5 bg-white/[0.03] rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 overflow-hidden">
                                 <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Phone Frame Accents */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1C1F26] rounded-b-2xl z-20" />
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-20" />
              </div>
              
              <p className="mt-8 text-[0.6rem] font-bold text-text-muted italic max-w-xs text-center leading-relaxed">
                 * High-resolution rendering used for card exports. Live preview scales instantly with your local machine state.
              </p>
           </div>
        </div>
      </div>

      {upgradeModal && <UpgradeModal reason={upgradeReason} onClose={() => setUpgradeModal(false)} />}
    </div>
  );
}
