import { useRole } from "../hooks/useRole";
import type { Role } from "../hooks/useRole";

const ROLES: Role[] = ["Operator", "Approver", "Admin"];

const roleColors: Record<Role, string> = {
  Operator: "#10B981",
  Approver: "#F59E0B",
  Admin: "#3B82F6",
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'IBM Plex Mono', monospace" }}>DEMO ROLE:</span>
      <div style={{ display: "flex", gap: 4 }}>
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: `1px solid ${role === r ? roleColors[r] : "#2A2D36"}`,
              background: role === r ? `${roleColors[r]}20` : "transparent",
              color: role === r ? roleColors[r] : "#6B7280",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              transition: "all 0.15s",
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
