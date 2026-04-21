import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  TrendingUp,
  Radio,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Play,
  CheckCircle2,
  ChevronRight,
  Star as StarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "../components/ui/Logo";

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <div
      className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
        <Icon size={120} className="text-primary" />
      </div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-text-secondary leading-relaxed text-sm lg:text-base">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({ title, price, features, recommended = false, cta = "Get Started" }) {
  return (
    <div className={`relative p-8 rounded-3xl border ${recommended ? 'border-primary bg-primary/[0.03] shadow-[0_0_80px_-20px_rgba(37,211,102,0.15)]' : 'border-white/5 bg-white/[0.02]'} flex flex-col h-full transition-all duration-500 hover:translate-y-[-8px]`}>
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-black text-[0.7rem] font-black uppercase tracking-widest rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-text-secondary mb-2 uppercase tracking-widest">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl lg:text-5xl font-black">₦{price}</span>
          <span className="text-text-muted font-medium">/mo</span>
        </div>
      </div>
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
            <CheckCircle2 size={18} className={recommended ? "text-primary" : "text-text-muted"} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={`btn w-full h-14 ${recommended ? 'btn-primary' : 'btn-secondary'} text-base`}
      >
        {cta}
      </Link>
    </div>
  );
}

const StarElement = ({ className }) => (
  <StarIcon className={`text-yellow-500 fill-yellow-500 ${className}`} size={16} />
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 shadow-[0_0_30px_rgba(37,211,102,0.4)] flex items-center justify-center">
                <Logo size={40} />
             </div>
             <span className="text-xl font-black tracking-tighter text-white">Client<span className="text-primary">Flow</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-text-secondary">
             <a href="#features" className="hover:text-primary transition-colors">Features</a>
             <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
             <a href="#testimonials" className="hover:text-primary transition-colors">Success Stories</a>
          </div>

          <div className="flex items-center gap-4">
             <Link to="/login" className="hidden sm:block text-sm font-bold hover:text-primary transition-colors">Log In</Link>
             <Link to="/signup" className="btn btn-primary px-6 h-11 text-sm shadow-xl">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 px-6 overflow-hidden">
         <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary mb-10 fadeInUp">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </span>
               New: Bulk Invoicing via WhatsApp
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05] fadeInUp">
               Automate Your <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary animate-gradient-x">WhatsApp CRM</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed font-medium fadeInUp" style={{ animationDelay: '0.1s' }}>
               The fastest way for Nigerian small businesses to manage customers, track orders, and send broadcasts without saving numbers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fadeInUp" style={{ animationDelay: '0.2s' }}>
               <Link to="/signup" className="btn btn-primary h-16 px-10 text-lg shadow-2xl group">
                  Start My Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
               </Link>
               <button className="btn btn-secondary h-16 px-10 text-lg group">
                  <Play size={20} className="fill-current" /> Watch Demo
               </button>
            </div>

            {/* Trusted By */}
            <div className="mt-24 pt-12 border-t border-white/5 fadeInUp" style={{ animationDelay: '0.4s' }}>
                <p className="text-[0.7rem] uppercase tracking-[0.3em] font-black text-text-muted mb-8">Trusted by 500+ Nigerian Entrepreneurs</p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    <span className="text-2xl font-black italic">MAZAD</span>
                    <span className="text-xl font-bold">Ade's Kitchen</span>
                    <span className="text-2xl font-serif">KORE</span>
                    <span className="text-2xl font-bold tracking-widest">BEAU</span>
                    <span className="text-xl font-mono">NaijaStore</span>
                </div>
            </div>
         </div>

         {/* Floating Dashboard Mockup */}
         <div className="mt-20 max-w-6xl mx-auto relative perspective-1000 fadeInUp" style={{ animationDelay: '0.5s' }}>
             <div className="relative group bg-bg-secondary rounded-[2rem] p-2 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="bg-bg-primary rounded-[1.5rem] overflow-hidden border border-white/5">
                   <div className="h-10 bg-white/5 flex items-center gap-2 px-4 border-b border-white/5">
                      <div className="flex gap-1.5">
                         <div className="w-3 h-3 rounded-full bg-red-500/20" />
                         <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                         <div className="w-3 h-3 rounded-full bg-green-500/20" />
                      </div>
                      <div className="mx-auto bg-white/5 px-6 py-1 rounded-full text-[10px] text-text-muted font-bold">clientflow.io/dashboard</div>
                   </div>
                   <div className="p-4 sm:p-8">
                       <div className="grid grid-cols-12 gap-6">
                           <div className="col-span-3 space-y-4">
                              <div className="h-12 w-full bg-white/5 rounded-xl shimmer" />
                              <div className="h-40 w-full bg-white/5 rounded-2xl shimmer" />
                              <div className="h-8 w-full bg-white/5 rounded-lg shimmer" />
                              <div className="h-8 w-full bg-white/5 rounded-lg shimmer" />
                           </div>
                           <div className="col-span-9 space-y-6">
                              <div className="grid grid-cols-3 gap-6">
                                 <div className="h-32 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex flex-col justify-between">
                                    <div className="h-4 w-12 bg-primary/20 rounded" />
                                    <div className="h-8 w-24 bg-primary/40 rounded" />
                                 </div>
                                 <div className="h-32 bg-white/5 border border-white/5 rounded-2xl p-4" />
                                 <div className="h-32 bg-white/5 border border-white/5 rounded-2xl p-4" />
                              </div>
                              <div className="h-64 w-full bg-white/5 border border-white/5 rounded-3xl p-6">
                                 <div className="flex justify-between mb-8">
                                    <div className="h-6 w-32 bg-white/10 rounded" />
                                    <div className="h-6 w-24 bg-white/10 rounded" />
                                 </div>
                                 <div className="space-y-4">
                                    {[1,2,3].map(i => (
                                      <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                           <div className="h-3 w-1/3 bg-white/10 rounded" />
                                           <div className="h-2 w-1/4 bg-white/5 rounded" />
                                        </div>
                                        <div className="h-6 w-16 bg-primary/10 rounded-full" />
                                      </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                       </div>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-40 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 max-w-3xl mx-auto">
               <h2 className="text-xs uppercase tracking-[0.4em] font-black text-primary mb-4">Features</h2>
               <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Everything You Need <br /> To Close More Deals.</h3>
               <p className="text-lg text-text-secondary font-medium">Built specifically for the African business ecosystem. No fluff, just the tools that actually grow your revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <FeatureCard
                 icon={Users}
                 title="Bulk Messaging"
                 description="Send personalized updates to all your customers at once. No more saving individual numbers or getting banned."
               />
               <FeatureCard
                 icon={Zap}
                 title="Quick Replies"
                 description="Save your FAQ responses and pricing lists. Send them with one click instead of typing the same thing 100 times."
               />
               <FeatureCard
                 icon={TrendingUp}
                 title="Revenue Tracking"
                 description="See exactly how much you're making daily. Track pending payments and delivered orders automatically."
               />
               <FeatureCard
                 icon={Radio}
                 title="Smart Broadcasts"
                 description="Segment your audience by tags (VIP, New, Returning) and send ultra-targeted messages that convert."
               />
               <FeatureCard
                 icon={ShieldCheck}
                 title="Auto-Invoicing"
                 description="Generate professional PDF receipts and invoices and send them directly to WhatsApp in seconds."
               />
               <FeatureCard
                 icon={MessageCircle}
                 title="Contact Management"
                 description="Own your customer data. Import numbers, add private notes, and never lose a lead in a crowded chat again."
               />
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-40 px-6 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-xs uppercase tracking-[0.4em] font-black text-primary mb-4">Pricing</h2>
               <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Start Small, <br /> Scale Fast.</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               <PricingCard
                 title="Free Starter"
                 price="0"
                 features={[
                   "Up to 20 Customers",
                   "3 Active Orders",
                   "5 Quick Replies",
                   "Basic Broadcasts",
                   "WhatsApp Support"
                 ]}
                 cta="Start for Free"
               />
               <PricingCard
                 title="Growth Pro"
                 price="1,500"
                 recommended={true}
                 features={[
                   "Unlimited Customers",
                   "Unlimited Orders",
                   "Unlimited Quick Replies",
                   "Priority Smart Broadcasts",
                   "Custom Branding",
                   "Revenue Analytics",
                   "Priority Support"
                 ]}
                 cta="Upgrade to Pro"
               />
               <PricingCard
                 title="Business Elite"
                 price="12,500"
                 features={[
                   "Multiple Team Access",
                   "API Integrations",
                   "Multi-Channel Manager",
                   "Dedicated Account Manager",
                   "Advanced Security",
                   "Early Access Features"
                 ]}
                 cta="Contact Sales"
               />
            </div>
         </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section id="testimonials" className="py-24 lg:py-40 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-xs uppercase tracking-[0.4em] font-black text-primary mb-4">Testimonials</h2>
                  <h3 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">Real Results <br /> From Real Souls.</h3>
                  <p className="text-xl text-text-secondary mb-10 leading-relaxed font-medium">Join thousands of Nigerian entrepreneurs who have transformed their chaotic WhatsApp chats into a streamlined sales engine.</p>
                  
                  <div className="flex gap-4">
                     <div className="flex flex-col">
                        <span className="text-4xl font-black text-white">2.4k+</span>
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted mt-2">Active Users</span>
                     </div>
                     <div className="w-px h-16 bg-white/10 mx-4" />
                     <div className="flex flex-col">
                        <span className="text-4xl font-black text-white">₦500M+</span>
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted mt-2">Volume Processed</span>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  <div className="card p-10 relative z-10">
                     <div className="flex gap-1 mb-6">
                        <StarElement /><StarElement /><StarElement /><StarElement /><StarElement />
                     </div>
                     <p className="text-2xl font-bold italic leading-relaxed text-white mb-8">
                        "ClientFlow changed everything for my pastry business. I used to spend 4 hours every night replying to customers. Now I do it in 20 minutes."
                     </p>
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                           <div className="w-full h-full rounded-full bg-bg-primary overflow-hidden">
                              <img src="https://ui-avatars.com/api/?name=Funmi+O&background=random" alt="User" />
                           </div>
                        </div>
                        <div>
                           <div className="text-lg font-black text-white">Funmi Okeremute</div>
                           <div className="text-sm font-bold text-primary">Founder, Treats By Funmi</div>
                        </div>
                     </div>
                  </div>
                  {/* Decorative background cards */}
                  <div className="absolute top-10 -right-4 -left-4 h-full bg-primary/5 rounded-3xl -z-10 rotate-2 translate-y-4" />
                  <div className="absolute top-10 -right-10 -left-10 h-full bg-secondary/5 rounded-3xl -z-20 -rotate-2 translate-y-8" />
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-40 px-6">
         <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[3rem] bg-gradient-to-br from-primary to-emerald-900 overflow-hidden p-12 lg:p-24 text-center">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
               <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-black mb-8 leading-tight tracking-tight">Ready To Grow Your <br /> Business Professionally?</h2>
                  <p className="text-lg lg:text-xl text-black/70 font-bold mb-12 max-w-xl mx-auto">Stop managing your business from a random gallery. Setup your CRM in 2 minutes today.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <Link to="/signup" className="btn bg-black text-white px-10 h-16 text-lg hover:shadow-2xl active:scale-95 transition-all">Start For Free Today</Link>
                     <p className="text-[0.7rem] uppercase tracking-widest font-black text-black/50">No credit card required</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="col-span-2 lg:col-span-1">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                     <MessageCircle size={18} color="#000" fill="#000" />
                  </div>
                  <span className="text-lg font-black tracking-tighter text-white">Client<span className="text-primary">Flow</span></span>
               </div>
               <p className="text-sm text-text-secondary leading-relaxed max-w-xs">Connecting African entrepreneurs with their customers through professional WhatsApp automation.</p>
            </div>
            <div>
               <h4 className="text-xs uppercase tracking-widest font-black text-white mb-6">Product</h4>
               <ul className="space-y-4 text-sm text-text-secondary font-bold">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-xs uppercase tracking-widest font-black text-white mb-6">Legal</h4>
               <ul className="space-y-4 text-sm text-text-secondary font-bold">
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-xs uppercase tracking-widest font-black text-white mb-6">Connect</h4>
               <ul className="space-y-4 text-sm text-text-secondary font-bold">
                  <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">WhatsApp Community</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-text-muted">© 2026 ClientFlow Technologies Ltd. Built for the high-end entrepreneur.</p>
            <div className="flex items-center gap-4 text-text-muted">
               <span className="text-[10px] font-black p-1 px-2 rounded bg-white/5 uppercase tracking-widest border border-white/5">NIGERIA</span>
               <span className="text-[10px] font-black p-1 px-2 rounded bg-white/5 uppercase tracking-widest border border-white/5">UK</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
