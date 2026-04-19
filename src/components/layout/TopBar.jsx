import { Menu, Bell, Search } from 'lucide-react';

const PAGE_TITLES = {
  'dashboard':     'Dashboard',
  'customers':     'Customers',
  'orders':        'Orders',
  'quick-replies': 'Quick Replies',
  'broadcast':     'Broadcast',
  'settings':      'Settings',
};

export default function TopBar({ page, onMenuClick }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          className="btn btn-ghost btn-icon"
          onClick={onMenuClick}
          style={{ display: 'none' }}
          id="sidebar-toggle"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="topbar-title">{PAGE_TITLES[page]}</div>
          {page === 'dashboard' && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
              {greeting}, welcome back 👋
            </div>
          )}
        </div>
      </div>

      <div className="topbar-actions">
        {/* WhatsApp status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(37,211,102,0.1)',
          border: '1px solid rgba(37,211,102,0.2)',
          borderRadius: 99,
          padding: '5px 12px',
          fontSize: '0.72rem',
          color: 'var(--green)',
          fontWeight: 600,
        }}>
          <span style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: 'var(--green)',
            boxShadow: '0 0 6px var(--green)',
            animation: 'pulse 2s infinite',
            display: 'inline-block',
          }} />
          WhatsApp Ready
        </div>

        <button className="btn btn-ghost btn-icon" title="Notifications">
          <Bell size={18} />
        </button>

        <div style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--green), #0e8a3e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.8rem', color: '#000',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(37,211,102,0.3)',
        }}>
          CF
        </div>
      </div>
    </header>
  );
}
