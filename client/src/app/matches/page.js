"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import MatchesPage from "../../page-views/MatchesPage";
import { useAuth } from "../providers";

export default function MatchesRoute() {
  const { user } = useAuth();

  return (
    <AppLayoutWrapper>
      <MatchesPage user={user} />
    </AppLayoutWrapper>
  );
}
