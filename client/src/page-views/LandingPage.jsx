"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// Mock data for Simulator (static constant, defined outside component)
const mockMatches = [
  {
    id: 1,
    title: "15 Waterproof Backpacks & Stationery",
    category: "Supplies",
    type: "Donation Offered",
    emoji: "🎒",
    time: "2 mins ago",
    postedBy: "Techcorp CSR Team",
    matchedWith: "Oakwood Elementary School",
    location: "East District",
    matchScore: 98,
    desc: "Sturdy backpacks packed with writing materials, notebooks, and water bottles. Perfect for grade school students heading back to school.",
  },
  {
    id: 2,
    title: "Fresh Farm Organic Produce (50 lbs)",
    category: "Food",
    type: "Donation Offered",
    emoji: "🥦",
    time: "10 mins ago",
    postedBy: "Green Valley Farms",
    matchedWith: "Community Food Pantry",
    location: "Downtown Plaza",
    matchScore: 95,
    desc: "Freshly harvested spinach, kale, carrots, and potatoes. Kept in cold storage, ready for pickup.",
  },
  {
    id: 3,
    title: "3 Refurbished iPad Pro (2020) Tablets",
    category: "Tech",
    type: "Request Posted",
    emoji: "💻",
    time: "1 hr ago",
    postedBy: "Aspire Youth Center",
    matchedWith: "Awaiting Donor",
    location: "North Precinct",
    matchScore: 89,
    desc: "Looking for tablets to support digital arts classes for underprivileged teenagers. Chargers included would be appreciated.",
  },
  {
    id: 4,
    title: "Winter Coats & Warm Clothes (Various Sizes)",
    category: "Clothing",
    type: "Donation Offered",
    emoji: "🧥",
    time: "3 hrs ago",
    postedBy: "Metro Clothing Store",
    matchedWith: "Downtown Shelter Coalition",
    location: "West End",
    matchScore: 92,
    desc: "Box of 20 clean, brand-new winter jackets, beanies, and wool socks for men and women.",
  },
  {
    id: 5,
    title: "Wheelchair & Medical Walkers",
    category: "Supplies",
    type: "Request Posted",
    emoji: "🏥",
    time: "4 hrs ago",
    postedBy: "ElderCare Welfare Foundation",
    matchedWith: "MedAccess Solutions",
    location: "South Suburbs",
    matchScore: 94,
    desc: "Urgently seeking standard manual wheelchairs and walking assistance frames for elderly residents.",
  },
  {
    id: 6,
    title: "20 Servings of Hot Prepared Meals",
    category: "Food",
    type: "Request Posted",
    emoji: "🍲",
    time: "5 mins ago",
    postedBy: "Overnight Shelter Project",
    matchedWith: "Awaiting Donor",
    location: "Central Square",
    matchScore: 91,
    desc: "Urgently seeking dinner meals or soup kitchen catering surplus to feed local unhoused population tonight.",
  }
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Interactive Match Simulator State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalMatch, setActiveModalMatch] = useState(null);

  // How It Works State
  const [activeRoleMode, setActiveRoleMode] = useState("donor"); // 'donor' or 'recipient'

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  // Filtering mock data
  const filteredMatches = useMemo(() => {
    return mockMatches.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.postedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--gradient-hero)",
      color: "var(--text-primary)",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* CSS Animations & Custom Rules */}
      <style jsx global>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          box-shadow: 0 0 15px rgba(15, 159, 110, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .animate-glow:hover {
          box-shadow: 0 0 30px rgba(15, 159, 110, 0.25);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-strong);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>

      {/* Contained Decorative Glow Elements to prevent vertical scroll spacing issues */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1
      }}>
        <div style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)"
        }} />
        <div style={{
          position: "absolute",
          top: "40%",
          right: "-200px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-100px",
          left: "100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)"
        }} />
      </div>

      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 48px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-glass)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 30px var(--primary-glow)",
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central node */}
              <circle cx="12" cy="12" r="3" fill="white"/>
              {/* Top-left node */}
              <circle cx="5" cy="6" r="2" fill="rgba(255,255,255,0.85)"/>
              {/* Top-right node */}
              <circle cx="19" cy="6" r="2" fill="rgba(255,255,255,0.85)"/>
              {/* Bottom node */}
              <circle cx="12" cy="20" r="2" fill="rgba(255,255,255,0.85)"/>
              {/* Connecting lines */}
              <line x1="7" y1="7.4" x2="10.2" y2="10.2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="7.4" x2="13.8" y2="10.2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12" y1="15" x2="12" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "900", fontFamily: "Outfit, sans-serif", margin: 0, letterSpacing: "-0.5px" }}>
              ResourceMatch
            </h1>
            <p style={{ fontSize: "9px", color: "var(--primary-light)", textTransform: "uppercase", letterSpacing: "2px", margin: 0, fontWeight: 800 }}>
              AI-Powered Redistribution
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="#benefits" style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", textDecoration: "none", transition: "var(--transition)" }}
             onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
             onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
            Benefits
          </a>
          <a href="#simulator" style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", textDecoration: "none", transition: "var(--transition)" }}
             onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
             onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
            Live Simulator
          </a>
          <a href="#faq" style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", textDecoration: "none", transition: "var(--transition)" }}
             onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
             onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
            FAQ
          </a>
          <Link href="/login" className="btn btn-secondary btn-sm" style={{ padding: "8px 20px" }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, zIndex: 10 }}>
        
        {/* HERO SECTION */}
        <section style={{
          padding: "100px 48px 120px 48px",
          maxWidth: "1250px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "64px",
          flexWrap: "wrap"
        }}>
          {/* Hero Left */}
          <div style={{ flex: "1 1 550px", display: "flex", flexDirection: "column", gap: "28px", animation: "fadeInUp 0.8s ease" }}>
            <span style={{
              alignSelf: "flex-start",
              background: "var(--primary-glow)",
              color: "var(--primary)",
              padding: "8px 20px",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: "700",
              border: "1px solid var(--border-strong)",
              boxShadow: "0 4px 15px var(--primary-glow)",
              letterSpacing: "0.5px"
            }}>
              🚀 Revolutionizing Local Resource Sharing
            </span>

            <h2 style={{
              fontSize: "56px",
              lineHeight: "1.1",
              fontWeight: "800",
              fontFamily: "Outfit, sans-serif",
              letterSpacing: "-1.5px"
            }}>
              Maximize Direct Support, <br />
              <span className="gradient-text" style={{ fontWeight: "900" }}>
                Minimize Community Waste
              </span>
            </h2>

            <p style={{
              fontSize: "19px",
              color: "var(--text-secondary)",
              lineHeight: "1.65",
              maxWidth: "560px"
            }}>
              ResourceMatch is a secure P2P network matching donors with neighboring communities. Post resources, specify requests, and coordinate contactless transfers instantly.
            </p>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>

              <a href="#simulator" className="btn btn-secondary btn-lg">
                Test Drive Simulator
              </a>
            </div>

            <div style={{ display: "flex", gap: "40px", marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
              <div>
                <div className="stat-number">100%</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Direct Peer Matching</div>
              </div>
              <div>
                <div className="stat-number">Real-Time</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Listing Updates</div>
              </div>
              <div>
                <div className="stat-number">Verified</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Organization Accounts</div>
              </div>
            </div>
          </div>

          {/* Hero Right - Simulator Preview teaser */}
          <div className="animate-float" style={{
            flex: "1 1 450px",
            display: "flex",
            justifyContent: "center",
            position: "relative"
          }}>
            <div className="card animate-glow" style={{
              width: "100%",
              maxWidth: "460px",
              padding: "28px"
            }}>
              {/* Dynamic Pill Banner */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>🤖</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>ResourceMatch AI matching</span>
                </div>
                <span className="badge badge-success">
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", display: "inline-block", marginRight: "4px" }}></span>
                  System Online
                </span>
              </div>

              {/* Match Highlight */}
              <div style={{
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-strong)",
                padding: "20px",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1px", textTransform: "uppercase" }}>High Probability Match</span>
                  <span className="badge badge-primary" style={{ fontSize: "11px" }}>98% Match Score</span>
                </div>
                <h4 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "8px" }}>🏫 Oakwood Elementary school needs Backpacks</h4>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "28px" }}>🎒</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>Westside Community Center</div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Offered: 15 Waterproof Backpacks</div>
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "12px"
                }}>
                  <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>✓ Free Local Hand-off Coordinated</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Today, 2:30 PM</span>
                </div>
              </div>

              {/* Teaser CTA */}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <a href="#simulator" style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Try the Match Simulator Below <span>↓</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST / SOCIAL PROOF */}
        <section style={{
          background: "var(--bg-dark-banner)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "24px 48px"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h3 style={{
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              color: "var(--text-secondary)",
              textAlign: "center",
              marginBottom: "20px",
              fontWeight: 800
            }}>
              Trusted by Local Grassroots & Global NGO Alliances
            </h3>

            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              flexWrap: "wrap",
              opacity: 0.85,
              filter: "grayscale(20%)"
            }}>
              <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "Outfit, sans-serif", color: "#f8fafc" }}>🥗 FoodRescue Org</span>
              <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "Outfit, sans-serif", color: "#f8fafc" }}>💻 TechAid Alliance</span>
              <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "Outfit, sans-serif", color: "#f8fafc" }}>🏢 Hope Shelters</span>
              <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "Outfit, sans-serif", color: "#f8fafc" }}>🤝 GreenGiving Corp</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE MATCH SIMULATOR SECTION */}
        <section id="simulator" style={{
          padding: "100px 48px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Interactive Live Sandbox</span>
            <h3 style={{ fontSize: "36px", fontWeight: "800", fontFamily: "Outfit, sans-serif", marginTop: "8px", marginBottom: "16px" }}>
              Explore Live Matches in Real-Time
            </h3>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Filter by category, search listings, and click any item to see how our peer-to-peer matching network creates instant matches.
            </p>
          </div>

          <div className="card" style={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 0
          }}>
            {/* Simulator Search & Filter Controls */}
            <div style={{
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              {/* Category tabs */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["All", "Food", "Tech", "Clothing", "Supplies"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      background: selectedCategory === category ? "var(--primary)" : "var(--bg-secondary)",
                      color: selectedCategory === category ? "#ffffff" : "var(--text-secondary)",
                      border: "1px solid " + (selectedCategory === category ? "var(--primary)" : "var(--border)"),
                      borderRadius: "var(--radius-sm)",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "var(--transition)"
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "36px", paddingTop: "10px", paddingBottom: "10px", background: "var(--bg-card)" }}
                />
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", opacity: 0.5 }}>
                  🔍
                </span>
              </div>
            </div>

            {/* Listings Grid */}
            <div style={{
              padding: "24px",
              maxHeight: "450px",
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              background: "var(--bg-secondary)"
            }} className="custom-scrollbar">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveModalMatch(item)}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-md)",
                      padding: "18px",
                      boxShadow: "var(--shadow-sm)",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-strong)";
                      e.currentTarget.style.background = "var(--bg-card)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: item.type.includes("Offered") ? "var(--primary)" : "var(--secondary)"
                        }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.time}</span>
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                        <span>{item.emoji}</span>
                        <span>{item.title}</span>
                      </h4>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: "12px" }}>
                        {item.desc}
                      </p>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "10px",
                      marginTop: "10px"
                    }}>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>📍 {item.location}</span>
                      <span className="badge badge-success">
                        {item.matchScore}% Score
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  <span style={{ fontSize: "24px" }}>🔍</span>
                  <p style={{ marginTop: "12px", fontSize: "14px" }}>No matching listings found. Try typing another query!</p>
                </div>
              )}
            </div>
          </div>

          {/* SIMULATED DETAIL MODAL */}
          {activeModalMatch && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(41, 37, 36, 0.6)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              animation: "scaleIn 0.2s ease"
            }} onClick={() => setActiveModalMatch(null)}>
              <div className="card" style={{
                width: "100%",
                maxWidth: "500px",
                padding: "28px",
                position: "relative",
                background: "var(--bg-card)"
              }} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={() => setActiveModalMatch(null)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: "20px",
                    cursor: "pointer"
                  }}
                >
                  ✕
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "36px" }}>{activeModalMatch.emoji}</span>
                  <div>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      color: activeModalMatch.type.includes("Offered") ? "var(--primary)" : "var(--secondary)",
                      letterSpacing: "0.5px"
                    }}>
                      {activeModalMatch.type}
                    </span>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", fontFamily: "Outfit, sans-serif" }}>
                      {activeModalMatch.title}
                    </h3>
                  </div>
                </div>

                <div style={{
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  border: "1px solid var(--border-strong)",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {activeModalMatch.desc}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Posted By:</span>
                    <span style={{ fontWeight: "700" }}>{activeModalMatch.postedBy}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Location:</span>
                    <span style={{ fontWeight: "700" }}>📍 {activeModalMatch.location}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Automated Match:</span>
                    <span style={{ fontWeight: "700", color: "var(--primary)" }}>{activeModalMatch.matchedWith}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Match Compatibility Score:</span>
                    <span style={{ fontWeight: "700", color: "var(--secondary)" }}>{activeModalMatch.matchScore}% Match Rate</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <Link href="/register" className="btn btn-primary" style={{ flex: 1 }}>
                    Register to Match
                  </Link>
                  <button
                    onClick={() => setActiveModalMatch(null)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ROLE WALKTHROUGH SECTION */}
        <section id="how-it-works" style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "100px 48px"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Simplified System</span>
              <h3 style={{ fontSize: "36px", fontWeight: "800", fontFamily: "Outfit, sans-serif", marginTop: "8px", marginBottom: "24px" }}>
                How ResourceMatch Works
              </h3>

              {/* Selector tabs */}
              <div style={{
                display: "inline-flex",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                padding: "4px",
                borderRadius: "var(--radius-md)"
              }}>
                <button
                  onClick={() => setActiveRoleMode("donor")}
                  style={{
                    background: activeRoleMode === "donor" ? "var(--primary)" : "transparent",
                    color: activeRoleMode === "donor" ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "var(--transition)"
                  }}
                >
                  As a Donor
                </button>
                <button
                  onClick={() => setActiveRoleMode("recipient")}
                  style={{
                    background: activeRoleMode === "recipient" ? "var(--primary)" : "transparent",
                    color: activeRoleMode === "recipient" ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "var(--transition)"
                  }}
                >
                  As a Recipient
                </button>
              </div>
            </div>

            {/* Steps Container */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              animation: "fadeInUp 0.5s ease"
            }}>
              {activeRoleMode === "donor" ? (
                <>
                  {/* Donor Step 1 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>1</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Create Profile</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Sign up for a free donor account. Select your local radius and specify standard resource categories you routinely donate.
                    </p>
                  </div>
                  {/* Donor Step 2 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>2</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Post Donation Offers</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Upload surplus food, clothes, or appliances. Specify quantities, drop-off rules, and photo attachments in seconds.
                    </p>
                  </div>
                  {/* Donor Step 3 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>3</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Receive AI Match Alert</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Our match engine connects your post with verified local recipient requests, scoring them based on urgency and logistics.
                    </p>
                  </div>
                  {/* Donor Step 4 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>4</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Confirm Hand-off</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Coordinate collection times securely via integrated messaging, then check off the transaction to log your positive social impact.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Recipient Step 1 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>1</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Sign Up & Verify</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Register as an individual or local nonprofit organization. Get verified to participate in matches and build immediate network trust.
                    </p>
                  </div>
                  {/* Recipient Step 2 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>2</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Post Specific Needs</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Create listing requests detailing exact resources you require (e.g. prepared pantry foods, tech equipment) and describe the need.
                    </p>
                  </div>
                  {/* Recipient Step 3 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>3</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Instant Auto Matching</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      The system compares active local inventories against your request, immediately alerting nearby donors who can fulfill your item.
                    </p>
                  </div>
                  {/* Recipient Step 4 */}
                  <div className="card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)", fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>4</div>
                    <h4 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Receive Support</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Chat to schedule safe pickup/delivery variables. Confirm receipt of goods on the matching portal to finalize the match cycle.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* CORE BENEFITS GRID */}
        <section id="benefits" style={{
          padding: "100px 48px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Core Value</span>
            <h3 style={{ fontSize: "36px", fontWeight: "800", fontFamily: "Outfit, sans-serif", marginTop: "8px", marginBottom: "16px" }}>
              Features Designed For High Impact
            </h3>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Explore the core values built into ResourceMatch to make community mutual-aid simple and efficient.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}>
            {/* Feature card 1 */}
            <div className="card" style={{ padding: "32px" }}>
              <div style={{ fontSize: "32px", marginBottom: "20px" }}>⚡</div>
              <h4 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>Automated Matching Engine</h4>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Say goodbye to manually scouring message boards. Our matching script evaluates listings on radius, availability, and description terms, immediately notifying matching pairs.
              </p>
            </div>

            {/* Feature card 2 */}
            <div className="card" style={{ padding: "32px" }}>
              <div style={{ fontSize: "32px", marginBottom: "20px" }}>🛡️</div>
              <h4 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>Verification & Credibility</h4>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Each recipient organization and shelter goes through an admin approval review to ensure transactions are safe, reliable, and go to legitimate causes.
              </p>
            </div>

            {/* Feature card 3 */}
            <div className="card" style={{ padding: "32px" }}>
              <div style={{ fontSize: "32px", marginBottom: "20px" }}>💬</div>
              <h4 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "12px", fontFamily: "Outfit, sans-serif" }}>Built-In Direct Messaging</h4>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Chat privately to finalize hand-off details without exposing personal contact details or email addresses on public posts.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE FAQ SECTION */}
        <section id="faq" style={{
          padding: "120px 48px 80px 48px",
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--primary)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Common Queries</span>
            <h3 style={{ fontSize: "36px", fontWeight: "800", fontFamily: "Outfit, sans-serif", marginTop: "8px", marginBottom: "16px" }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Is ResourceMatch free to use?",
                a: "Yes, ResourceMatch is entirely free. Our goal is to empower local mutual-aid and decrease waste by allowing community members and nonprofits to match resources without any listing fees or premium charges."
              },
              {
                q: "How does the matching algorithm work?",
                a: "The moment a donor lists a resource or a recipient posts a request, our matching code reads the listings, evaluating item categories, keywords, and geographic distance. If a strong compatibility threshold is met, the system alerts both parties."
              },
              {
                q: "Who verifies recipient organizations?",
                a: "Local platform administrators review documentation and credentials submitted during recipient registration. Verified badges are awarded to legitimate nonprofits, shelters, and centers to protect donor transparency."
              },
              {
                q: "Can individuals request resources, or only nonprofits?",
                a: "Both! When signing up, you can choose whether you represent a registered community group or are an individual seeking direct emergency resource assistance."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="card card-sm"
                style={{
                  cursor: "pointer",
                  padding: "20px 24px"
                }}
                onClick={() => toggleFaq(index)}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
                    {faq.q}
                  </h4>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "var(--primary)",
                    transform: activeFaq === index ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}>
                    ＋
                  </span>
                </div>
                
                {activeFaq === index && (
                  <div style={{
                    marginTop: "12px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "12px",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.65",
                    animation: "fadeInUp 0.2s ease"
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION / NEWSLETTER */}
        <section style={{
          padding: "80px 48px 120px 48px",
          maxWidth: "950px",
          margin: "0 auto"
        }}>
          <div className="card card-xl text-center">
            <h3 style={{ fontSize: "36px", fontWeight: "900", fontFamily: "Outfit, sans-serif", marginBottom: "16px" }}>
              Join ResourceMatch Today
            </h3>
            <p style={{ fontSize: "17px", color: "var(--text-secondary)", marginBottom: "36px", maxWidth: "600px", margin: "0 auto 36px auto", lineHeight: "1.6" }}>
              Sign up today to start sharing or requesting resources. Enter your email below to receive monthly community impact digests.
            </p>

            {subscribed ? (
              <div style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid var(--secondary)",
                borderRadius: "var(--radius-md)",
                padding: "18px",
                color: "var(--secondary-dark)",
                fontWeight: "700",
                maxWidth: "480px",
                margin: "0 auto",
                animation: "scaleIn 0.3s ease"
              }}>
                🎉 You're on the list! Welcome to the ResourceMatch newsletter.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{
                display: "flex",
                gap: "14px",
                maxWidth: "540px",
                margin: "0 auto",
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{
                    flex: "1 1 300px"
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: "12px 28px" }}
                >
                  Subscribe
                </button>
              </form>
            )}

            <div style={{ marginTop: "32px", display: "flex", justifyContent: "center", gap: "24px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-muted)" }}>
                Ready to register?{" "}
                <Link href="/register" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
                  Create Free Account
                </Link>
              </span>
              <span style={{ color: "var(--border-strong)" }}>|</span>
              <span style={{ color: "var(--text-muted)" }}>
                Have questions?{" "}
                <Link href="/login" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        background: "var(--bg-dark-banner)",
        borderTop: "1px solid var(--border)",
        padding: "60px 48px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" fill="white"/>
                <circle cx="5" cy="6" r="2" fill="rgba(255,255,255,0.85)"/>
                <circle cx="19" cy="6" r="2" fill="rgba(255,255,255,0.85)"/>
                <circle cx="12" cy="20" r="2" fill="rgba(255,255,255,0.85)"/>
                <line x1="7" y1="7.4" x2="10.2" y2="10.2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="17" y1="7.4" x2="13.8" y2="10.2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="12" y1="15" x2="12" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: "800", fontFamily: "Outfit, sans-serif", fontSize: "18px", color: "#f8fafc" }}>ResourceMatch</span>
          </div>
          <p style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "500px", margin: 0, lineHeight: "1.6" }}>
            Connecting community organizations, local businesses, and donors to match surplus with direct societal need.
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            &copy; {new Date().getFullYear()} ResourceMatch. All rights reserved. Made for local mutual-aid.
          </p>
        </div>
      </footer>
    </div>
  );
}
