import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import MoodSelector from "../components/MoodSelector";
import PhotoGallery from "../components/PhotoGallery";
import PhotoPicker from "../components/PhotoPicker";
import {
  addEntryWithPhotos,
  appendPhotosToEntry,
  updateEntry
} from "../db/entriesRepository";
import { getPhotosForEntry } from "../db/photosRepository";
import { useTodayEntry } from "../hooks/useTodayEntry";
import type { EntryPhoto, Mood } from "../types";
import { formatDisplayDate } from "../utils/date";
import { createId } from "../utils/id";
import { getMoodText } from "../utils/moods";

export default function TodayPage() {
  const { entry, isLoading, refresh, today } = useTodayEntry();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [mood, setMood] = useState<Mood>("calm");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<EntryPhoto[]>([]);

  useEffect(() => {
    async function loadPhotos() {
      setPhotos(entry ? await getPhotosForEntry(entry.id) : []);
    }

    void loadPhotos();
  }, [entry]);

  async function handleSave() {
    if (photoFiles.length === 0) {
      setMessage("先选一张照片，再保存这个片刻。");
      return;
    }

    const now = Date.now();
    await addEntryWithPhotos(
      {
        id: createId(),
        date: today,
        note: note.trim(),
        mood,
        createdAt: now,
        updatedAt: now
      },
      photoFiles
    );

    setPhotoFiles([]);
    setNote("");
    setMood("calm");
    setMessage(`已保存 ${photoFiles.length} 张照片。`);
    await refresh();
  }

  async function handleUpdate() {
    if (!entry) {
      return;
    }

    await updateEntry(entry.id, {
      note: note.trim(),
      mood
    });

    if (photoFiles.length > 0) {
      await appendPhotosToEntry(entry, photoFiles);
    }

    setIsEditing(false);
    setPhotoFiles([]);
    setMessage(
      photoFiles.length > 0
        ? `已追加 ${photoFiles.length} 张照片。`
        : "今天的片刻已经更新。"
    );
    await refresh();
    setPhotos(await getPhotosForEntry(entry.id));
  }

  function startEditing() {
    if (!entry) {
      return;
    }

    setNote(entry.note);
    setMood(entry.mood);
    setPhotoFiles([]);
    setMessage("");
    setIsEditing(true);
  }

  if (isLoading) {
    return (
      <p className="pt-12 text-center text-sm text-[var(--muted)]">
        正在打开今天...
      </p>
    );
  }

  if (entry && !isEditing) {
    return (
      <section className="space-y-5">
        <header className="space-y-3 pt-4">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 hairline" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">
              Frame saved
            </p>
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-[var(--ink)]">
            今天已经记录过了，辛苦了。
          </h1>
        </header>

        <Card className="space-y-4 p-3">
          <PhotoGallery photos={photos} />
          <div className="px-1 pb-1">
            <p className="font-display text-lg font-semibold text-[var(--ink)]">
              {formatDisplayDate(entry.date)}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
              {getMoodText(entry.mood)}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-[var(--ink)]">
              {entry.note || "这一刻没有留下文字。"}
            </p>
          </div>
          <Button onClick={startEditing} variant="secondary">
            Edit
          </Button>
        </Card>

        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand)]">
            Daily Pause
          </p>
          <p className="font-display text-sm text-[var(--muted)]">{today}</p>
        </div>
        <h1 className="font-display text-[2.7rem] font-semibold leading-[0.98] text-[var(--ink)]">
          留一帧，
          <br />
          或几帧。
        </h1>
        <p className="max-w-[17rem] text-sm leading-6 text-[var(--muted)]">
          今天有没有一些瞬间，值得你为自己停一下？
        </p>
      </header>

      <Card className="relative space-y-5 overflow-hidden p-4">
        <div className="absolute right-4 top-4 font-display text-5xl text-[rgba(25,26,23,0.06)]">
          01
        </div>
        {isEditing ? (
          <p className="text-sm text-[var(--muted)]">
            可以追加照片，已保存的照片会继续保留。
          </p>
        ) : null}
        <PhotoPicker files={photoFiles} onChange={setPhotoFiles} />
        <label className="block">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--moss)]">
            一句话就够了
          </span>
          <textarea
            className="min-h-28 w-full resize-none rounded-lg border border-white/80 bg-white/45 px-3 py-3 text-base leading-7 text-[var(--ink)] outline-none transition placeholder:text-stone-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(53,191,171,0.2)]"
            maxLength={180}
            onChange={(event) => setNote(event.target.value)}
            placeholder="写下此刻的光、风，或一点点心情。"
            value={note}
          />
        </label>
        <MoodSelector onChange={setMood} value={mood} />
        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={!isEditing && photoFiles.length === 0}
            onClick={isEditing ? handleUpdate : handleSave}
          >
            {isEditing ? "Save changes" : "Save"}
          </Button>
          {isEditing ? (
            <Button
              onClick={() => {
                setIsEditing(false);
                setPhotoFiles([]);
              }}
              variant="ghost"
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </Card>

      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </section>
  );
}
