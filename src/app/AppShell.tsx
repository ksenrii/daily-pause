import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AmbientCanvas from "../components/AmbientCanvas";
import BottomNav from "../components/BottomNav";
import ClickEffects from "../components/ClickEffects";
import { applyTheme } from "../utils/theme";

export default function AppShell() {
  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <div className="font-body min-h-dvh text-[var(--ink)]">
      <AmbientCanvas />
      <ClickEffects />
      <main className="relative z-10 mx-auto min-h-dvh w-full max-w-md px-5 pb-28 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
