"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import BrowsePage from "../../page-views/BrowsePage";
import { useAuth } from "../providers";

export default function BrowseRoute() {
  const { user } = useAuth();

  return (
    <AppLayoutWrapper>
      <BrowsePage user={user} />
    </AppLayoutWrapper>
  );
}
