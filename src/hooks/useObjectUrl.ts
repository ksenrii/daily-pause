import { useEffect, useState } from "react";

export function useObjectUrl(blob?: Blob | File | null): string | undefined {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!blob) {
      setUrl(undefined);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  return url;
}
