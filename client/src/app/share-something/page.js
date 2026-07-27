"use client";

import { useRouter } from "next/navigation";
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import ShareSomethingPage from "../../page-views/ShareSomethingPage";

export default function ShareSomethingRoute() {
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
      <ShareSomethingPage navigate={navigate} />
    </AppLayoutWrapper>
  );
}
