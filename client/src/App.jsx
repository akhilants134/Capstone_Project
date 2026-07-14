import { useEffect, useState } from "react";
import "./App.css";

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

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // Simple routing logic
  const navigate = (page) => {
    if (page === "admin-dashboard" && user?.role !== "admin") {
      setCurrentPage(user ? "dashboard" : "admin-login");
    } else {
      setCurrentPage(page);
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
    if (!user && currentPage !== "login" && currentPage !== "register" && currentPage !== "admin-login") {
      return <LoginPage navigate={navigate} onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case "login":
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case "admin-login":
        return <AdminLoginPage navigate={navigate} onLogin={handleLogin} />;
      case "register":
        return <RegisterPage navigate={navigate} onLogin={handleLogin} />;
      case "dashboard":
        return <DashboardPage navigate={navigate} user={user} />;
      case "browse":
        return <BrowsePage navigate={navigate} user={user} />;
      case "post-request":
        return <PostRequestPage navigate={navigate} />;
      case "matches":
        return <MatchesPage navigate={navigate} user={user} />;
      case "profile":
        return <ProfilePage navigate={navigate} user={user} />;
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
  if (currentPage === "login" || currentPage === "register" || currentPage === "admin-login") {
    return <div className="auth-wrapper">{renderPage()}</div>;
  }

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        user={user}
        onLogout={handleLogout}
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
