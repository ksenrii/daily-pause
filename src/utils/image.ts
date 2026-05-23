const maxImageBytes = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

interface ImageValidationResult {
  ok: boolean;
  error?: string;
}

export async function validateLocalImageFile(
  file: File
): Promise<ImageValidationResult> {
  if (file.size > maxImageBytes) {
    return { ok: false, error: "图片不能超过 10MB。" };
  }

  if (file.size === 0) {
    return { ok: false, error: "这张图片是空文件，请换一张。" };
  }

  const detectedMimeType = await detectImageMimeType(file);

  if (!detectedMimeType) {
    return {
      ok: false,
      error: "只支持 JPEG、PNG、WebP 或 GIF 图片。"
    };
  }

  if (file.type && !allowedMimeTypes.has(file.type)) {
    return {
      ok: false,
      error: "这类图片格式暂不支持。"
    };
  }

  if (file.type && file.type !== detectedMimeType) {
    return {
      ok: false,
      error: "图片类型和文件内容不一致，请换一张。"
    };
  }

  return { ok: true };
}

export async function removeBlackLetterbox(blob: Blob): Promise<Blob> {
  if (blob.type === "image/gif") {
    return blob;
  }

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    bitmap.close();
    return blob;
  }

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const crop = detectBlackBorderCrop(imageData.data, canvas.width, canvas.height);

  if (!crop) {
    return blob;
  }

  const outputCanvas = document.createElement("canvas");
  const outputContext = outputCanvas.getContext("2d");

  if (!outputContext) {
    return blob;
  }

  outputCanvas.width = crop.width;
  outputCanvas.height = crop.height;
  outputContext.drawImage(
    canvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  const outputType = blob.type === "image/png" ? "image/png" : "image/jpeg";
  const croppedBlob = await new Promise<Blob | null>((resolve) => {
    outputCanvas.toBlob(resolve, outputType, 0.92);
  });

  return croppedBlob ?? blob;
}

export async function prepareImageFile(file: File): Promise<File> {
  const cropped = await removeBlackLetterbox(file);

  if (cropped === file) {
    return file;
  }

  return new File([cropped], file.name, {
    type: cropped.type || file.type,
    lastModified: file.lastModified
  });
}

async function detectImageMimeType(file: File): Promise<string | undefined> {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (matches(header, [0xff, 0xd8, 0xff])) {
    return "image/jpeg";
  }

  if (matches(header, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }

  if (matches(header, [0x47, 0x49, 0x46, 0x38])) {
    return "image/gif";
  }

  if (
    matches(header, [0x52, 0x49, 0x46, 0x46]) &&
    matches(header.slice(8), [0x57, 0x45, 0x42, 0x50])
  ) {
    return "image/webp";
  }

  return undefined;
}

function matches(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function detectBlackBorderCrop(
  data: Uint8ClampedArray,
  width: number,
  height: number
): CropRect | undefined {
  const top = findFirstContentRow(data, width, height, 0, 1);
  const bottom = findFirstContentRow(data, width, height, height - 1, -1);
  const left = findFirstContentColumn(data, width, height, 0, 1, top, bottom);
  const right = findFirstContentColumn(data, width, height, width - 1, -1, top, bottom);

  const cropWidth = right - left + 1;
  const cropHeight = bottom - top + 1;
  const croppedEnough =
    top > height * 0.015 ||
    height - 1 - bottom > height * 0.015 ||
    left > width * 0.015 ||
    width - 1 - right > width * 0.015;

  if (
    !croppedEnough ||
    cropWidth < width * 0.6 ||
    cropHeight < height * 0.6
  ) {
    return undefined;
  }

  return { x: left, y: top, width: cropWidth, height: cropHeight };
}

function findFirstContentRow(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  start: number,
  step: 1 | -1
): number {
  for (let y = start; y >= 0 && y < height; y += step) {
    if (!isBlackRow(data, width, y)) {
      return y;
    }
  }

  return step === 1 ? 0 : height - 1;
}

function findFirstContentColumn(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  start: number,
  step: 1 | -1,
  top: number,
  bottom: number
): number {
  for (let x = start; x >= 0 && x < width; x += step) {
    if (!isBlackColumn(data, width, x, top, bottom)) {
      return x;
    }
  }

  return step === 1 ? 0 : width - 1;
}

function isBlackRow(
  data: Uint8ClampedArray,
  width: number,
  y: number
): boolean {
  let blackPixels = 0;

  for (let x = 0; x < width; x += 1) {
    if (isNearBlack(data, (y * width + x) * 4)) {
      blackPixels += 1;
    }
  }

  return blackPixels / width > 0.92;
}

function isBlackColumn(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  top: number,
  bottom: number
): boolean {
  let blackPixels = 0;
  const total = bottom - top + 1;

  for (let y = top; y <= bottom; y += 1) {
    if (isNearBlack(data, (y * width + x) * 4)) {
      blackPixels += 1;
    }
  }

  return blackPixels / total > 0.92;
}

function isNearBlack(data: Uint8ClampedArray, index: number): boolean {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const alpha = data[index + 3];

  if (alpha < 16) {
    return false;
  }

  return red < 34 && green < 34 && blue < 34;
}
