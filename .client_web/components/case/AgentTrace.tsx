import { useState } from "react";
import { ChevronRight, ChevronDown, Terminal, Wrench, Eye } from "lucide-react";
import type { AgentTraceStep } from "~backend/agent/types";

const MONO = "'IBM Plex Mono', monospace";

const STATUS_COLORS: Record<string, string> = {
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  pending: "#6B7280",
};

interface Props {
  steps: AgentTraceStep[];
}

function StepRow({ step, index }: { step: AgentTraceStep; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = STATUS_COLORS[step.status] ?? "#6B7280";
  const isTool = step.action_type === "tool_call";

  return (
    <div style={{ borderBottom: "1px solid #1A1D24" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "10px 16px",
          cursor: "pointer",
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#0F1116")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Step number */}
        <span style={{
          fontFamily: MONO,
          fontSize: 10,
          color: "#3D4251",
          width: 24,
          paddingTop: 2,
          flexShrink: 0,
        }}>
          {String(step.step_number).padStart(2, "0")}
        </span>

        {/* Status dot */}
        <div style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          marginTop: 5,
          flexShrink: 0,
        }} />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
            {isTool ? (
              <span style={{
                fontFamily: MONO,
                fontSize: 11,
                color: "#3B82F6",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <Wrench size={10} />
                &gt; {step.tool_name}
              </span>
            ) : (
              <span style={{
                fontFamily: MONO,
                fontSize: 11,
                color: "#8B5CF6",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <Eye size={10} />
                observe
              </span>
            )}
            <span style={{ fontFamily: MONO, fontSize: 9, color: "#3D4251" }}>
              {new Date(step.created_at).toLocaleTimeString("en-IN")}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#E8EAF0", lineHeight: 1.5 }}>
            {step.observation_text}
          </div>
        </div>

        {/* Expand icon */}
        <div style={{ color: "#3D4251", paddingTop: 2, flexShrink: 0 }}>
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>
      </div>

      {/* Expanded JSON */}
      {expanded && (
        <div style={{ padding: "0 16px 12px 58px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "#3D4251", marginBottom: 4, letterSpacing: "0.1em" }}>INPUT</div>
              <pre style={{
                background: "#0A0C10",
                border: "1px solid #2A2D36",
                borderRadius: 6,
                padding: "8px 10px",
                margin: 0,
                fontSize: 10,
                fontFamily: MONO,
                color: "#6B7280",
                overflow: "auto",
                maxHeight: 120,
              }}>
                {JSON.stringify(step.input_json, null, 2)}
              </pre>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "#3D4251", marginBottom: 4, letterSpacing: "0.1em" }}>OUTPUT</div>
              <pre style={{
                background: "#0A0C10",
                border: "1px solid #2A2D36",
                borderRadius: 6,
                padding: "8px 10px",
                margin: 0,
                fontSize: 10,
                fontFamily: MONO,
                color: STATUS_COLORS[step.status] ?? "#6B7280",
                overflow: "auto",
                maxHeight: 120,
              }}>
                {JSON.stringify(step.output_json, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentTrace({ steps }: Props) {
  return (
    <div>
      <div style={{
        background: "#0A0C10",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        {/* Terminal header */}
        <div style={{
          background: "#111318",
          borderBottom: "1px solid #2A2D36",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <Terminal size={13} color="#3B82F6" />
          <span style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>
            DDE AGENT TRACE — {steps.length} STEPS
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { color: "#10B981", label: "success" },
              { color: "#F59E0B", label: "warning" },
              { color: "#EF4444", label: "error" },
            ].map(({ color, label }) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontFamily: MONO, color: "#3D4251" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {steps.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", fontFamily: MONO, color: "#3D4251", fontSize: 12 }}>
            No trace steps found. Run the agent to generate trace data.
          </div>
        ) : (
          steps.map((step, idx) => (
            <StepRow key={step.id} step={step} index={idx} />
          ))
        )}
      </div>
    </div>
  );
}
