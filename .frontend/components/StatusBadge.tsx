interface Props {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: Props) {
  const getColors = (status: string) => {
    switch (status) {
      case "New":
        return "bg-secondary text-muted-foreground border-border";
      case "Hunting Evidence":
        return "bg-primary/10 text-primary border-primary/20";
      case "Ready for Review":
        return "bg-signal-green/10 text-signal-green border-signal-green/20";
      case "Approval Pending":
        return "bg-hazard-orange/10 text-hazard-orange border-hazard-orange/20";
      case "Ready to Submit":
        return "bg-primary/15 text-primary border-primary/30";
      case "Submitted":
        return "bg-signal-green/15 text-signal-green border-signal-green/30";
      case "Action Required":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Closed":
        return "bg-secondary/50 text-muted-foreground/50 border-border/50";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <span className={`
      border rounded-[4px] font-mono font-bold tracking-widest whitespace-nowrap uppercase
      ${size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[11px] px-2 py-1"}
      ${getColors(status)}
    `}>
      {status}
    </span>
  );
}
