import { useState } from "react";
import { createPortal } from "react-dom";
import { useDisplayImageUrl } from "../hooks/useDisplayImageUrl";
import type { EntryPhoto } from "../types";

function PhotoFrame({
  photo,
  index,
  onOpen
}: {
  photo: EntryPhoto;
  index: number;
  onOpen: (url: string, label: string) => void;
}) {
  const url = useDisplayImageUrl(photo.photoBlob);
  const label = `记录照片 ${index + 1}`;

  if (!url) {
    return null;
  }

  return (
    <figure className="group relative overflow-hidden rounded-lg border border-white/80 bg-white/55 shadow-[0_18px_48px_rgba(35,37,32,0.12)]">
      <img
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
        src={url}
      />
      <button
        aria-label={`放大查看${label}`}
        className="relative z-10 block w-full"
        onClick={() => onOpen(url, label)}
        type="button"
      >
        <img alt={label} className="max-h-[68vh] w-full object-contain" src={url} />
      </button>
    </figure>
  );
}

interface PhotoGalleryProps {
  photos: EntryPhoto[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<{ url: string; label: string }>();

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      {photos.length === 1 ? (
        <PhotoFrame index={0} onOpen={(url, label) => setLightbox({ url, label })} photo={photos[0]} />
      ) : (
        <div className="space-y-2">
          <PhotoFrame index={0} onOpen={(url, label) => setLightbox({ url, label })} photo={photos[0]} />
          <div className="grid grid-cols-2 gap-2">
            {photos.slice(1).map((photo, index) => (
              <PhotoFrame
                index={index + 1}
                key={photo.id}
                onOpen={(url, label) => setLightbox({ url, label })}
                photo={photo}
              />
            ))}
          </div>
        </div>
      )}

      {lightbox
        ? createPortal(
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md"
          onClick={() => setLightbox(undefined)}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="关闭大图"
            className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur"
            onClick={() => setLightbox(undefined)}
            type="button"
          >
            Close
          </button>
          <img
            alt={lightbox.label}
            className="h-[92vh] w-[96vw] rounded-lg object-contain shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
            src={lightbox.url}
          />
        </div>,
          document.body
        )
        : null}
    </>
  );
}
