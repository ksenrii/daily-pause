import { useCallback, useEffect, useState } from "react";
import type { DailyEntryWithCoverPhoto } from "../types";
import { getAllEntriesWithCoverPhotos } from "../db/entriesRepository";

export function useEntries() {
  const [entries, setEntries] = useState<DailyEntryWithCoverPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setEntries(await getAllEntriesWithCoverPhotos());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { entries, isLoading, refresh };
}
