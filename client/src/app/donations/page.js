"use client";

import { useRouter } from "next/navigation";
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import DonationsPage from "../../page-views/DonationsPage";
import { useAuth } from "../providers";

export default function DonationsRoute() {
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
      <DonationsPage user={user} navigate={navigate} />
    </AppLayoutWrapper>
  );
}
