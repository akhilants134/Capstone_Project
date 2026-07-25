"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import LoginPage from "../../page-views/LoginPage";

export default function LoginRoute() {
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
      <LoginPage navigate={navigate} onLogin={handleLogin} />
    </div>
  );
}
