import { useState } from 'react';
import { User, Bell, Shield, Wallet, Globe, Database, HelpCircle, Save, ExternalLink, Zap } from 'lucide-react';

/* ─── Settings Section Wrapper ────────────────────────────────────── */
function SettingsSection({ title, description, children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start py-12 border-b border-white/5 last:border-none">
      <div className="lg:col-span-4">
        <h3 className="text-lg font-black text-white mb-2 leading-none">{title}</h3>
        <p className="text-sm font-medium text-text-secondary leading-relaxed">{description}</p>
      </div>
      <div className="lg:col-span-8 space-y-6">
        {children}
      </div>
    </div>
  );
}

export default function Settings({ store }) {
  const { user, profile, updateProfile, toast } = store;
  const [form, setForm] = useState({
    businessName: profile?.businessName || '',
    website: profile?.website || '',
    currency: 'NGN',
    emailNotifications: true,
    whatsappLogs: true,
  });

  const handleSave = () => {
    updateProfile(form);
    toast("Configuration Saved Successfully ✅", "success");
  };

  return (
    <div className="p-6 lg:p-12 mt-20 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">System Config</h1>
          <p className="text-text-secondary font-medium tracking-tight">Managing global parameters and business identity.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary h-12 shadow-xl hover:scale-105 transition-all">
          <Save size={18} /> Push Configuration
        </button>
      </div>

      <div className="card bg-white/[0.01] border-white/5 p-0 sm:p-10">
        {/* Core Identity */}
        <SettingsSection 
          title="Business Identity" 
          description="Update your brand presence and how clients perceive your documents."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Official Name</label>
              <input 
                className="form-input" 
                placeholder="e.g. Ade Ventures Limited" 
                value={form.businessName}
                onChange={e => setForm({...form, businessName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Web Presence</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                <input 
                  className="form-input pl-10" 
                  placeholder="adeventures.com" 
                  value={form.website}
                  onChange={e => setForm({...form, website: e.target.value})}
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Financial System */}
        <SettingsSection 
          title="Monetary Engine" 
          description="Configure currency symbols and financial reporting defaults."
        >
          <div className="max-w-xs space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Locale Currency</label>
            <select className="form-select">
              <option>NGN - Nigerian Naira (₦)</option>
              <option>USD - US Dollar ($)</option>
              <option>GBP - British Pound (£)</option>
            </select>
          </div>
        </SettingsSection>

        {/* Global Logistics */}
        <SettingsSection 
          title="Logistics & Events" 
          description="Define how the system communicates internal events and alerts."
        >
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Bell size={20} />
                   </div>
                   <div>
                      <div className="text-sm font-black text-white leading-none mb-1">Push Notifications</div>
                      <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest leading-none">Desktop Alerts</div>
                   </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Zap size={20} />
                   </div>
                   <div>
                      <div className="text-sm font-black text-white leading-none mb-1">WhatsApp Tunnel Logs</div>
                      <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest leading-none">Real-time Debugging</div>
                   </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </div>
             </div>
          </div>
        </SettingsSection>

        {/* Support & Docs */}
        <SettingsSection 
          title="Compliance & Support" 
          description="Access legal documentation and official support channels."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <a href="#" className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                   <Shield className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                   <span className="text-sm font-black text-white">Trust & Privacy</span>
                </div>
                <ExternalLink size={14} className="text-text-muted" />
             </a>
             <a href="#" className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                   <HelpCircle className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                   <span className="text-sm font-black text-white">Advanced Documentation</span>
                </div>
                <ExternalLink size={14} className="text-text-muted" />
             </a>
          </div>
        </SettingsSection>
      </div>

      {/* Footer Meta */}
      <div className="mt-12 text-center text-[0.65rem] font-black text-text-muted uppercase tracking-[0.3em] italic">
        ClientFlow Runtime v4.2.0 • Build ID: CF_PRO_99X
      </div>
    </div>
  );
}
