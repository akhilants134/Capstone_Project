"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import DonationsPage from "../../page-views/DonationsPage";
import { useAuth } from "../providers";

export default function DonationsRoute() {
  const { user } = useAuth();

  return (
    <AppLayoutWrapper>
      <DonationsPage user={user} />
    </AppLayoutWrapper>
  );
}
