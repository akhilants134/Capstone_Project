"use client";

import { useRouter } from "next/navigation";
import ForgotPasswordPage from "../../page-views/ForgotPasswordPage";

export default function ForgotPasswordRoute() {
  const router = useRouter();

  const navigate = (page) => {
    router.push("/" + page);
  };

  return (
    <div className="auth-wrapper">
      <ForgotPasswordPage navigate={navigate} />
    </div>
  );
}
