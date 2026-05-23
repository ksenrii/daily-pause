import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import MoodSelector from "../components/MoodSelector";
import PhotoGallery from "../components/PhotoGallery";
import {
  deleteEntry,
  getEntryById,
  updateEntry
} from "../db/entriesRepository";
import { getPhotosForEntry } from "../db/photosRepository";
import type { DailyEntry, EntryPhoto, Mood } from "../types";
import { formatDisplayDate } from "../utils/date";
import { getMoodText } from "../utils/moods";

export default function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<DailyEntry>();
  const [photos, setPhotos] = useState<EntryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState("");
  const [mood, setMood] = useState<Mood>("calm");

  useEffect(() => {
    async function loadEntry() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const found = await getEntryById(id);
      setEntry(found);
      if (found) {
        setNote(found.note);
        setMood(found.mood);
        setPhotos(await getPhotosForEntry(found.id));
      } else {
        setPhotos([]);
      }
      setIsLoading(false);
    }

    void loadEntry();
  }, [id]);

  async function handleSave() {
    if (!entry) {
      return;
    }

    await updateEntry(entry.id, { note: note.trim(), mood });
    setEntry({ ...entry, note: note.trim(), mood, updatedAt: Date.now() });
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!entry) {
      return;
    }

    const confirmed = window.confirm("确定要删除这条记录吗？");
    if (!confirmed) {
      return;
    }

    await deleteEntry(entry.id);
    navigate("/history");
  }

  if (isLoading) {
    return (
      <p className="pt-12 text-center text-sm text-[var(--muted)]">
        正在打开记录...
      </p>
    );
  }

  if (!entry) {
    return (
      <section className="space-y-4 pt-4">
        <Link className="text-sm font-semibold text-[var(--brand)]" to="/history">
          Back to History
        </Link>
        <EmptyState
          message="这条记录可能已经被删除。"
          title="没有找到这条记录"
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2 pt-4">
        <Link className="text-sm font-semibold text-[var(--brand)]" to="/history">
          Back to History
        </Link>
        <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">
          {formatDisplayDate(entry.date)}
        </h1>
      </header>

      <Card className="space-y-4 p-3">
        <PhotoGallery photos={photos} />

        {isEditing ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--moss)]">
                一句话
              </span>
              <textarea
                className="min-h-32 w-full resize-none rounded-lg border border-white/80 bg-white/45 px-3 py-3 text-base leading-7 text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(53,191,171,0.2)]"
                maxLength={180}
                onChange={(event) => setNote(event.target.value)}
                value={note}
              />
            </label>
            <MoodSelector onChange={setMood} value={mood} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
              {getMoodText(entry.mood)}
            </p>
            <p className="whitespace-pre-wrap text-base leading-7 text-[var(--ink)]">
              {entry.note || "这一刻没有留下文字。"}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                onClick={() => setIsEditing(true)}
                variant="secondary"
              >
                Edit
              </Button>
              <Button onClick={handleDelete} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
