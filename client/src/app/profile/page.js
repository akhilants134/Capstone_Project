"use client";

import { useRouter } from "next/navigation";
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import ProfilePage from "../../page-views/ProfilePage";
import { useAuth } from "../providers";

export default function ProfileRoute() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const navigate = (page, params = {}) => {
    let target = page.startsWith("/") ? page : "/" + page;
    if (page === "reset-password" && params?.token) {
      target = `/reset-password/${params.token}`;
    }
    router.push(target);
  };

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser) return;
    const { token: _, ...profile } = updatedUser;
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
  };

  return (
    <AppLayoutWrapper>
      <ProfilePage user={user} onUserUpdate={handleUserUpdate} navigate={navigate} />
    </AppLayoutWrapper>
  );
}
