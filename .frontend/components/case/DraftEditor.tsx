import { useState } from "react";
import { RefreshCw, Save, FileText, Paperclip } from "lucide-react";
import backend from "~backend/client";
import { useToast } from "@/components/ui/use-toast";
import type { Draft } from "~backend/drafts/types";

const MONO = "'IBM Plex Mono', monospace";
const MAX_SUMMARY_LENGTH = 1000;
const DRAFT_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  draft: { bg: "rgba(59,130,246,0.1)", text: "#3B82F6", border: "rgba(59,130,246,0.25)" },
  ready: { bg: "rgba(139,92,246,0.1)", text: "#8B5CF6", border: "rgba(139,92,246,0.25)" },
  submitted: { bg: "rgba(16,185,129,0.12)", text: "#10B981", border: "rgba(16,185,129,0.28)" },
};

interface Props {
  caseId: string;
  drafts: any[];
  onRefresh: () => void;
}

export default function DraftEditor({ drafts, caseId, onRefresh }: Props) {
  const { toast } = useToast();
  const draft = drafts[0] ?? null;
  const [text, setText] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const displayText = text ?? draft?.response_text ?? "";
  const summaryLength = draft?.summary_text.length ?? 0;
  const summaryColors =
    summaryLength >= MAX_SUMMARY_LENGTH
      ? { text: "#EF4444", border: "rgba(239,68,68,0.25)" }
      : summaryLength >= 900
        ? { text: "#F59E0B", border: "rgba(245,158,11,0.25)" }
        : { text: "#6B7280", border: "rgba(61,66,81,0.4)" };
  const draftStatus = draft?.draft_status ?? "draft";
  const draftStatusColors = DRAFT_STATUS_COLORS[draftStatus] ?? DRAFT_STATUS_COLORS.draft;

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await backend.drafts.updateDraft(draft.id, { response_text: displayText });
      toast({ title: "Draft saved", description: "Changes saved successfully." });
      onRefresh();
      setText(null);
    } catch (err) {
      console.error("Save draft error:", err);
      toast({ title: "Save failed", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await backend.drafts.createDraft({ case_id: caseId });
      toast({ title: "Draft regenerated", description: "New version created." });
      onRefresh();
      setText(null);
    } catch (err) {
      console.error("Regenerate draft error:", err);
      toast({ title: "Regeneration failed", description: String(err), variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  };

  const attachments = (draft?.attachments_json ?? []) as string[];

  return (
    <div>
      <div style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "#111318",
          borderBottom: "1px solid #2A2D36",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <FileText size={13} color="#3B82F6" />
          <span style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>
            BANK-FACING RESPONSE DRAFT
          </span>
          {draft && (
            <>
              <span style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#3D4251",
                background: "#1A1D24",
                border: "1px solid #2A2D36",
                borderRadius: 4,
                padding: "2px 6px",
              }}>
                v{draft.version}
              </span>
              <span style={{
                fontFamily: MONO,
                fontSize: 9,
                color: draftStatusColors.text,
                background: draftStatusColors.bg,
                border: `1px solid ${draftStatusColors.border}`,
                borderRadius: 4,
                padding: "2px 6px",
                textTransform: "uppercase",
              }}>
                {draftStatus}
              </span>
            </>
          )}
          <div style={{ flex: 1 }} />
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            style={{
              background: "transparent",
              border: "1px solid #2A2D36",
              borderRadius: 6,
              color: "#6B7280",
              padding: "5px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontFamily: MONO,
              opacity: regenerating ? 0.5 : 1,
            }}
          >
            <RefreshCw size={11} />
            {regenerating ? "Regenerating..." : "Regenerate"}
          </button>
          {text !== null && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "#3B82F6",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                padding: "5px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontFamily: MONO,
                opacity: saving ? 0.5 : 1,
              }}
            >
              <Save size={11} />
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {draft?.summary_text && (
          <div style={{
            padding: "10px 16px",
            background: "rgba(59,130,246,0.05)",
            borderBottom: "1px solid rgba(59,130,246,0.1)",
            fontSize: 11,
            color: "#6B7280",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontStyle: "italic" }}>{draft.summary_text}</span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: summaryColors.text,
                  border: `1px solid ${summaryColors.border}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                  whiteSpace: "nowrap",
                }}
              >
                SUMMARY {summaryLength}/{MAX_SUMMARY_LENGTH}
              </span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251" }}>
              Razorpay contest summaries are capped at 1000 characters.
            </div>
          </div>
        )}

        {/* Editor */}
        <textarea
          value={displayText}
          onChange={(e) => setText(e.target.value)}
          placeholder="No draft generated yet. Run the agent or click Regenerate."
          style={{
            width: "100%",
            minHeight: 380,
            background: "#0A0C10",
            border: "none",
            color: "#E8EAF0",
            fontFamily: MONO,
            fontSize: 12,
            lineHeight: 1.7,
            padding: 20,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Attachments */}
        {attachments.length > 0 && (
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid #2A2D36",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}>
            <Paperclip size={11} color="#6B7280" style={{ marginTop: 2 }} />
            {attachments.map((a, i) => (
              <span key={i} style={{
                fontFamily: MONO,
                fontSize: 9,
                color: "#3B82F6",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 4,
                padding: "2px 8px",
              }}>
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
