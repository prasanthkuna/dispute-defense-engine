import { Outlet, NavLink } from "react-router-dom";
import { Inbox, Zap, Shield } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";

const navItems = [
  { to: "/", label: "Inbox", icon: Inbox, end: true },
  { to: "/simulation", label: "Simulation", icon: Zap, end: false },
];

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#111318",
        borderRight: "1px solid #2A2D36",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 20px",
          borderBottom: "1px solid #2A2D36",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            background: "#3B82F6",
            borderRadius: 8,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: 16,
              color: "#E8EAF0",
              letterSpacing: "-0.02em",
            }}>DDE</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>Dispute Defense Engine</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                color: isActive ? "#3B82F6" : "#6B7280",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.15s",
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Version */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #2A2D36" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#3D4251" }}>
            v0.1.0-alpha
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 56,
          background: "#111318",
          borderBottom: "1px solid #2A2D36",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "'IBM Plex Mono', monospace" }}>
            DISPUTE DEFENSE ENGINE — ALPHA
          </div>
          <RoleSwitcher />
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", background: "#0A0C10" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
