/* global process */
import AppLayoutWrapper from "../../components/AppLayoutWrapper";
import BrowseClient from "./BrowseClient";

// Server-side Data Fetching (SSR)
async function getInitialListings() {
  const API_URL = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "http://localhost:5000/api/v1";
  try {
    const res = await fetch(`${API_URL}/listings`, { 
      cache: "no-store" // Dynamic SSR fetch on request
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.listings || [];
  } catch {
    // Fallback seed items during static build or offline mode

    return [
      {
        _id: "ssr-1",
        title: "Medical Diagnostic Equipment",
        category: "medical",
        type: "donation",
        urgency: "high",
        quantity: 2,
        estimatedValue: "$3,500",
        location: "Chicago, IL",
        description: "Standard hospital equipment for clinic relief.",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        _id: "ssr-2",
        title: "Laptops for STEM Students",
        category: "tech",
        type: "donation",
        urgency: "urgent",
        quantity: 5,
        estimatedValue: "$4,000",
        location: "New York, NY",
        description: "Refurbished laptops ready for distribution.",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export default async function BrowsePageSSR() {
  const initialListings = await getInitialListings();

  return (
    <AppLayoutWrapper>
      <BrowseClient initialListings={initialListings} />
    </AppLayoutWrapper>
  );
}
