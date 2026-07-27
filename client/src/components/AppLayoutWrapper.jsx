"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../app/providers";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import TwoFAChallengePage from "../page-views/TwoFAChallengePage";
import { getMe } from "../services/api";

export default function AppLayoutWrapper({ children }) {
  const {
    user,
    logout,
    pending2FA,
    setPending2FA,
    handle2FASuccess,
    matchCount,
    messageCount,
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inMaintenance, setInMaintenance] = useState(false);

  // Extract page ID from pathname (e.g. /dashboard -> dashboard)
  const currentPage = pathname.replace(/^\//, "") || "dashboard";

  const navigate = (page, params = {}) => {
    if (page === "admin-dashboard" && user?.role !== "admin") {
      router.push(user ? "/dashboard" : "/admin-login");
    } else {
      let target = page.startsWith("/") ? page : "/" + page;
      if (page === "reset-password" && params?.token) {
        target = `/reset-password/${params.token}`;
      }
      router.push(target);
    }
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Auth Guard: if not authenticated and not on an auth route, redirect to /login
    const authRoutes = ["/login", "/register", "/admin-login", "/forgot-password", "/reset-password"];
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (!user && !isAuthRoute) {
      router.push("/login");
    }

    // Check Maintenance Mode
    if (user?.role !== "admin" && !pathname.startsWith("/admin-login")) {
      const checkMaintenance = async () => {
        try {
          await getMe();
          setInMaintenance(false);
        } catch (err) {
          if (err.status === 503 || err.message?.includes("maintenance")) {
            setInMaintenance(true);
          }
        }
      };
      checkMaintenance();
    }
  }, [user, pathname, router]);

  // Show Maintenance Screen
  if (inMaintenance && user?.role !== "admin" && !pathname.startsWith("/admin-login")) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: 'white',
        fontFamily: 'Outfit, sans-serif',
        textAlign: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '500px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.6s ease'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛠️</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Scheduled Maintenance</h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
            ResourceMatch is currently undergoing scheduled platform updates to improve our service. We'll be back shortly!
          </p>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Thanks for your patience
          </div>
        </div>
      </div>
    );
  }

  // Show 2FA challenge screen when pending
  if (pending2FA) {
    return (
      <div className="auth-wrapper">
        <TwoFAChallengePage
          preAuthToken={pending2FA.preAuthToken}
          partialUser={pending2FA.partialUser}
          onSuccess={handle2FASuccess}
          onBack={() => {
            setPending2FA(null);
            router.push("/login");
          }}
        />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        user={user}
        onLogout={handleLogout}
        matchCount={matchCount}
        messageCount={messageCount}
        className={isSidebarOpen ? "open" : ""}
      />
      <div className="app-main">
        <Navbar
          currentPage={currentPage}
          navigate={navigate}
          user={user}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
