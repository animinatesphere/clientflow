import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  CheckCircle, 
  MapPin, 
  Camera, 
  Globe, 
  Mail, 
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Info
} from "lucide-react";

export default function PublicProfile({ store }) {
  const { username } = useParams();
  const { fetchProfileByUsername, incrementProfileView, waLink, user: authUser } = store;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: "", service: "", message: "" });

  useEffect(() => {
    async function load() {
      const p = await fetchProfileByUsername(username);
      if (p) {
        setProfile(p);
        incrementProfileView(p.id);
        
        // SEO: Set Title and Meta
        document.title = `${p.businessName} | ClientFlow`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", p.tagline || `Discover ${p.businessName} on ClientFlow.`);
      }
      setLoading(false);
    }
    load();
  }, [username, fetchProfileByUsername, incrementProfileView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-text-muted mb-8 italic">
          404
        </div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">Identity Not Found</h1>
        <p className="text-text-secondary mb-8 max-w-sm">This business profile hasn't been claimed yet. Think it should be yours?</p>
        <Link to="/signup" className="btn btn-primary h-14 px-8">Create Your Profile Free</Link>
      </div>
    );
  }

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const text = `Hello! I'm ${contactForm.name}.\nI'm interested in: *${contactForm.service}*\n\nMessage: ${contactForm.message}`;
    window.open(waLink(profile.whatsapp, text), "_blank");
  };

  const strength = [
    profile.avatarUrl,
    profile.about,
    profile.whatsapp,
    profile.services?.length > 0,
    profile.tagline
  ].filter(Boolean).length * 20;

  return (
    <div className="min-h-screen bg-bg-primary text-white font-sans selection:bg-primary/30">
      {/* ── HERO SECTION ── */}
      <div 
        className="h-48 md:h-64 flex relative" 
        style={{ backgroundColor: profile.accentColor || "var(--primary)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        
        {/* Profile Avatar Overlay */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0">
           <div className="w-32 h-32 rounded-full border-[6px] border-bg-primary bg-bg-primary flex items-center justify-center overflow-hidden shadow-2xl relative">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-3xl font-black italic">
                  {profile.businessName.charAt(0)}
                </div>
              )}
           </div>
           {/* Verified Badge */}
           <div className="absolute bottom-1 right-1 bg-primary text-black rounded-full p-1 border-4 border-bg-primary shadow-lg">
              <CheckCircle size={18} fill="currentColor" stroke="none" />
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-20 pb-24 md:px-20 md:pt-16">
        {/* ── IDENTITY INFO ── */}
        <div className="text-center md:text-left mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 flex items-center justify-center md:justify-start gap-4">
              {profile.businessName}
            </h1>
            <p className="text-xl text-text-secondary font-medium tracking-tight mb-4">{profile.tagline}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-black uppercase tracking-widest text-text-muted">
               <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                  <MapPin size={14} className="text-primary" /> {profile.location || "Online"}
               </div>
               <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                  Business Entity Verified
               </div>
            </div>
        </div>

        {/* ── ACTION GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <a 
              href={waLink(profile.whatsapp, "Hello! I saw your profile on ClientFlow.")} 
              target="_blank" 
              className="group flex items-center justify-between p-6 bg-primary rounded-[1.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
               <div className="flex items-center gap-4 text-black">
                  <MessageCircle size={32} />
                  <div>
                    <div className="text-[0.65rem] font-black uppercase tracking-widest leading-none mb-1 opacity-70">Direct Channel</div>
                    <div className="text-xl font-black leading-none uppercase">WhatsApp Us</div>
                  </div>
               </div>
               <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex gap-4">
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" className="flex-1 bg-white/[0.03] border border-white/5 rounded-[1.5rem] flex items-center justify-center hover:bg-white/[0.08] transition-all group">
                   <Camera size={24} className="text-text-secondary group-hover:text-white group-hover:scale-110 transition-all" />
                </a>
              )}
              {profile.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" className="flex-1 bg-white/[0.03] border border-white/5 rounded-[1.5rem] flex items-center justify-center hover:bg-white/[0.08] transition-all group">
                   <Globe size={24} className="text-text-secondary group-hover:text-white group-hover:scale-110 transition-all" />
                </a>
              )}
              <a href={`mailto:${authUser?.email || "hello@clientflow.io"}`} className="flex-1 bg-white/[0.03] border border-white/5 rounded-[1.5rem] flex items-center justify-center hover:bg-white/[0.08] transition-all group">
                 <Mail size={24} className="text-text-secondary group-hover:text-white group-hover:scale-110 transition-all" />
              </a>
            </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-12">
             <div className="card bg-white/[0.02] border-white/5 p-10 md:p-14 mb-12">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Info size={20} />
                   </div>
                   <h3 className="text-xl font-black uppercase tracking-widest">About Our Mission</h3>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed font-medium italic whitespace-pre-wrap">
                  "{profile.about || "Providing standard services with ultimate precision and passion."}"
                </p>
             </div>

             <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <ExternalLink size={20} />
                   </div>
                   <h3 className="text-xl font-black uppercase tracking-widest">What We Offer</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {profile.services?.length > 0 ? profile.services.map((s, idx) => (
                     <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3 group hover:border-primary/30 transition-all">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-black uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">{s}</span>
                     </div>
                   )) : (
                     <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-30">
                        <p className="font-black uppercase tracking-widest text-xs">Standard Business Logistics</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* ── QUICK ENQUIRY FORM ── */}
        <div className="card bg-white/[0.01] border-white/10 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <h3 className="text-3xl font-black tracking-tighter mb-2">Initiate Request</h3>
            <p className="text-text-secondary font-medium mb-10">Send a quick message directly to my WhatsApp pool.</p>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
               <div>
                  <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-2 block">Your Full Identity</label>
                  <input 
                    className="form-input bg-white/5" 
                    placeholder="e.g. Ebuka Okafor" 
                    required 
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-2 block">Interested Service</label>
                  <select 
                    className="form-select bg-white/5" 
                    required
                    value={contactForm.service}
                    onChange={e => setContactForm({...contactForm, service: e.target.value})}
                  >
                     <option value="">Select a specification</option>
                     {profile.services?.map((s, i) => <option key={i} value={s}>{s}</option>)}
                     <option value="General Consultation">General Consultation</option>
                  </select>
               </div>
               <div>
                  <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-2 block">Message / Specification</label>
                  <textarea 
                    className="form-textarea bg-white/5 h-32" 
                    placeholder="I'd like to book..." 
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  />
               </div>
               <button type="submit" className="btn btn-primary h-16 w-full text-lg tracking-widest group">
                  Transmit via WhatsApp 
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </form>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-24 text-center">
            <div className="inline-flex items-center gap-2 p-3 px-6 bg-white/[0.03] border border-white/5 rounded-full">
               <span className="text-xs font-black text-text-muted uppercase tracking-widest">Powered by</span>
               <Link to="/" className="text-xs font-black italic tracking-tighter text-white">Client<span className="text-primary">Flow</span></Link>
            </div>
            <p className="mt-6 text-[0.6rem] font-black text-text-muted uppercase tracking-[0.3em] opacity-40 italic">
              Scale Your Business On WhatsApp • © 2026
            </p>
        </div>
      </div>
    </div>
  );
}
