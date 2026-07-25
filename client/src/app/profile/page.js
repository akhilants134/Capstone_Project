"use client";

import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import ProfilePage from "../../page-views/ProfilePage";
import { useAuth } from "../providers";

export default function ProfileRoute() {
  const { user, setUser } = useAuth();

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser) return;
    const { token: _, ...profile } = updatedUser;
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
  };

  return (
    <AppLayoutWrapper>
      <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
    </AppLayoutWrapper>
  );
}
