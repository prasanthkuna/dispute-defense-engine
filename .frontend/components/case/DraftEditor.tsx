import { useState } from "react";
import { RefreshCw, Save, FileText, Paperclip, AlertCircle } from "lucide-react";
import backend from "~backend/client";
import { useToast } from "@/components/ui/use-toast";

const MAX_SUMMARY_LENGTH = 1000;
const DRAFT_STATUS_COLORS: Record<string, string> = {
  draft: "bg-primary/10 text-primary border-primary/20",
  ready: "bg-accent-foreground/10 text-accent-foreground border-accent-foreground/20",
  submitted: "bg-signal-green/10 text-signal-green border-signal-green/20",
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
  
  const getSummaryStyles = (len: number) => {
    if (len >= MAX_SUMMARY_LENGTH) return "text-destructive border-destructive/30 bg-destructive/5";
    if (len >= 900) return "text-hazard-orange border-hazard-orange/30 bg-hazard-orange/5";
    return "text-muted-foreground border-border/50 bg-secondary/20";
  };

  const draftStatus = draft?.draft_status ?? "draft";
  const statusStyles = DRAFT_STATUS_COLORS[draftStatus] ?? DRAFT_STATUS_COLORS.draft;

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
    <div className="animate-stagger">
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg flex flex-col h-[700px]">
        {/* Header */}
        <div className="bg-secondary/30 border-b border-border p-4 flex items-center gap-4">
          <FileText size={16} className="text-primary" />
          <span className="font-mono text-[11px] text-foreground font-bold uppercase tracking-widest">
            Dispute Response Architect
          </span>
          {draft && (
            <div className="flex gap-2">
              <span className="font-mono text-[9px] text-muted-foreground bg-background/50 border border-border px-1.5 py-0.5 rounded font-bold">
                v{draft.version}
              </span>
              <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${statusStyles}`}>
                {draftStatus}
              </span>
            </div>
          )}
          <div className="flex-1" />
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="bg-transparent border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 px-3 py-1.5 transition-all flex items-center gap-2 text-[11px] font-bold font-mono uppercase cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
            {regenerating ? "Synthesizing..." : "Regenerate"}
          </button>
          {text !== null && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white border-none rounded-md px-4 py-1.5 font-bold font-mono text-[11px] uppercase cursor-pointer flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md shadow-primary/20"
            >
              <Save size={12} />
              {saving ? "Saving..." : "Commit Changes"}
            </button>
          )}
        </div>

        {draft?.summary_text && (
          <div className="p-4 bg-primary/5 border-b border-primary/10">
            <div className="flex justify-between items-start gap-6 mb-3">
              <p className="m-0 text-[13px] text-foreground/80 leading-relaxed font-medium italic">
                "{draft.summary_text}"
              </p>
              <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded border whitespace-nowrap uppercase tracking-widest shadow-sm ${getSummaryStyles(summaryLength)}`}>
                {summaryLength} / {MAX_SUMMARY_LENGTH}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground/60">
              <AlertCircle size={12} />
              Razorpay system limits contest summaries to 1,000 characters.
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 relative bg-background/30 group">
          <textarea
            value={displayText}
            onChange={(e) => setText(e.target.value)}
            placeholder="Awaiting agent response synthesis..."
            className="w-full h-full bg-transparent border-none text-foreground font-mono text-[13px] leading-relaxed p-6 resize-none outline-none focus:ring-0 placeholder:text-muted-foreground/20"
          />
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-card/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-full text-[10px] font-mono text-muted-foreground font-bold shadow-xl">
              EDITOR MODE
            </div>
          </div>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="p-4 border-t border-border bg-secondary/10 flex flex-wrap gap-2.5 items-center">
            <div className="flex items-center gap-2 mr-2">
              <Paperclip size={14} className="text-muted-foreground/50" />
              <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest">Linked Assets:</span>
            </div>
            {attachments.map((a, i) => (
              <span key={i} className="font-mono text-[10px] text-primary font-bold bg-primary/10 border border-primary/20 rounded-full px-3 py-1 hover:bg-primary/20 transition-colors cursor-default">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
