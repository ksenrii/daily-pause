import { db } from "./database";
import type { DailyEntry, EntryPhoto } from "../types";
import { createId } from "../utils/id";

interface CreatePhotoInput {
  entryId: string;
  photoBlob: Blob;
  mimeType: string;
  size: number;
  createdAt?: number;
}

export async function addPhoto(input: CreatePhotoInput): Promise<string> {
  const id = createId();

  await db.photos.add({
    id,
    entryId: input.entryId,
    photoBlob: input.photoBlob,
    mimeType: input.mimeType,
    size: input.size,
    createdAt: input.createdAt ?? Date.now()
  });

  return id;
}

export async function addPhotos(inputs: CreatePhotoInput[]): Promise<string[]> {
  const photos = inputs.map((input) => ({
    id: createId(),
    entryId: input.entryId,
    photoBlob: input.photoBlob,
    mimeType: input.mimeType,
    size: input.size,
    createdAt: input.createdAt ?? Date.now()
  }));

  await db.photos.bulkAdd(photos);

  return photos.map((photo) => photo.id);
}

export async function getPhotoById(
  id?: string
): Promise<EntryPhoto | undefined> {
  if (!id) {
    return undefined;
  }

  return db.photos.get(id);
}

export async function getCoverPhotoForEntry(
  entry: DailyEntry
): Promise<EntryPhoto | undefined> {
  return getPhotoById(entry.coverPhotoId);
}

export async function getPhotosForEntry(entryId: string): Promise<EntryPhoto[]> {
  const photos = await db.photos.where("entryId").equals(entryId).toArray();
  return photos.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getPhotoStats(): Promise<{
  count: number;
  totalBytes: number;
}> {
  const photos = await db.photos.toArray();
  return {
    count: photos.length,
    totalBytes: photos.reduce((total, photo) => total + photo.size, 0)
  };
}

export async function attachCoverPhotos<T extends DailyEntry>(
  entries: T[]
): Promise<Array<T & { coverPhoto?: EntryPhoto }>> {
  const coverIds = entries
    .map((entry) => entry.coverPhotoId)
    .filter((id): id is string => Boolean(id));

  const photos = await db.photos.bulkGet(coverIds);
  const photoMap = new Map(
    photos
      .filter((photo): photo is EntryPhoto => Boolean(photo))
      .map((photo) => [photo.id, photo])
  );

  return entries.map((entry) => ({
    ...entry,
    coverPhoto: entry.coverPhotoId
      ? photoMap.get(entry.coverPhotoId)
      : undefined
  }));
}

export async function deletePhotosForEntry(entryId: string): Promise<void> {
  await db.photos.where("entryId").equals(entryId).delete();
}

export async function clearAllPhotos(): Promise<void> {
  await db.photos.clear();
}
