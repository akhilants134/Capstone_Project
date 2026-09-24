"use client";

import DashboardPage from "../../page-views/DashboardPage";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";

export default function DashboardClient({ initialStats = null }) {
  const { user } = useAuth();
  const router = useRouter();

  const navigate = (page, params = {}) => {
    let target = page.startsWith("/") ? page : "/" + page;
    if (page === "reset-password" && params?.token) {
      target = `/reset-password/${params.token}`;
    }
    router.push(target);
  };

  return <DashboardPage user={user} navigate={navigate} initialStats={initialStats} />;
}
