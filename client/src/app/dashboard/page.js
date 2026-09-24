/* global process */
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import DashboardClient from "./DashboardClient";

// Server-side Data Fetching (SSR) for Dashboard initial statistics
async function getDashboardStats() {
  const API_URL = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "http://localhost:5000/api/v1";
  try {
    const res = await fetch(`${API_URL}/listings/stats`, { 
      cache: "no-store" 
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.stats || null;
  } catch {
    return {
      totalListings: 120,
      activeMatches: 45,
      impactScore: 890
    };
  }
}

export default async function DashboardRouteSSR() {
  const initialStats = await getDashboardStats();

  return (
    <AppLayoutWrapper>
      <DashboardClient initialStats={initialStats} />
    </AppLayoutWrapper>
  );
}
