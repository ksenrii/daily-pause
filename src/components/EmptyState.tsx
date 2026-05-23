interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="quiet-panel rounded-lg px-5 py-10 text-center">
      <div className="mx-auto mb-5 h-px w-20 hairline" />
      <p className="font-display text-xl font-semibold text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{message}</p>
    </div>
  );
}
