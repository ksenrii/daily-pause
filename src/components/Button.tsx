import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--charcoal)] text-white shadow-[0_12px_30px_rgba(25,26,23,0.18)] hover:bg-black disabled:bg-stone-300",
  secondary:
    "bg-[rgba(255,253,247,0.78)] text-[var(--ink)] ring-1 ring-[rgba(25,26,23,0.18)] hover:bg-white disabled:text-stone-400",
  danger:
    "bg-[#f4e4df] text-[var(--clay)] ring-1 ring-[#d9a99a] hover:bg-[#eed6ce] disabled:text-rose-300",
  ghost: "bg-transparent text-[var(--muted)] hover:bg-black/5"
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`min-h-11 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-[0.02em] transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
