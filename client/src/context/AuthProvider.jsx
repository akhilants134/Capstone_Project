"use client";

import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getMyMatches, getConversations } from "../services/api";

export function AuthProvider({ children }) {
  const normalizeStoredUser = (storedUser) => {
    if (!storedUser || typeof storedUser !== "object") {
      return null;
    }
    const { token: _, ...profile } = storedUser;
    return profile;
  };

  const [user, setUser] = useState(null);
  const [pending2FA, setPending2FA] = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(normalizeStoredUser(JSON.parse(saved)));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const login = (userData) => {
    if (userData && userData.requires2FA) {
      setPending2FA({
        preAuthToken: userData.preAuthToken,
        partialUser: userData.data?.user,
      });
      return { requires2FA: true };
    }
    const profile = normalizeStoredUser(userData);
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
    setPending2FA(null);
    return { requires2FA: false, role: profile.role };
  };

  const handle2FASuccess = (userData) => {
    const profile = normalizeStoredUser(userData);
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
    setPending2FA(null);
  };

  const logout = () => {
    setUser(null);
    setPending2FA(null);
    localStorage.removeItem("user");
  };

  // Fetch counts
  useEffect(() => {
    if (!user) {
      setMatchCount(0);
      setMessageCount(0);
      return;
    }

    const fetchCounts = async () => {
      try {
        const matchesRes = await getMyMatches().catch(() => ({ data: { matches: [] } }));
        const matchList = matchesRes.data?.matches || matchesRes.matches || [];

        let activeMockMatches = [];
        const storedMockMatches = localStorage.getItem("mock_matches");
        if (storedMockMatches) {
          activeMockMatches = JSON.parse(storedMockMatches);
        } else {
          const defaultMatches = [
            { id: 1, resource: "MacBook Pro 2021", donor: "TechCorp Inc.", donorInitial: "T", category: "💻", value: "$1,200", status: "pending", matchScore: 97, date: "2 hrs ago", desc: "A perfect match for your tech resource request. The donor has confirmed availability." },
            { id: 2, resource: "50 Medical Kits", donor: "HealthFirst NGO", donorInitial: "H", category: "💊", value: "$800", status: "accepted", matchScore: 91, date: "1 day ago", desc: "Your medical supplies request has been accepted. Awaiting delivery coordination." },
          ];
          localStorage.setItem("mock_matches", JSON.stringify(defaultMatches));
          activeMockMatches = defaultMatches;
        }

        const totalMatchesCount = matchList.length > 0 ? matchList.length : activeMockMatches.length;
        setMatchCount(totalMatchesCount);

        const convosRes = await getConversations().catch(() => ({ data: { conversations: [] } }));
        const convosList = convosRes.data?.conversations || [];
        const totalUnread = convosList.reduce((acc, c) => acc + (c.unread || 0), 0);
        setMessageCount(totalUnread);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Don't render until client-side hydration is ready to prevent SSR mismatches
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        pending2FA,
        setPending2FA,
        login,
        logout,
        handle2FASuccess,
        matchCount,
        messageCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
