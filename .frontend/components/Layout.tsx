import { Outlet, NavLink } from "react-router-dom";
import { Inbox, Zap, Shield, LayoutDashboard } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";

const navItems = [
  { to: "/", label: "Command Center", icon: LayoutDashboard, end: true },
  { to: "/ledger", label: "Dispute Ledger", icon: Inbox, end: false },
];

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      <div className="scanlines" />
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#08090C",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{
            background: "#3B82F6",
            borderRadius: 6,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(59,130,246,0.3)",
          }}>
            <Shield size={16} color="#fff" />
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 15,
              color: "#F1F4F9",
              letterSpacing: "-0.01em",
            }}>RAZOR.DEFENSE</div>
            <div style={{ fontSize: 9, color: "#4B5563", marginTop: 1, letterSpacing: "0.05em", fontWeight: 600 }}>FINTECH INTELLIGENCE</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 6,
                marginBottom: 4,
                textDecoration: "none",
                background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                color: isActive ? "#3B82F6" : "#6B7280",
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
              })}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Version */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#374151" }}>
            ENGINE_STATUS: ONLINE / V1.0.0
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Topbar */}
        <header style={{
          height: 56,
          background: "#08090C",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, color: "#4B5563", fontFamily: "'Space Mono', monospace", fontWeight: 500, letterSpacing: "0.02em" }}>
            [ SYSTEM.STATUS: OPTIMAL ] SECURE_ENCRYPTION_ACTIVE
          </div>
          <RoleSwitcher />
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
