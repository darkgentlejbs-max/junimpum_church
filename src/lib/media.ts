export function getYoutubeVideoId(url?: string): string | null {
  if (!url || !url.includes("youtu")) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=[&]?)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function isVideoMedia(url?: string, fileName?: string): boolean {
  if (!url && !fileName) return false;
  const str = `${fileName || ""} ${url || ""}`.toLowerCase();
  return (
    str.includes(".mp4") ||
    str.includes(".mov") ||
    str.includes(".webm") ||
    str.includes(".m4v") ||
    str.includes(".ogg")
  );
}

export function isAnyVideoMedia(url?: string, fileName?: string): boolean {
  return isVideoMedia(url, fileName) || Boolean(getYoutubeVideoId(url));
}

export function getDisplayImageUrl(imageUrl: string): string {
  const ytId = getYoutubeVideoId(imageUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return imageUrl;
}
