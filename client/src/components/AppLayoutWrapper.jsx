"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../app/providers";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import TwoFAChallengePage from "../page-views/TwoFAChallengePage";

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
  }, [user, pathname, router]);

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
