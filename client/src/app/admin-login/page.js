"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import AdminLoginPage from "../../page-views/AdminLoginPage";

export default function AdminLoginRoute() {
  const router = useRouter();
  const { login } = useAuth();

  const navigate = (page) => {
    router.push("/" + page);
  };

  const handleLogin = (userData) => {
    const result = login(userData);
    if (!result.requires2FA) {
      if (result.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <AdminLoginPage navigate={navigate} onLogin={handleLogin} />
    </div>
  );
}
