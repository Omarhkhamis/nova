import "server-only";
import { promises as fs } from "fs";
import path from "path";

const publicRoot = path.join(process.cwd(), "public");
const mediaRoot = path.join(publicRoot, "media");
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

function toPublicPath(filePath: string) {
  return `/${path.relative(publicRoot, filePath).split(path.sep).join("/")}`;
}

function safeMediaPath(src: string) {
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  const target = path.resolve(publicRoot, cleanSrc);

  if (!target.startsWith(publicRoot + path.sep)) {
    throw new Error("Invalid media path.");
  }

  return target;
}

async function walkImages(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const images = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkImages(entryPath);
      }

      if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
        return [toPublicPath(entryPath)];
      }

      return [];
    }),
  );

  return images.flat();
}

export async function listPublicMedia() {
  try {
    const images = await walkImages(publicRoot);
    return images.sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export async function savePublicMedia(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  await fs.mkdir(mediaRoot, { recursive: true });

  const extension = path.extname(file.name).toLowerCase() || ".png";
  const baseName = path
    .basename(file.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const fileName = `${baseName || "image"}-${Date.now()}${extension}`;
  const destination = path.join(mediaRoot, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(destination, buffer);

  return `/media/${fileName}`;
}

export async function deletePublicMedia(src: string) {
  const target = safeMediaPath(src);

  await fs.unlink(target);
}
