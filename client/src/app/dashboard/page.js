"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import DashboardPage from "../../page-views/DashboardPage";
import { useAuth } from "../providers";

export default function DashboardRoute() {
  const { user } = useAuth();

  return (
    <AppLayoutWrapper>
      <DashboardPage user={user} />
    </AppLayoutWrapper>
  );
}
