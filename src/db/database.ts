import Dexie, { type EntityTable } from "dexie";
import type { AppSettings, DailyEntry, EntryPhoto } from "../types";

export const db = new Dexie("DailyPauseDatabase") as Dexie & {
  entries: EntityTable<DailyEntry, "id">;
  photos: EntityTable<EntryPhoto, "id">;
  settings: EntityTable<AppSettings, "id">;
};

db.version(1).stores({
  entries: "id, &date, createdAt, updatedAt",
  settings: "id"
});

db.version(2)
  .stores({
    entries: "id, &date, coverPhotoId, createdAt, updatedAt",
    photos: "id, entryId, createdAt",
    settings: "id"
  })
  .upgrade(async (transaction) => {
    type LegacyEntry = DailyEntry & { photoBlob?: Blob };
    const entries = await transaction.table<LegacyEntry, string>("entries").toArray();

    for (const entry of entries) {
      if (!entry.photoBlob || entry.coverPhotoId) {
        continue;
      }

      const photoId =
        "randomUUID" in crypto
          ? crypto.randomUUID()
          : `photo-${entry.id}-${entry.createdAt}`;

      await transaction.table<EntryPhoto, string>("photos").put({
        id: photoId,
        entryId: entry.id,
        photoBlob: entry.photoBlob,
        mimeType: entry.photoBlob.type || "image/jpeg",
        size: entry.photoBlob.size,
        createdAt: entry.createdAt
      });

      await transaction.table<DailyEntry, string>("entries").put({
        id: entry.id,
        date: entry.date,
        note: entry.note,
        mood: entry.mood,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        coverPhotoId: photoId
      });
    }
  });
