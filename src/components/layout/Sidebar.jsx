import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MessageSquare,
  Radio,
  MessageCircle,
  ChevronRight,
  Settings as SettingsIcon,
  LogOut,
  Receipt,
  Headphones,
} from "lucide-react";
import Logo from "../ui/Logo";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "customers", label: "Customers", icon: Users, path: "/customers" },
  { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
  { id: "business-profile", label: "Business Profile", icon: ShoppingBag, path: "/business-profile" },
  { id: "broadcast", label: "Broadcast", icon: Radio, path: "/broadcast" },
  { id: "invoices", label: "Invoices", icon: Receipt, path: "/invoices" },
  { id: "quick-replies", label: "Quick Replies", icon: MessageSquare, path: "/quick-replies" },
];

export default function Sidebar({ isOpen, onClose, user, onLogout }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[99] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-bg-primary border-r border-white/5 z-[100] transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]" : "-translate-x-full"}`}>
        {/* Logo Section */}
        <Link to="/" className="h-20 px-8 flex items-center gap-3" onClick={onClose}>
          <div className="w-8 h-8 flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.2)]">
            <Logo size={32} />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">Client<span className="text-primary">Flow</span></span>
        </Link>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1.5 overflow-y-auto h-[calc(100vh-160px)]">
          <div className="px-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4">Management</div>
          {NAV.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-text-secondary hover:bg-white/5 hover:text-white"}`
              }
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? "text-primary" : "text-text-muted group-hover:text-text-secondary"} />
                  <span className="flex-1 text-sm font-bold tracking-tight">{label}</span>
                  {isActive && <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(37,211,102,0.5)]" />}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-8 px-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4">System</div>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive 
                ? "bg-primary/5 text-primary" 
                : "text-text-secondary hover:bg-white/5 hover:text-white"}`
            }
            onClick={onClose}
          >
            <SettingsIcon size={18} className="text-text-muted group-hover:text-text-secondary" />
            <span className="text-sm font-bold tracking-tight">Settings</span>
          </NavLink>
          <a
            href="#"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-white transition-all"
          >
            <Headphones size={18} className="text-text-muted group-hover:text-text-secondary" />
            <span className="text-sm font-bold tracking-tight">Support</span>
          </a>
        </nav>

        {/* User Profile Footer */}
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-white/5 bg-bg-primary/50 backdrop-blur-md">
          <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent">
             <div className="avatar w-10 h-10 border-white/10 text-white bg-gradient-to-tr from-white/10 to-transparent">
               {user?.name?.charAt(0) || 'U'}
             </div>
             <div className="flex-1 min-w-0 pr-2">
               <div className="text-sm font-black text-white truncate">{user?.name || "Entrepreneur"}</div>
               <div className="text-[0.7rem] font-bold text-primary uppercase tracking-widest">{user?.role === 'pro' ? 'Growth Pro' : 'Free Starter'}</div>
             </div>
             <button 
               onClick={onLogout}
               className="w-10 h-10 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
               title="Log Out"
             >
               <LogOut size={16} />
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
