import { Menu, Bell, Search, Zap } from 'lucide-react';

const PAGE_TITLES = {
  'dashboard':     'Overview',
  'customers':     'Customers',
  'orders':        'Orders',
  'quick-replies': 'Quick Replies',
  'broadcast':     'Broadcast',
  'settings':      'System Settings',
  'invoices':      'Billing',
};

export default function TopBar({ page, onMenuClick }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-12 z-50">
      <div className="flex items-center gap-4">
        <button
          className="w-10 h-10 rounded-lg flex lg:hidden items-center justify-center bg-white/5 border border-white/10 text-white"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">{PAGE_TITLES[page]}</h1>
          {page === 'dashboard' && (
            <p className="text-[0.6rem] sm:text-[0.7rem] font-bold text-text-secondary uppercase tracking-[0.1em]">{greeting().split(' ')[1]}, back</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
           <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
           </div>
           <span className="text-[0.65rem] font-black text-white uppercase tracking-widest">WhatsApp Live</span>
        </div>

        {/* Mobile Health Indicator (dot only) */}
        <div className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
           <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:bg-white/5 hover:text-white transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-primary" />
           </button>
           
           <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

           <button className="flex items-center gap-3 p-1 pr-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all text-left">
              <div className="avatar w-8 h-8 rounded-lg text-xs border-transparent bg-primary text-black">
                CF
              </div>
              <div className="hidden sm:block">
                 <div className="text-xs font-black text-white">Elite Org</div>
                 <div className="text-[0.65rem] font-bold text-text-muted">Pro Account</div>
              </div>
           </button>
        </div>
      </div>
    </header>
  );
}
