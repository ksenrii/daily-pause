import { Link } from "react-router-dom";
import { useObjectUrl } from "../hooks/useObjectUrl";
import type { DailyEntryWithCoverPhoto } from "../types";
import { formatDisplayDate } from "../utils/date";
import { getMoodText } from "../utils/moods";

interface EntryCardProps {
  entry: DailyEntryWithCoverPhoto;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const url = useObjectUrl(entry.coverPhoto?.photoBlob);

  return (
    <Link
      className="quiet-panel grid grid-cols-[92px_1fr] gap-3 rounded-lg p-3 transition hover:-translate-y-0.5 hover:border-[var(--moss)]"
      to={`/entry/${entry.id}`}
    >
      {url ? (
        <img
          alt=""
          className="h-24 w-[92px] rounded-md bg-white/45 object-contain grayscale-[8%]"
          src={url}
        />
      ) : (
        <div className="h-24 w-[92px] rounded-md bg-[#eef3ed]" />
      )}
      <div className="min-w-0 py-1">
        <p className="font-display text-base font-semibold text-[var(--ink)]">
          {formatDisplayDate(entry.date)}
        </p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
          {getMoodText(entry.mood)}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
          {entry.note || "这一刻没有留下文字。"}
        </p>
      </div>
    </Link>
  );
}
