import { useState } from "react";
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

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? "dashboard" : "login";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simple routing logic
  const navigate = (page) => {
    setCurrentPage(page);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("login");
  };


  const renderPage = () => {
    // Auth Guard
    if (!user && currentPage !== "login" && currentPage !== "register") {
      return <LoginPage navigate={navigate} onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case "login":
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
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
      default:
        return <DashboardPage navigate={navigate} user={user} />;
    }
  };

  // Auth pages layout
  if (currentPage === "login" || currentPage === "register") {
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
        <main className="app-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
