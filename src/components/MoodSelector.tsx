import { useState } from "react";
import type { Mood } from "../types";
import { commonMoods, moodGroups, type MoodOption } from "../utils/moods";

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

function MoodButton({
  mood,
  selected,
  onSelect
}: {
  mood: MoodOption;
  selected: boolean;
  onSelect: (mood: Mood) => void;
}) {
  return (
    <button
      aria-checked={selected}
      className={`min-h-[4.25rem] rounded-lg border px-2 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--paper)] ${
        selected
          ? "border-[var(--brand)] bg-[rgba(53,191,171,0.18)] text-[var(--ink)] shadow-[0_10px_28px_rgba(31,201,231,0.18)]"
          : "border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.42)] text-[var(--ink)] hover:border-[var(--brand)] hover:bg-white/70"
      }`}
      onClick={() => onSelect(mood.value)}
      role="radio"
      type="button"
    >
      <span className="block text-2xl leading-none" aria-hidden="true">
        {mood.emoji}
      </span>
      <span className="mt-1 block truncate">{mood.label}</span>
    </button>
  );
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <fieldset>
      <div className="mb-3 flex items-center justify-between gap-3">
        <legend className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--moss)]">
          今天的心情
        </legend>
        <button
          className="rounded-full border border-white/80 bg-white/45 px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--ink)]"
          onClick={() => setShowMore((current) => !current)}
          type="button"
        >
          {showMore ? "收起" : "更多表情"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2" role="radiogroup">
        {commonMoods.map((mood) => (
          <MoodButton
            key={mood.value}
            mood={mood}
            onSelect={onChange}
            selected={value === mood.value}
          />
        ))}
      </div>

      {showMore ? (
        <div className="mt-3 max-h-80 space-y-4 overflow-y-auto rounded-lg border border-white/80 bg-white/30 p-3">
          {moodGroups.map((group) => (
            <section className="space-y-2" key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                {group.title}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {group.options.map((mood) => (
                  <button
                    aria-pressed={value === mood.value}
                    className={`min-h-14 rounded-lg border px-1.5 py-2 text-center transition focus:outline-none focus:ring-2 focus:ring-[var(--brand)] ${
                      value === mood.value
                        ? "border-[var(--brand)] bg-[rgba(53,191,171,0.18)]"
                        : "border-white/70 bg-white/35 hover:border-[var(--brand)] hover:bg-white/70"
                    }`}
                    key={mood.value}
                    onClick={() => onChange(mood.value)}
                    title={mood.label}
                    type="button"
                  >
                    <span className="block text-2xl leading-none" aria-hidden="true">
                      {mood.emoji}
                    </span>
                    <span className="mt-1 block truncate text-[11px] font-medium text-[var(--muted)]">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}
