"use client";

import BrowsePage from "../../page-views/BrowsePage";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";


export default function BrowseClient({ initialListings = [] }) {
  const { user } = useAuth();
  const router = useRouter();

  const navigate = (page, params = {}) => {
    let target = page.startsWith("/") ? page : "/" + page;
    if (page === "reset-password" && params?.token) {
      target = `/reset-password/${params.token}`;
    }
    router.push(target);
  };

  return <BrowsePage user={user} navigate={navigate} initialListings={initialListings} />;
}
