import { db } from "./database";
import {
  addPhoto,
  addPhotos,
  attachCoverPhotos,
  clearAllPhotos,
  deletePhotosForEntry
} from "./photosRepository";
import type { DailyEntry, DailyEntryWithCoverPhoto } from "../types";
import { getMonthRange } from "../utils/date";

export async function addEntry(entry: DailyEntry): Promise<string> {
  await db.entries.put(entry);
  return entry.id;
}

export async function addEntryWithCoverPhoto(
  entry: Omit<DailyEntry, "coverPhotoId">,
  photoFile: File
): Promise<string> {
  await db.transaction("rw", db.entries, db.photos, async () => {
    const photoId = await addPhoto({
      entryId: entry.id,
      photoBlob: photoFile,
      mimeType: photoFile.type,
      size: photoFile.size,
      createdAt: entry.createdAt
    });

    await db.entries.put({ ...entry, coverPhotoId: photoId });
  });

  return entry.id;
}

export async function addEntryWithPhotos(
  entry: Omit<DailyEntry, "coverPhotoId">,
  photoFiles: File[]
): Promise<string> {
  await db.transaction("rw", db.entries, db.photos, async () => {
    const photoIds = await addPhotos(
      photoFiles.map((photoFile) => ({
        entryId: entry.id,
        photoBlob: photoFile,
        mimeType: photoFile.type,
        size: photoFile.size,
        createdAt: entry.createdAt
      }))
    );

    await db.entries.put({ ...entry, coverPhotoId: photoIds[0] });
  });

  return entry.id;
}

export async function updateEntry(
  id: string,
  changes: Partial<DailyEntry>
): Promise<void> {
  await db.entries.update(id, { ...changes, updatedAt: Date.now() });
}

export async function deleteEntry(id: string): Promise<void> {
  await db.transaction("rw", db.entries, db.photos, async () => {
    await deletePhotosForEntry(id);
    await db.entries.delete(id);
  });
}

export async function getEntryById(
  id: string
): Promise<DailyEntry | undefined> {
  return db.entries.get(id);
}

export async function getEntryByDate(
  date: string
): Promise<DailyEntry | undefined> {
  return db.entries.where("date").equals(date).first();
}

export async function getAllEntries(): Promise<DailyEntry[]> {
  const entries = await db.entries.toArray();
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getEntryCount(): Promise<number> {
  return db.entries.count();
}

export async function getAllEntriesWithCoverPhotos(): Promise<
  DailyEntryWithCoverPhoto[]
> {
  return attachCoverPhotos(await getAllEntries());
}

export async function getEntriesByMonth(
  year: number,
  month: number
): Promise<DailyEntry[]> {
  const { start, end } = getMonthRange(year, month);
  const entries = await db.entries
    .where("date")
    .between(start, end, true, true)
    .toArray();

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getEntriesByMonthWithCoverPhotos(
  year: number,
  month: number
): Promise<DailyEntryWithCoverPhoto[]> {
  return attachCoverPhotos(await getEntriesByMonth(year, month));
}

export async function replaceCoverPhoto(
  entry: DailyEntry,
  photoFile: File
): Promise<void> {
  await db.transaction("rw", db.entries, db.photos, async () => {
    const photoId = await addPhoto({
      entryId: entry.id,
      photoBlob: photoFile,
      mimeType: photoFile.type,
      size: photoFile.size
    });

    await db.entries.update(entry.id, {
      coverPhotoId: photoId,
      updatedAt: Date.now()
    });
  });
}

export async function appendPhotosToEntry(
  entry: DailyEntry,
  photoFiles: File[]
): Promise<void> {
  if (photoFiles.length === 0) {
    return;
  }

  await db.transaction("rw", db.entries, db.photos, async () => {
    const photoIds = await addPhotos(
      photoFiles.map((photoFile) => ({
        entryId: entry.id,
        photoBlob: photoFile,
        mimeType: photoFile.type,
        size: photoFile.size
      }))
    );

    await db.entries.update(entry.id, {
      coverPhotoId: entry.coverPhotoId ?? photoIds[0],
      updatedAt: Date.now()
    });
  });
}

export async function clearAllEntries(): Promise<void> {
  await db.transaction("rw", db.entries, db.photos, async () => {
    await db.entries.clear();
    await clearAllPhotos();
  });
}
