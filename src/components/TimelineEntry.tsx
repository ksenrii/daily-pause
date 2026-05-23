import { Link } from "react-router-dom";
import { useObjectUrl } from "../hooks/useObjectUrl";
import type { DailyEntryWithCoverPhoto } from "../types";
import { formatDisplayDate } from "../utils/date";
import { getMoodText } from "../utils/moods";

interface TimelineEntryProps {
  entry: DailyEntryWithCoverPhoto;
  index: number;
}

export default function TimelineEntry({ entry, index }: TimelineEntryProps) {
  const url = useObjectUrl(entry.coverPhoto?.photoBlob);
  const side = index % 2 === 0 ? "left" : "right";

  return (
    <article
      className={`relative grid grid-cols-[1fr_2rem_1fr] gap-2 ${
        side === "left" ? "" : ""
      }`}
    >
      <div className={side === "left" ? "col-start-1" : "col-start-3"}>
        <Link
          className="interactive-surface quiet-panel block rounded-lg p-2"
          to={`/entry/${entry.id}`}
        >
          {url ? (
            <img
              alt=""
              className="mb-3 aspect-[4/3] w-full rounded-md bg-white/45 object-contain"
              loading="lazy"
              src={url}
            />
          ) : null}
          <p className="font-display text-base font-semibold text-[var(--ink)]">
            {formatDisplayDate(entry.date)}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
            {getMoodText(entry.mood)}
          </p>
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-[var(--muted)]">
            {entry.note || "这一刻没有留下文字。"}
          </p>
        </Link>
      </div>

      <div className="col-start-2 row-start-1 flex justify-center">
        <span className="mt-5 h-3 w-3 rounded-full border-2 border-[var(--paper)] bg-[var(--brand)] shadow-[0_0_0_4px_rgba(53,191,171,0.18)]" />
      </div>
    </article>
  );
}
