import media from "./media.json";

/** Resolve original logical paths to immutable hosted game assets. */
export function gameMedia(path: string): string {
  const url = (media as Record<string, string>)[path];
  if (!url) throw new Error(`Unregistered game artwork: ${path}`);
  return url;
}