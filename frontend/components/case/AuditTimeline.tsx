import React from "react";
import { Bot, User, Settings, Shield } from "lucide-react";
import type { AuditLog, ActorType } from "~backend/audit/types";

const MONO = "'IBM Plex Mono', monospace";

interface Props {
  logs: AuditLog[];
}

function actorConfig(type: ActorType) {
  switch (type) {
    case "system":
      return { color: "#3B82F6", label: "SYSTEM", Icon: Settings };
    case "agent":
      return { color: "#8B5CF6", label: "AGENT", Icon: Bot };
    case "operator":
      return { color: "#10B981", label: "OPERATOR", Icon: User };
    case "approver":
      return { color: "#F59E0B", label: "APPROVER", Icon: Shield };
    default:
      return { color: "#6B7280", label: String(type).toUpperCase(), Icon: User };
  }
}

function formatAction(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AuditTimeline({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        padding: 32,
        textAlign: "center",
        fontFamily: MONO,
        color: "#3D4251",
        fontSize: 13,
      }}>
        No audit events yet.
      </div>
    );
  }

  return (
    <div style={{
      background: "#111318",
      border: "1px solid #2A2D36",
      borderRadius: 10,
      padding: 24,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginBottom: 20, letterSpacing: "0.1em" }}>
        AUDIT TRAIL — {logs.length} EVENTS
      </div>

      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute",
          left: 14,
          top: 0,
          bottom: 0,
          width: 1,
          background: "#2A2D36",
        }} />

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
          {logs.map((log, idx) => {
            const { color, label, Icon } = actorConfig(log.actor_type);
            const isLast = idx === logs.length - 1;
            return (
              <div key={log.id} style={{ display: "flex", gap: 16, paddingBottom: isLast ? 0 : 20 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `${color}22`,
                  border: `2px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }}>
                  <Icon size={12} color={color} />
                </div>

                <div style={{
                  flex: 1,
                  background: "#0A0C10",
                  border: "1px solid #1A1D24",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginTop: 0,
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color,
                      background: `${color}18`,
                      border: `1px solid ${color}33`,
                      borderRadius: 4,
                      padding: "2px 7px",
                      letterSpacing: "0.08em",
                    }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: "#E8EAF0", fontWeight: 600 }}>
                      {formatAction(log.action_type)}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251", marginLeft: "auto" }}>
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>

                  <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginBottom: 6 }}>
                    {log.actor_name}
                  </div>

                  {Object.keys(log.details_json).length > 0 && (
                    <div style={{
                      marginTop: 8,
                      padding: "8px 10px",
                      background: "#111318",
                      borderRadius: 5,
                      border: "1px solid #2A2D36",
                    }}>
                      {Object.entries(log.details_json).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251", minWidth: 120 }}>{k}:</span>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280" }}>
                            {typeof v === "object" ? JSON.stringify(v) : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
