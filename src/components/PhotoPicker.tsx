import { useId, useState } from "react";
import { useDisplayImageUrl } from "../hooks/useDisplayImageUrl";
import { prepareImageFile, validateLocalImageFile } from "../utils/image";

const maxPhotos = 8;

interface PhotoPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
}

function SelectedPhoto({ file }: { file: File }) {
  const previewUrl = useDisplayImageUrl(file);

  if (!previewUrl) {
    return null;
  }

  return (
    <figure className="group relative overflow-hidden rounded-lg border border-white/80 bg-white/55 shadow-[0_12px_32px_rgba(35,37,32,0.10)]">
      <img
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
        src={previewUrl}
      />
      <img
        alt={file.name || "已选择照片预览"}
        className="relative z-10 aspect-[4/3] w-full object-contain"
        src={previewUrl}
      />
    </figure>
  );
}

export default function PhotoPicker({ files, onChange }: PhotoPickerProps) {
  const inputId = useId();
  const [error, setError] = useState("");

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const nextFiles = [...files];

    for (const file of selectedFiles) {
      if (nextFiles.length >= maxPhotos) {
        setError(`最多选择 ${maxPhotos} 张照片。`);
        break;
      }

      const validation = await validateLocalImageFile(file);

      if (!validation.ok) {
        setError(validation.error ?? "请选择一张安全的图片。");
        event.target.value = "";
        return;
      }

      nextFiles.push(await prepareImageFile(file));
    }

    setError("");
    onChange(nextFiles);
    event.target.value = "";
  }

  function removePhoto(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="space-y-3">
      <label className="block" htmlFor={inputId}>
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--moss)]">
          拍下让你慢下来的画面
        </span>
        <span className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-white/80 bg-white/45 px-3 shadow-[0_10px_24px_rgba(35,37,32,0.06)]">
          <span className="truncate text-sm text-[var(--muted)]">
            {files.length > 0
              ? `已选择 ${files.length} 张照片`
              : "选择或拍摄照片，可以多选"}
          </span>
          <span className="rounded-md bg-[var(--charcoal)] px-3 py-2 text-sm font-semibold text-white">
            Photos
          </span>
        </span>
      </label>
      <input
        accept="image/jpeg,image/png,image/webp,image/gif"
        capture="environment"
        className="sr-only"
        id={inputId}
        multiple
        onChange={handleChange}
        type="file"
      />
      {error ? <p className="text-sm text-[var(--clay)]">{error}</p> : null}

      {files.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {files.map((file, index) => (
            <div className="relative" key={`${file.name}-${file.lastModified}-${index}`}>
              <SelectedPhoto file={file} />
              <button
                aria-label="移除这张照片"
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur"
                onClick={() => removePhoto(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[rgba(25,26,23,0.24)] bg-white/35 px-6 text-center">
          <div className="absolute inset-4 border border-white/70" />
          <p className="font-display text-lg leading-7 text-[var(--muted)]">
            不用完美，
            <br />
            只要真实。
          </p>
        </div>
      )}
    </div>
  );
}
