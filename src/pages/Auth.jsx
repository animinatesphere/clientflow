import { useState, useEffect } from "react";
import {
  MessageCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth({ onLogin, onSignup, initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (formData.email && formData.password) {
          onLogin({
            email: formData.email,
            password: formData.password,
            name: formData.email.split("@")[0],
          });
        } else {
          setError("Invalid credentials. Please verify your entries.");
          setLoading(false);
        }
      } else {
        if (formData.name && formData.email && formData.password) {
          setSuccess(true);
          setTimeout(() => {
            onSignup(formData);
            setLoading(false);
          }, 1500);
        } else {
          setError("All profile fields are mandatory.");
          setLoading(false);
        }
      }
    }, 1200);
  };

  const set = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  const toggleMode = () => {
    const newMode = isLogin ? "signup" : "login";
    navigate(`/${newMode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-bg-primary">
      {/* Visual Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 fadeInUp">
        {/* Branding */}
        <div className="text-center mb-10 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(37,211,102,0.3)] mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500">
            <MessageCircle size={28} color="#000" fill="#000" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">Client<span className="text-primary">Flow</span></h1>
          <p className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.2em] mt-2">Enterprise Engagement Suite</p>
        </div>

        {/* Dynamic Card */}
        <div className="card shadow-2xl p-8 md:p-10">
          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-glow">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Identity Verified</h2>
              <p className="text-text-secondary font-medium text-sm leading-relaxed mb-8">
                Your professional profile has been initialized. Synchronizing environment...
              </p>
              <Loader2 className="animate-spin mx-auto text-primary" size={24} />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-center text-white tracking-tight mb-2">
                  {isLogin ? "Welcome Back" : "Sign Up"}
                </h2>
                <p className="text-text-secondary text-sm text-center font-medium tracking-tight">
                  {isLogin ? "Sign in to access your dashboard." : "Create your high-end business workspace."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1">Business Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        className="form-input pl-12 h-12 bg-white/[0.02]"
                        placeholder="e.g. Studio Oladimeji"
                        value={formData.name}
                        onChange={(e) => set("name", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      className="form-input pl-12 h-12 bg-white/[0.02]"
                      type="email"
                      placeholder="name@enterprise.com"
                      value={formData.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      className="form-input pl-12 pr-12 h-12 bg-white/[0.02]"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => set("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full h-14 text-base shadow-2xl group transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {isLogin ? "Login" : "Sign Up"}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-sm font-bold text-text-secondary">
                  {isLogin ? "New to ClientFlow?" : "Already have an account?"}{" "}
                  <button
                    onClick={toggleMode}
                    className=" text-center text-primary hover:text-white underline underline-offset-4 transition-colors font-black"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="mt-12 flex items-center justify-center gap-8 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 italic">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> End-to-End Encrypted
          </div>
          <div className="flex items-center gap-2 italic">
             <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Server Status: Optimal
          </div>
        </div>
      </div>
    </div>
  );
}
