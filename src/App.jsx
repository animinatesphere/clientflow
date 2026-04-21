import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import ToastContainer from "./components/ui/ToastContainer";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import QuickReplies from "./pages/QuickReplies";
import Broadcast from "./pages/Broadcast";
import Settings from "./pages/Settings";
import OnboardingModal from "./components/ui/OnboardingModal";
import "./index.css";
import Invoices from "./pages/Invoices";
import BusinessProfile from "./pages/BusinessProfile";
import PublicProfile from "./pages/PublicProfile";
// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Auth Route Component (redirects to dashboard if already logged in)
function AuthRoute({ children }) {
  const { user } = useStore();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  if (user) {
    return <Navigate to={from} replace />;
  }

  return children;
}

// Layout wrapper for the main app
function AppLayout({ children }) {
  const store = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebar] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Derive current page ID from pathname
  const path = location.pathname.substring(1) || "dashboard";

  // Show onboarding once after signup
  useEffect(() => {
    if (!localStorage.getItem("cf_onboarded")) {
      setShowOnboarding(true);
    }
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem("cf_onboarded", "true");
    setShowOnboarding(false);
  };

  const handleLogout = async () => {
    await store.signOut();
    navigate("/");
  };

  // Mobile sidebar toggle button visibility
  useEffect(() => {
    const btn = document.getElementById("sidebar-toggle");
    const check = () => {
      if (btn) btn.style.display = window.innerWidth <= 768 ? "flex" : "none";
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        page={path}
        isOpen={sidebarOpen}
        onClose={() => setSidebar(false)}
        user={store.user}
        onLogout={handleLogout}
      />

      <div className="flex-1 lg:pl-72 transition-all duration-500">
        <TopBar page={path} onMenuClick={() => setSidebar((s) => !s)} user={store.user} />
        <main className="relative z-0">
          {children}
        </main>
      </div>

      <ToastContainer toasts={store.toasts} />
      {showOnboarding && <OnboardingModal onClose={handleFinishOnboarding} />}
    </div>
  );
}

export default function App() {
  const store = useStore();
  const navigate = useNavigate();

  const handleLogin = (user) => {
    (async () => {
      const res = await store.signIn(user.email, user.password);
      // Only navigate if a session exists (user signed in successfully)
      if (res?.sessionExists) navigate("/dashboard");
    })();
  };

  const handleSignup = (user) => {
    (async () => {
      const res = await store.signUp(user);
      // Only navigate if signUp returned an active session
      if (res?.sessionExists) navigate("/dashboard");
    })();
  };

  return (
    <Routes>
      {/* Landing Page as entry point */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Business Profile - No Auth Required */}
      <Route path="/biz/:username" element={<PublicProfile store={store} />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Auth
              onLogin={handleLogin}
              onSignup={handleSignup}
              initialMode="login"
            />
          </AuthRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Invoices store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Auth
              onLogin={handleLogin}
              onSignup={handleSignup}
              initialMode="signup"
            />
          </AuthRoute>
        }
      />

      {/* Protected App Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Customers store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Orders store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/business-profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BusinessProfile store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/quick-replies"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuickReplies store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/broadcast"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Broadcast store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings store={store} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
