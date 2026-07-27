"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /admin-login is no longer a separate entry point.
 * Administrators sign in through the unified /login form.
 * The backend returns a role in the JWT; the client redirects
 * to /admin-dashboard automatically when role === "admin".
 */
export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
