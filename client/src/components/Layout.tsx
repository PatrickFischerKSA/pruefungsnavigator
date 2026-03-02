/* ============================================================
   LAYOUT – Prüfungsnavigator
   Design: Functional Futurism – Persistent Sidebar + Main Panel
   ============================================================ */
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Upload, Brain, FlaskConical, BookOpen, Sparkles,
  LayoutDashboard, GraduationCap, ChevronLeft, ChevronRight,
  Menu, X
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-cyan-400" },
  { href: "/phase/1", label: "Phase 1 – Unterlagen", icon: Upload, color: "text-cyan-400", phase: 1 },
  { href: "/phase/2", label: "Phase 2 – KI-Analyse", icon: Brain, color: "text-emerald-400", phase: 2 },
  { href: "/phase/3", label: "Phase 3 – Probeprüfung", icon: FlaskConical, color: "text-amber-400", phase: 3 },
  { href: "/phase/4", label: "Phase 4 – Strategien", icon: BookOpen, color: "text-purple-400", phase: 4 },
  { href: "/phase/5", label: "Phase 5 – Reflexion", icon: Sparkles, color: "text-rose-400", phase: 5 },
  { href: "/lehrer", label: "Lehrperson-Ansicht", icon: GraduationCap, color: "text-slate-400" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          transition-all duration-300 ease-in-out
          border-r border-white/8
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "oklch(0.175 0.028 264.695)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
            <span className="text-cyan-400 font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>PN</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>Prüfungsnavigator</p>
              <p className="text-xs text-slate-400 leading-tight">Future Skills Lab</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-2.5 mx-2 mb-1 rounded-lg
                    transition-all duration-200 group relative
                    ${isActive
                      ? "bg-cyan-500/15 border border-cyan-500/30"
                      : "hover:bg-white/5 border border-transparent"
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.phase && !collapsed && (
                    <span className={`
                      absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r
                      ${isActive ? "bg-cyan-400" : "bg-transparent group-hover:bg-white/20"}
                    `} />
                  )}
                  <Icon size={16} className={`flex-shrink-0 ${isActive ? "text-cyan-400" : item.color} transition-colors`} />
                  {!collapsed && (
                    <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-slate-300"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-white/8">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-xs"
          >
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Einklappen</span></>}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.175 0.028 264.695)" }}>
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <span className="font-bold text-white text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Prüfungsnavigator</span>
      </div>

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-300
          ${collapsed ? "lg:ml-16" : "lg:ml-64"}
          pt-14 lg:pt-0
        `}
      >
        {children}
      </main>
    </div>
  );
}
