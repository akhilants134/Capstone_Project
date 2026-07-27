"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import AdminDashboardPage from "../../page-views/AdminDashboardPage";
import DashboardPage from "../../page-views/DashboardPage";
import { useAuth } from "../providers";

export default function AdminDashboardRoute() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigate = (page, params = {}) => {
    let target = page.startsWith("/") ? page : "/" + page;
    if (page === "reset-password" && params?.token) {
      target = `/reset-password/${params.token}`;
    }
    router.push(target);
  };

  if (user?.role !== "admin") {
    return (
      <AppLayoutWrapper>
        <DashboardPage user={user} navigate={navigate} />
      </AppLayoutWrapper>
    );
  }

  return (
    <AppLayoutWrapper>
      <AdminDashboardPage user={user} onLogout={handleLogout} />
    </AppLayoutWrapper>
  );
}
