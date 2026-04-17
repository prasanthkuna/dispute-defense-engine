import { useRole } from "../hooks/useRole";
import type { Role } from "../hooks/useRole";

const ROLES: Role[] = ["Operator", "Approver", "Admin"];

const roleStyles: Record<Role, string> = {
  Operator: "text-signal-green border-signal-green/30 bg-signal-green/10",
  Approver: "text-hazard-orange border-hazard-orange/30 bg-hazard-orange/10",
  Admin: "text-primary border-primary/30 bg-primary/10",
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase opacity-60">Identity Switcher</span>
      <div className="flex gap-2">
        {ROLES.map((r) => {
          const isActive = role === r;
          const styles = roleStyles[r];
          
          return (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`
                px-3 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer
                ${isActive 
                  ? `${styles} shadow-sm shadow-black/20` 
                  : "bg-secondary/30 border border-border/50 text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50 hover:border-border"
                }
              `}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
}
