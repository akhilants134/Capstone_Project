"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import SettingsPage from "../../page-views/SettingsPage";
import { useAuth, useTheme } from "../providers";

export default function SettingsRoute() {
  const { user, setUser } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser) return;
    const { token: _, ...profile } = updatedUser;
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
  };

  return (
    <AppLayoutWrapper>
      <SettingsPage
        user={user}
        onUserUpdate={handleUserUpdate}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
      />
    </AppLayoutWrapper>
  );
}
