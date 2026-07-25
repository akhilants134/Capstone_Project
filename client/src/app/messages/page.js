"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import MessagesPage from "../../page-views/MessagesPage";
import { useAuth } from "../providers";

export default function MessagesRoute() {
  const { user } = useAuth();

  return (
    <AppLayoutWrapper>
      <MessagesPage user={user} />
    </AppLayoutWrapper>
  );
}
