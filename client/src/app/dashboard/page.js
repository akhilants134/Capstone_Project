"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import DashboardPage from "../../page-views/DashboardPage";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";

export default function DashboardRoute() {
  const { user } = useAuth();
  const router = useRouter();

  const navigate = (page, params = {}) => {
    let target = page.startsWith("/") ? page : "/" + page;
    if (page === "reset-password" && params?.token) {
      target = `/reset-password/${params.token}`;
    }
    router.push(target);
  };

  return (
    <AppLayoutWrapper>
      <DashboardPage user={user} navigate={navigate} />
    </AppLayoutWrapper>
  );
}
