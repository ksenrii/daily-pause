import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`quiet-panel rounded-lg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
