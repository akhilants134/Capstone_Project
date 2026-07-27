"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import BrowsePage from "../../page-views/BrowsePage";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";

export default function BrowseRoute() {
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
      <BrowsePage user={user} navigate={navigate} />
    </AppLayoutWrapper>
  );
}
