import { useEffect, useState } from "react";
import { removeBlackLetterbox } from "../utils/image";

export function useDisplayImageUrl(blob?: Blob | File | null): string | undefined {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | undefined;

    async function prepareUrl() {
      if (!blob) {
        setUrl(undefined);
        return;
      }

      const displayBlob = await removeBlackLetterbox(blob);

      if (!isActive) {
        return;
      }

      objectUrl = URL.createObjectURL(displayBlob);
      setUrl(objectUrl);
    }

    void prepareUrl();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [blob]);

  return url;
}
