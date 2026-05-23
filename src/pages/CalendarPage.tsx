import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { getEntriesByMonthWithCoverPhotos } from "../db/entriesRepository";
import { useObjectUrl } from "../hooks/useObjectUrl";
import type { DailyEntryWithCoverPhoto } from "../types";

function CalendarTile({ entry }: { entry: DailyEntryWithCoverPhoto }) {
  const url = useObjectUrl(entry.coverPhoto?.photoBlob);

  return (
    <Link
      aria-label={`打开 ${entry.date} 的记录`}
      className="block overflow-hidden rounded-lg border border-[rgba(25,26,23,0.16)] bg-white shadow-sm transition hover:-translate-y-0.5"
      to={`/entry/${entry.id}`}
    >
      {url ? (
        <img alt="" className="aspect-square w-full bg-white/45 object-contain grayscale-[8%]" src={url} />
      ) : (
        <div className="aspect-square w-full bg-[#eef3ed]" />
      )}
    </Link>
  );
}

export default function CalendarPage() {
  const [entries, setEntries] = useState<DailyEntryWithCoverPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    async function loadEntries() {
      setIsLoading(true);
      setEntries(await getEntriesByMonthWithCoverPhotos(year, month));
      setIsLoading(false);
    }

    void loadEntries();
  }, [month, year]);

  return (
    <section className="space-y-4">
      <header className="space-y-2 pt-4">
        <Link className="text-sm font-semibold text-[var(--moss)]" to="/history">
          Back to History
        </Link>
        <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">Month</h1>
        <p className="text-sm text-[var(--muted)]">
          {year} 年 {month} 月的照片墙
        </p>
      </header>

      {isLoading ? (
        <p className="pt-8 text-center text-sm text-[var(--muted)]">正在打开照片墙...</p>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {entries.map((entry) => (
            <CalendarTile entry={entry} key={entry.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          message="这个月的第一张照片，会成为这里的第一格。"
          title="本月还没有照片"
        />
      )}
    </section>
  );
}
