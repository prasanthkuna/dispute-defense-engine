interface Props {
  recommendation: string | null;
  size?: "sm" | "md" | "lg";
}

export default function RecommendationBadge({ recommendation, size = "sm" }: Props) {
  if (!recommendation) {
    return (
      <span className="bg-secondary text-muted-foreground/40 border border-border/50 rounded-md px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase">
        N/A
      </span>
    );
  }

  const getColors = (rec: string) => {
    switch (rec) {
      case "Contest":
        return "bg-primary/10 text-primary border-primary/20";
      case "Accept":
        return "bg-hazard-orange/10 text-hazard-orange border-hazard-orange/20";
      case "Escalate":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "lg":
        return "text-[18px] px-4 py-1.5";
      case "md":
        return "text-[13px] px-3 py-1";
      default:
        return "text-[10px] px-2 py-0.5";
    }
  };

  return (
    <span className={`
      border rounded-md font-mono font-bold tracking-widest uppercase transition-colors
      ${getSizeClasses(size)}
      ${getColors(recommendation)}
    `}>
      {recommendation}
    </span>
  );
}
