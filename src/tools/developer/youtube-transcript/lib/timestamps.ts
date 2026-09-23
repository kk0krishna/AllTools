export function formatTimestamp(
  seconds: number,
  format: "srt" | "vtt" | "readable" | "short"
): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const pad = (num: number, size: number) => num.toString().padStart(size, "0");

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  switch (format) {
    case "srt":
      // HH:MM:SS,mmm
      return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(milliseconds, 3)}`;
    case "vtt":
      // HH:MM:SS.mmm
      return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}.${pad(milliseconds, 3)}`;
    case "readable":
      // HH:MM:SS
      return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}`;
    case "short":
      // MM:SS or HH:MM:SS if > 1 hour
      if (hours > 0) {
        return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}`;
      }
      return `${pad(minutes, 2)}:${pad(secs, 2)}`;
    default:
      return "00:00";
  }
}
