import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Today" },
  { to: "/history", label: "History" },
  { to: "/settings", label: "Settings" }
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[rgba(25,26,23,0.16)] bg-[rgba(238,243,237,0.88)] px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-lg border border-[rgba(25,26,23,0.14)] bg-[rgba(255,253,247,0.58)] p-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-h-12 items-center justify-center rounded-md text-xs font-semibold transition ${
                isActive
                  ? "bg-[var(--charcoal)] text-white shadow-[0_10px_26px_rgba(25,26,23,0.2)]"
                  : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]"
              }`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
