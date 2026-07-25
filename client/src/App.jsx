import { useEffect, useState } from "react";
import "./App.css";
import { getMyMatches, getConversations } from "./services/api";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BrowsePage from "./pages/BrowsePage";
import PostRequestPage from "./pages/PostRequestPage";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import DonationsPage from "./pages/DonationsPage";
import ShareSomethingPage from "./pages/ShareSomethingPage";
import SettingsPage from "./pages/SettingsPage";
import TwoFAChallengePage from "./pages/TwoFAChallengePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("themeMode");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }

    return "dark";
  };

  const normalizeStoredUser = (storedUser) => {
    if (!storedUser || typeof storedUser !== "object") {
      return null;
    }

    const { token: _, ...profile } = storedUser;
    return profile;
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? normalizeStoredUser(JSON.parse(saved)) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.role === 'admin' ? "admin-dashboard" : "dashboard";
    }
    return "login";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState(getInitialTheme);
  // 2FA pending state — set when login responds with requires2FA
  const [pending2FA, setPending2FA] = useState(null); // { preAuthToken, partialUser }
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem("themeMode")) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Extract reset token from URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      const token = path.split('/reset-password/')[1];
      if (token) {
        setResetToken(token);
        setCurrentPage('reset-password');
      }
    }
  }, []);

  const [matchCount, setMatchCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setMatchCount(0);
      setMessageCount(0);
      return;
    }

    const fetchCounts = async () => {
      try {
        // Fetch matches
        const matchesRes = await getMyMatches().catch(() => ({ data: { matches: [] } }));
        const matchList = matchesRes.data?.matches || matchesRes.matches || [];
        
        // Load mock matches from localStorage if database is empty
        let activeMockMatches = [];
        const storedMockMatches = localStorage.getItem('mock_matches');
        if (storedMockMatches) {
          activeMockMatches = JSON.parse(storedMockMatches);
        } else {
          // Initialize mock matches in localStorage if they don't exist
          const defaultMatches = [
            { id: 1, resource: 'MacBook Pro 2021', donor: 'TechCorp Inc.', donorInitial: 'T', category: '💻', value: '$1,200', status: 'pending', matchScore: 97, date: '2 hrs ago', desc: 'A perfect match for your tech resource request. The donor has confirmed availability.' },
            { id: 2, resource: '50 Medical Kits', donor: 'HealthFirst NGO', donorInitial: 'H', category: '💊', value: '$800', status: 'accepted', matchScore: 91, date: '1 day ago', desc: 'Your medical supplies request has been accepted. Awaiting delivery coordination.' },
          ];
          localStorage.setItem('mock_matches', JSON.stringify(defaultMatches));
          activeMockMatches = defaultMatches;
        }

        const totalMatchesCount = matchList.length > 0 ? matchList.length : activeMockMatches.length;
        setMatchCount(totalMatchesCount);

        // Fetch conversations
        const convosRes = await getConversations().catch(() => ({ data: { conversations: [] } }));
        const convosList = convosRes.data?.conversations || [];
        
        // Sum unread messages in conversations
        const totalUnread = convosList.reduce((acc, c) => acc + (c.unread || 0), 0);
        setMessageCount(totalUnread);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
    // Poll counts every 10 seconds or fetch on component mounting/page change
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, [user, currentPage]);

  // Simple routing logic
  const navigate = (page, params = {}) => {
    if (page === "admin-dashboard" && user?.role !== "admin") {
      setCurrentPage(user ? "dashboard" : "admin-login");
    } else {
      setCurrentPage(page);
      if (params.token) {
        setResetToken(params.token);
      }
    }
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogin = (userData) => {
    // If the server indicated 2FA is required, show the challenge page
    if (userData && userData.requires2FA) {
      setPending2FA({ preAuthToken: userData.preAuthToken, partialUser: userData.data?.user });
      return;
    }
    const profile = normalizeStoredUser(userData);
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
    setPending2FA(null);
    // Route admin to admin dashboard, others to regular dashboard
    setCurrentPage(profile.role === 'admin' ? 'admin-dashboard' : 'dashboard');
  };

  const handle2FASuccess = (userData) => {
    const profile = normalizeStoredUser(userData);
    setUser(profile);
    localStorage.setItem("user", JSON.stringify(profile));
    setPending2FA(null);
    setCurrentPage(profile.role === 'admin' ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPending2FA(null);
    localStorage.removeItem("user");
    setCurrentPage("login");
  };

  const renderPage = () => {
    // Auth Guard
    if (!user && currentPage !== "login" && currentPage !== "register" && currentPage !== "admin-login" && currentPage !== "forgot-password" && !currentPage.startsWith("reset-password")) {
      return <LoginPage navigate={navigate} onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case "login":
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case "admin-login":
        return <AdminLoginPage navigate={navigate} onLogin={handleLogin} />;
      case "register":
        return <RegisterPage navigate={navigate} onLogin={handleLogin} />;
      case "forgot-password":
        return <ForgotPasswordPage navigate={navigate} />;
      case "reset-password":
        return <ResetPasswordPage navigate={navigate} token={resetToken} onLogin={handleLogin} />;
      case "dashboard":
        return <DashboardPage navigate={navigate} user={user} />;
      case "browse":
        return <BrowsePage navigate={navigate} user={user} />;
      case "post-request":
        return <PostRequestPage navigate={navigate} />;
      case "matches":
        return <MatchesPage navigate={navigate} user={user} />;
      case "profile":
        return (
          <ProfilePage
            navigate={navigate}
            user={user}
            onUserUpdate={(updatedUser) => {
              const profile = normalizeStoredUser(updatedUser);
              setUser(profile);
              localStorage.setItem("user", JSON.stringify(profile));
            }}
          />
        );
      case "messages":
        return <MessagesPage navigate={navigate} user={user} />;
      case "donations":
        return <DonationsPage navigate={navigate} user={user} />;
      case "share-something":
        return <ShareSomethingPage navigate={navigate} />;
      case "settings":
        return (
          <SettingsPage
            navigate={navigate}
            user={user}
            onUserUpdate={(updatedUser) => {
              const profile = normalizeStoredUser(updatedUser);
              setUser(profile);
              localStorage.setItem("user", JSON.stringify(profile));
            }}
            themeMode={themeMode}
            onThemeChange={setThemeMode}
          />
        );
      case "admin-dashboard":
        if (user?.role !== "admin") return <DashboardPage navigate={navigate} user={user} />;
        return <AdminDashboardPage navigate={navigate} user={user} onLogout={handleLogout} />;
      default:
        return <DashboardPage navigate={navigate} user={user} />;
    }
  };

  // Show 2FA challenge screen when pending
  if (pending2FA) {
    return (
      <div className="auth-wrapper">
        <TwoFAChallengePage
          preAuthToken={pending2FA.preAuthToken}
          partialUser={pending2FA.partialUser}
          onSuccess={handle2FASuccess}
          onBack={() => { setPending2FA(null); setCurrentPage("login"); }}
        />
      </div>
    );
  }

  // Auth pages layout
  if (currentPage === "login" || currentPage === "register" || currentPage === "admin-login" || currentPage === "forgot-password" || currentPage === "reset-password") {
    return <div className="auth-wrapper">{renderPage()}</div>;
  }

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        user={user}
        onLogout={handleLogout}
        matchCount={matchCount}
        messageCount={messageCount}
        className={isSidebarOpen ? "open" : ""}
      />
      <div className="app-main">
        <Navbar
          currentPage={currentPage}
          navigate={navigate}
          user={user}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="app-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
