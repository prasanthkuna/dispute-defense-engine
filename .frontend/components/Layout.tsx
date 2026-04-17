import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Inbox, Shield, LayoutDashboard, Database, Activity } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";

const navItems = [
  { to: "/", label: "Command Center", icon: LayoutDashboard, end: true, matches: (pathname: string) => pathname === "/" },
  {
    to: "/ledger",
    label: "Dispute Ledger",
    icon: Inbox,
    end: false,
    matches: (pathname: string) => pathname.startsWith("/ledger") || pathname.startsWith("/cases/"),
  },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground relative font-sans">
      {/* Sidebar - Premium Razorpay Aesthetic */}
      <aside className="w-64 bg-secondary border-r border-border flex flex-col shrink-0 z-20 transition-all duration-500 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">
        {/* Logo Section */}
        <div className="p-8 border-b border-border/40 flex items-center gap-4 group cursor-pointer">
          <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center shadow-[0_0_20px_rgba(19,100,241,0.3)] group-hover:scale-110 transition-transform duration-300">
            <Shield size={20} className="text-primary-foreground" />
          </div>
          <div className="transition-all duration-300 group-hover:translate-x-1">
            <div className="font-display font-bold text-[16px] text-foreground tracking-tight leading-none">RAZOR.DEFENSE</div>
            <div className="text-[8px] text-primary mt-1.5 tracking-[0.25em] font-bold uppercase opacity-60">Fintech Intelligence</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-5 flex-1 space-y-2">
          <div className="text-[9px] font-mono text-muted-foreground/30 font-bold tracking-[0.2em] uppercase mb-4 px-3">Main Protocols</div>
          {navItems.map(({ to, label, icon: Icon, end, matches }) => {
            const isActive = matches(location.pathname);

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={() => `
                  flex items-center gap-3.5 px-4 py-3 rounded-lg no-underline transition-all duration-300 font-bold text-[13px] group
                  ${isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                    : "text-muted-foreground/60 hover:bg-white/5 hover:text-foreground border border-transparent"}
                `}
              >
                <Icon size={18} className={`transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground/30 group-hover:text-muted-foreground"}`} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-border/40 bg-secondary/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/60 uppercase font-bold tracking-widest">Core Engine: Optimal</span>
          </div>
          <div className="font-mono text-[8px] text-muted-foreground/30 uppercase tracking-[0.2em]">
            Protocol Build v1.4.2-STABLE
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Topbar */}
        <header className="h-16 bg-background border-b border-border/50 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
              <Activity size={12} className="text-primary" />
              <span className="text-[10px] font-mono text-foreground/70 font-bold tracking-tight uppercase">Security Sync Active</span>
            </div>
            <div className="h-4 w-px bg-border/50" />
            <div className="text-[10px] text-muted-foreground/40 font-mono font-bold uppercase tracking-widest">
              Location: <span className="text-foreground/60">{location.pathname === "/" ? "HQ_COMMAND" : "LEDGER_VIEW"}</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <RoleSwitcher />
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-[10px]">
              PK
            </div>
          </div>
        </header>

        {/* Content Container with Grid Overlay */}
        <main className="flex-1 overflow-auto relative bg-background">
          {/* Enhanced Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ 
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px" 
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
