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

  // Sync state if initialMode changes (e.g. user clicks direct link)
  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        if (formData.email && formData.password) {
          onLogin({
            email: formData.email,
            password: formData.password,
            name: formData.email.split("@")[0],
          });
        } else {
          setError("Please fill in all fields");
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
          setError("Please fill in all fields");
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
    <div
      className="lp-root"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Background elements from LandingPage */}
      <div className="lp-grid-bg" />
      <div className="lp-orb lp-orb-1" style={{ width: 400, height: 400 }} />
      <div className="lp-orb lp-orb-2" style={{ width: 300, height: 300 }} />

      <div
        className="lp-anim-in"
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            className="lp-logo-icon"
            style={{ margin: "0 auto 16px", width: 48, height: 48 }}
            onClick={() => navigate("/")}
          >
            <MessageCircle size={28} color="#000" fill="#000" />
          </div>
          <h1
            className="lp-logo-text"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Client<span>Flow</span>
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginTop: 8,
            }}
          >
            Professional WhatsApp CRM for Nigeria 🇳🇬
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{
            padding: 32,
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <CheckCircle size={56} color="var(--green)" />
              </div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Account Created!
              </h2>
              <p
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                Welcome to the professional way of selling on WhatsApp.
                Redirecting you...
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 24,
                }}
              >
                <Loader2
                  className="animate-spin"
                  size={20}
                  color="var(--green)"
                />
              </div>
            </div>
          ) : (
            <>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: 24,
                }}
              >
                {isLogin ? "Welcome Back" : "Create Business Account"}
              </h2>

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <div style={{ position: "relative" }}>
                      <User
                        style={{
                          position: "absolute",
                          left: 12,
                          top: 12,
                          color: "var(--text-muted)",
                        }}
                        size={16}
                      />
                      <input
                        className="form-input"
                        style={{ paddingLeft: 40 }}
                        placeholder="e.g. Ade Graphics"
                        value={formData.name}
                        onChange={(e) => set("name", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      style={{
                        position: "absolute",
                        left: 12,
                        top: 12,
                        color: "var(--text-muted)",
                      }}
                      size={16}
                    />
                    <input
                      className="form-input"
                      style={{ paddingLeft: 40 }}
                      type="email"
                      placeholder="ade@example.com"
                      value={formData.email}
                      onChange={(e) => set("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      style={{
                        position: "absolute",
                        left: 12,
                        top: 12,
                        color: "var(--text-muted)",
                      }}
                      size={16}
                    />
                    <input
                      className="form-input"
                      style={{ paddingLeft: 40, paddingRight: 40 }}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => set("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      color: "var(--red)",
                      fontSize: "0.75rem",
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="lp-cta-btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight size={18} />
                    </>
                  )}
                  <div className="lp-cta-shine" />
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={toggleMode}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--green)",
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            display: "flex",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <span>✓ Secure Encryption</span>
          <span>✓ Nigerian Powered 🇳🇬</span>
        </div>
      </div>
    </div>
  );
}
