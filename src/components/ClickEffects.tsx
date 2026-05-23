import { useEffect } from "react";

export default function ClickEffects() {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const interactive = target.closest("button, a, label, select, textarea, input");
      if (!interactive) {
        return;
      }

      const element = interactive as HTMLElement;
      element.classList.remove("tap-flash");
      void element.offsetWidth;
      element.classList.add("tap-flash");
      window.setTimeout(() => element.classList.remove("tap-flash"), 420);

      const pulse = document.createElement("span");
      pulse.className = "click-pulse";
      pulse.style.left = `${event.clientX}px`;
      pulse.style.top = `${event.clientY}px`;
      document.body.appendChild(pulse);

      window.setTimeout(() => pulse.remove(), 520);
    }

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}
