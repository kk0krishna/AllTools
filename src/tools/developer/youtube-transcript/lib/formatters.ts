import { TranscriptDocument } from "./providers/types";
import { formatTimestamp } from "./timestamps";

export interface TranscriptFormatter {
  format(doc: TranscriptDocument): string;
}

export const txtFormatter: TranscriptFormatter = {
  format: (doc) => {
    return doc.selectedTrack.segments.map((seg) => seg.text).join(" ");
  },
};

export const markdownFormatter: TranscriptFormatter = {
  format: (doc) => {
    return `# ${doc.video.title || "Video Title"}\n\n## Transcript\n\n${doc.selectedTrack.segments.map((seg) => seg.text).join(" ")}`;
  },
};

export const jsonFormatter: TranscriptFormatter = {
  format: (doc) => {
    return JSON.stringify(
      {
        video: {
          id: doc.video.videoId,
          title: doc.video.title,
        },
        language: doc.selectedTrack.languageCode,
        type: doc.selectedTrack.kind,
        segments: doc.selectedTrack.segments.map((seg) => ({
          start: seg.start,
          end: seg.end,
          text: seg.text,
        })),
      },
      null,
      2
    );
  },
};

export const srtFormatter: TranscriptFormatter = {
  format: (doc) => {
    return doc.selectedTrack.segments
      .map((seg, i) => {
        const start = formatTimestamp(seg.start, "srt");
        const end = formatTimestamp(seg.end || seg.start + 2, "srt");
        return `${i + 1}\n${start} --> ${end}\n${seg.text}\n`;
      })
      .join("\n");
  },
};

export const vttFormatter: TranscriptFormatter = {
  format: (doc) => {
    const segments = doc.selectedTrack.segments
      .map((seg) => {
        const start = formatTimestamp(seg.start, "vtt");
        const end = formatTimestamp(seg.end || seg.start + 2, "vtt");
        return `${start} --> ${end}\n${seg.text}\n`;
      })
      .join("\n");
    return `WEBVTT\n\n${segments}`;
  },
};

export const csvFormatter: TranscriptFormatter = {
  format: (doc) => {
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
    const header = "index,start,end,text\n";
    const rows = doc.selectedTrack.segments
      .map((seg, i) => {
        return `${i},${seg.start},${seg.end || seg.start + 2},${escapeCsv(seg.text)}`;
      })
      .join("\n");
    return header + rows;
  },
};

export const formatters = {
  txt: txtFormatter,
  md: markdownFormatter,
  json: jsonFormatter,
  csv: csvFormatter,
  srt: srtFormatter,
  vtt: vttFormatter,
};
