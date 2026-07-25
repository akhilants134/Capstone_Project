"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import RegisterPage from "../../page-views/RegisterPage";

export default function RegisterRoute() {
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
      <RegisterPage navigate={navigate} onLogin={handleLogin} />
    </div>
  );
}
