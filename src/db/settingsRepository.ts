import { db } from "./database";
import type { AppSettings } from "../types";

const defaultSettings: AppSettings = {
  id: "settings",
  reminderEnabled: false,
  reminderTime: "20:30",
  theme: "system"
};

export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.get("settings");
  if (settings) {
    return settings;
  }

  await db.settings.put(defaultSettings);
  return defaultSettings;
}

export async function updateSettings(
  changes: Partial<AppSettings>
): Promise<void> {
  await db.settings.put({ ...(await getSettings()), ...changes, id: "settings" });
}
