"use client";

import { useRouter } from "next/navigation";
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import MessagesPage from "../../page-views/MessagesPage";
import { useAuth } from "../providers";

export default function MessagesRoute() {
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
      <MessagesPage user={user} navigate={navigate} />
    </AppLayoutWrapper>
  );
}
