import { useCallback, useEffect, useState } from "react";
import { getEntryByDate } from "../db/entriesRepository";
import type { DailyEntry } from "../types";
import { getTodayDateString } from "../utils/date";

export function useTodayEntry() {
  const [entry, setEntry] = useState<DailyEntry>();
  const [isLoading, setIsLoading] = useState(true);
  const today = getTodayDateString();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setEntry(await getEntryByDate(today));
    setIsLoading(false);
  }, [today]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { entry, isLoading, refresh, today };
}
