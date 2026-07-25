"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../providers";
import ResetPasswordPage from "../../../page-views/ResetPasswordPage";

export default function ResetPasswordRoute() {
  const router = useRouter();
  const params = useParams();
  const { login } = useAuth();

  const token = params.token;

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
      <ResetPasswordPage navigate={navigate} token={token} onLogin={handleLogin} />
    </div>
  );
}
