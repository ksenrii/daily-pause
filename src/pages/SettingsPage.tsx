import { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { clearAllEntries, getEntryCount } from "../db/entriesRepository";
import { getPhotoStats } from "../db/photosRepository";

interface LocalStats {
  entryCount: number;
  photoCount: number;
  totalPhotoBytes: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SettingsPage() {
  const [stats, setStats] = useState<LocalStats>({
    entryCount: 0,
    photoCount: 0,
    totalPhotoBytes: 0
  });
  const [message, setMessage] = useState("");

  const refreshStats = useCallback(async () => {
    const [entryCount, photoStats] = await Promise.all([
      getEntryCount(),
      getPhotoStats()
    ]);

    setStats({
      entryCount,
      photoCount: photoStats.count,
      totalPhotoBytes: photoStats.totalBytes
    });
  }, []);

  useEffect(() => {
    async function loadStats() {
      await refreshStats();
    }

    void loadStats();
  }, [refreshStats]);

  async function handleClear() {
    const confirmed = window.confirm("确定要清空所有记录吗？这个操作不能撤销。");
    if (!confirmed) {
      return;
    }

    await clearAllEntries();
    await refreshStats();
    setMessage("所有记录已经从这个浏览器中清空。");
  }

  return (
    <section className="space-y-5">
      <header className="space-y-2 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">
          Preferences
        </p>
        <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">
          Settings
        </h1>
      </header>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
          Local library
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/70 bg-white/35 p-3">
            <p className="text-2xl font-semibold text-[var(--ink)]">
              {stats.entryCount}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Entries</p>
          </div>
          <div className="rounded-lg border border-white/70 bg-white/35 p-3">
            <p className="text-2xl font-semibold text-[var(--ink)]">
              {stats.photoCount}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Photos</p>
          </div>
          <div className="rounded-lg border border-white/70 bg-white/35 p-3">
            <p className="text-lg font-semibold text-[var(--ink)]">
              {formatBytes(stats.totalPhotoBytes)}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Storage</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
          Data
        </h2>
        <Button onClick={handleClear} variant="danger">
          Clear all entries
        </Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </Card>
    </section>
  );
}
