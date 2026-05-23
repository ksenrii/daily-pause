import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import TimelineEntry from "../components/TimelineEntry";
import { useEntries } from "../hooks/useEntries";

export default function HistoryPage() {
  const { entries, isLoading } = useEntries();

  return (
    <section className="space-y-5">
      <header className="flex items-end justify-between gap-4 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--moss)]">Archive</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-[var(--ink)]">History</h1>
        </div>
        <Link
          className="flex min-h-11 shrink-0 items-center rounded-lg bg-[var(--charcoal)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
          to="/calendar"
        >
          Month
        </Link>
      </header>

      {isLoading ? (
        <p className="pt-8 text-center text-sm text-[var(--muted)]">正在整理记录...</p>
      ) : entries.length > 0 ? (
        <div className="relative space-y-4 py-2">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[rgba(53,191,171,0.55)] to-transparent" />
          {entries.map((entry, index) => (
            <TimelineEntry entry={entry} index={index} key={entry.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          message="当你保存第一张照片后，它会安静地出现在这里。"
          title="还没有历史记录"
        />
      )}
    </section>
  );
}
