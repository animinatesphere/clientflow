import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Radio,
  Plus,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Zap,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import UpgradeModal from "../components/ui/UpgradeModal";

/* ─── Premium Sparkline ─────────────────────────────────────────── */
function Sparkline({ color }) {
  return (
    <div className="mt-4 pt-4 border-t border-white/[0.03]">
      <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" className="opacity-60">
        <path
          d="M0,35 Q10,10 20,25 T40,15 T60,30 T80,10 L100,5"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M0,35 Q10,10 20,25 T40,15 T60,30 T80,10 L100,5 L100,40 L0,40 Z"
          fill={`url(#gradient-${color.replace('#', '')})`}
          opacity="0.2"
        />
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  change,
  prefix = "",
  showSparkline = false
}) {
  return (
    <div className="card group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
            <Icon size={22} />
          </div>
          {change && (
            <div className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-wider ${change.includes('↑') ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}>
              {change}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-3xl font-black tracking-tight text-white mb-1">
            {prefix}{typeof value === "number" ? value.toLocaleString("en-NG") : value}
          </div>
          <div className="text-sm font-bold text-text-secondary tracking-tight uppercase tracking-widest text-[0.65rem] opacity-70 italic">{label}</div>
        </div>

        {showSparkline && <Sparkline color={accent} />}
      </div>
    </div>
  );
}

export default function Dashboard({ store }) {
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { stats, customers, orders, getCustomer, formatNaira } = store;

  const recentOrders = orders.slice(0, 5);
  const recentCustomers = customers.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-12 mt-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Business Overview</h2>
          <p className="text-text-secondary font-medium tracking-tight">Real-time performance across your WhatsApp funnel.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => navigate('/broadcast')} className="btn btn-secondary flex-1 md:flex-none h-11 sm:h-12 text-xs sm:text-sm">
            <Radio size={16} /> <span className="hidden xs:inline">Broadcast</span><span className="xs:hidden">Blast</span>
          </button>
          <button onClick={() => navigate('/orders')} className="btn btn-primary flex-1 md:flex-none h-11 sm:h-12 text-xs sm:text-sm shadow-xl group">
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> <span className="hidden xs:inline">New Order</span><span className="xs:hidden">Order</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Leads"
          value={stats.totalCustomers}
          icon={Users}
          accent="var(--green)"
          change="↑ 12.5% vs LW"
        />
        <StatCard
          label="Pending Deliveries"
          value={stats.activeOrders}
          icon={ShoppingBag}
          accent="var(--amber)"
          change={`${stats.activeOrders} Active`}
        />
        <StatCard
          label="Collected Revenue"
          value={stats.revenue}
          prefix="₦"
          icon={TrendingUp}
          accent="var(--blue)"
          change="↑ 8.2% Growing"
          showSparkline={true}
        />
        <StatCard
          label="Automation Volume"
          value={stats.broadcastsSent}
          icon={Zap}
          accent="var(--purple)"
          change="100% System Ok"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-8">
           {/* Free Plan Alert */}
           {store.plan === "free" && (
             <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500/20 to-orange-600/10 border border-amber-500/20 p-8 fadeInUp">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div>
                      <h4 className="text-xl font-black text-white mb-2">Unlock Infinite Growth</h4>
                      <p className="text-sm text-amber-100/70 font-medium">You're currently limited to 20 customers. Upgrade to PRO for unlimited potential.</p>
                   </div>
                   <button onClick={() => setShowUpgrade(true)} className="btn bg-amber-500 text-black px-8 h-12 font-black shadow-2xl hover:scale-105 transition-transform">
                     Upgrade To Pro <ChevronRight size={18} />
                   </button>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             </div>
           )}

           {/* Performance Table */}
           <div className="card p-0 overflow-hidden fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                 <h3 className="font-black text-lg text-white">Incoming Orders</h3>
                 <Link to="/orders" className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all">
                    View Ledger <ChevronRight size={14} />
                 </Link>
              </div>
              <div className="table-wrap border-none rounded-none">
                 <table>
                   <thead>
                     <tr>
                       <th>Item / Service</th>
                       <th>Customer</th>
                       <th>Revenue</th>
                       <th>Workflow</th>
                     </tr>
                   </thead>
                   <tbody>
                     {recentOrders.map((order) => {
                       const customer = getCustomer(order.customerId);
                       return (
                         <tr key={order.id}>
                           <td className="font-extrabold text-white">{order.item}</td>
                           <td className="text-text-secondary font-medium">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-bg-surface border border-white/10 flex items-center justify-center text-[10px] font-black">{customer?.name ? customer.name.charAt(0) : '?'}</div>
                                 {customer?.name || "Unknown Customer"}
                              </div>
                           </td>
                           <td className="font-black text-white">{formatNaira(order.amount)}</td>
                           <td><Badge label={order.status} /></td>
                         </tr>
                       );
                     })}
                     {recentOrders.length === 0 && (
                       <tr><td colSpan="4" className="text-center py-20 text-text-muted font-bold italic">No active pipelines found.</td></tr>
                     )}
                   </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8 fadeInUp" style={{ animationDelay: '0.2s' }}>
           {/* Quick Actions */}
           <div className="card bg-primary/5 border-primary/10">
              <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <Zap size={14} className="fill-current" /> Fast Track
              </h3>
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => navigate("/customers")} className="btn btn-secondary text-xs h-12 bg-white/5 border-white/5 hover:bg-white/10">Leads</button>
                 <button onClick={() => navigate("/quick-replies")} className="btn btn-secondary text-xs h-12 bg-white/5 border-white/5 hover:bg-white/10">Replies</button>
                 <button onClick={() => navigate("/invoices")} className="btn btn-secondary text-xs h-12 bg-white/5 border-white/5 hover:bg-white/10">Invoice</button>
                 <button onClick={() => navigate("/broadcast")} className="btn btn-secondary text-xs h-12 bg-white/5 border-white/5 hover:bg-white/10">Blast</button>
              </div>
           </div>

           {/* Elite Lead Board */}
           <div className="card">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="font-black text-sm uppercase tracking-widest text-text-muted">Top Prospects</h3>
                 <Link to="/customers" className="text-text-muted hover:text-white transition-colors"><ArrowRight size={16} /></Link>
              </div>
              <div className="space-y-6">
                 {recentCustomers.map((c) => (
                   <div key={c.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="avatar w-12 h-12 text-sm bg-bg-surface border-white/5 group-hover:border-primary/40 transition-colors">
                        {c.name ? c.name.charAt(0) : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="text-sm font-black text-white truncate">{c.name || "Untitled Lead"}</div>
                         <div className="text-xs font-bold text-text-muted">{c.phone || "No Number"}</div>
                      </div>
                      <Badge label={c.tag} />
                   </div>
                 ))}
                 {recentCustomers.length === 0 && (
                   <div className="text-center py-10 text-xs text-text-muted font-bold italic">No leads found.</div>
                 )}
              </div>
           </div>

           {/* System Tip */}
           <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                 <TrendingUp size={18} />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-bold italic opacity-60 px-4">
                "Targeted broadcasts have a 4x higher conversion rate than generic ones."
              </p>
           </div>
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
