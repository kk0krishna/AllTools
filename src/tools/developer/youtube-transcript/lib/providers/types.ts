export interface TranscriptSegment {
  id: string;
  start: number; // seconds
  end?: number; // seconds
  text: string;
}

export interface TranscriptTrack {
  languageCode: string;
  languageName?: string;
  kind: "manual" | "auto" | "unknown";
  isTranslatable?: boolean;
  segments: TranscriptSegment[];
}

export interface VideoMetadata {
  videoId: string;
  url: string;
  title?: string;
  channelName?: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface TranscriptDocument {
  video: VideoMetadata;
  selectedTrack: TranscriptTrack;
  fetchedAt: string;
  source: string;
}

export interface TranscriptTrackInfo {
  languageCode: string;
  languageName: string;
  kind: "manual" | "auto" | "unknown";
  url: string; // The URL to fetch the actual transcript
}

export interface TranscriptProvider {
  getVideoInfo(videoId: string): Promise<VideoMetadata>;
  listTracks(videoId: string): Promise<TranscriptTrackInfo[]>;
  getTranscript(
    videoId: string,
    languageCode?: string
  ): Promise<TranscriptTrack>;
}
