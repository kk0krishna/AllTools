import { TranscriptProvider, TranscriptSegment, VideoMetadata, TranscriptTrackInfo, TranscriptTrack } from './types';

export class VercelTranscriptProvider implements TranscriptProvider {
  private vercelUrl: string;

  constructor(vercelUrl: string = "https://your-vercel-app-url.vercel.app") {
    this.vercelUrl = vercelUrl.replace(/\/$/, "");
  }

  async getVideoInfo(videoId: string): Promise<VideoMetadata> {
    try {
      // Use YouTube's oEmbed endpoint to securely get metadata without scraping
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(oembedUrl);
      if (!res.ok) throw new Error("Failed to fetch video metadata via oEmbed");
      const data = await res.json();
      
      return {
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: data.title,
        channelName: data.author_name,
        thumbnailUrl: data.thumbnail_url,
      };
    } catch (error) {
      console.error(error);
      return {
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: "Unknown Video",
      };
    }
  }

  async listTracks(videoId: string): Promise<TranscriptTrackInfo[]> {
    // For the Vercel MVP, we only expose the default track retrieved by the backend.
    return [
      {
        languageCode: "en",
        languageName: "Default / English",
        kind: "auto",
        url: `${this.vercelUrl}/api/transcript?videoId=${videoId}`
      }
    ];
  }

  async getTranscript(videoId: string, languageCode?: string): Promise<TranscriptTrack> {
    try {
      const apiUrl = `${this.vercelUrl}/api/transcript?videoId=${videoId}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch transcript from Vercel backend. Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.transcript || !Array.isArray(data.transcript)) {
        throw new Error("Invalid response format from Vercel backend");
      }

      // Map the backend transcript array to our frontend TranscriptSegment format
      const segments = data.transcript.map((item: any, index: number) => ({
        id: index.toString(),
        start: item.offset / 1000,
        end: (item.offset + item.duration) / 1000,
        text: item.text
      }));

      return {
        languageCode: "en",
        languageName: "Default / English",
        kind: "auto",
        segments
      };
    } catch (error: any) {
      console.error("VercelTranscriptProvider error:", error);
      throw error;
    }
  }
}
