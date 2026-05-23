export type Mood = string;

export interface DailyEntry {
  id: string;
  date: string;
  coverPhotoId?: string;
  note: string;
  mood: Mood;
  createdAt: number;
  updatedAt: number;
}

export interface EntryPhoto {
  id: string;
  entryId: string;
  photoBlob: Blob;
  mimeType: string;
  size: number;
  createdAt: number;
}

export interface DailyEntryWithCoverPhoto extends DailyEntry {
  coverPhoto?: EntryPhoto;
}

export interface AppSettings {
  id: "settings";
  reminderEnabled: boolean;
  reminderTime: string;
  theme: "system" | "light" | "dark";
}
