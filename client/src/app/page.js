"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid #fff", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
