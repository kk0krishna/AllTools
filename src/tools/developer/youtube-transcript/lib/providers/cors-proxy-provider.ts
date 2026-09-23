import { TranscriptProvider, TranscriptTrackInfo, VideoMetadata, TranscriptTrack, TranscriptSegment } from "./types";

export class CorsProxyProvider implements TranscriptProvider {
  // Using custom Cloudflare Worker for YouTube CORS proxy with robust endpoints
  private proxyUrl(url: string, type: "page" | "thumb" | "caption" | "api" = "page") {
    const cloudflareProxyUrl = "https://ytproxy.krishna-k-mbbs.workers.dev";
    return `${cloudflareProxyUrl}/api/${type}?url=${encodeURIComponent(url)}`;
  }

  private async fetchYouTubePage(videoId: string): Promise<string> {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await fetch(this.proxyUrl(url, "page"));
    
    if (!res.ok) {
      throw new Error(`Failed to fetch video page. Status: ${res.status}`);
    }
    
    return await res.text();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractPlayerResponse(html: string): any {
    // Look for ytInitialPlayerResponse
    const regex = /var ytInitialPlayerResponse = ({[\s\S]*?});/;
    const match = html.match(regex);
    if (!match || !match[1]) {
      // Fallback: look for window["ytInitialPlayerResponse"]
      const regex2 = /window\["ytInitialPlayerResponse"\] = ({[\s\S]*?});/;
      const match2 = html.match(regex2);
      if (!match2 || !match2[1]) {
        throw new Error("Could not find ytInitialPlayerResponse in page. Video might be unavailable or age-restricted.");
      }
      return JSON.parse(match2[1]);
    }
    return JSON.parse(match[1]);
  }

  async getVideoInfo(videoId: string): Promise<VideoMetadata> {
    const html = await this.fetchYouTubePage(videoId);
    const playerResponse = this.extractPlayerResponse(html);
    
    // Check if the video is actually playable
    if (playerResponse?.playabilityStatus?.status === "ERROR" || playerResponse?.playabilityStatus?.status === "UNPLAYABLE") {
      throw new Error(`Video is unavailable: ${playerResponse.playabilityStatus.reason || "It may be private or deleted."}`);
    }

    const details = playerResponse?.videoDetails;
    
    if (!details) {
      throw new Error("Could not extract video details. The video may be age-restricted or unavailable.");
    }
    
    return {
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: details.title,
      channelName: details.author,
      duration: parseInt(details.lengthSeconds || "0", 10),
      thumbnailUrl: details.thumbnail?.thumbnails?.[0]?.url,
    };
  }

  async listTracks(videoId: string): Promise<TranscriptTrackInfo[]> {
    const html = await this.fetchYouTubePage(videoId);
    const playerResponse = this.extractPlayerResponse(html);
    
    const tracklist = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!tracklist || !Array.isArray(tracklist)) {
      return [];
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return tracklist.map((track: any) => ({
      languageCode: track.languageCode,
      languageName: track.name?.simpleText || track.languageCode,
      kind: track.kind === "asr" ? "auto" : "manual",
      url: track.baseUrl,
    }));
  }

  async getTranscript(videoId: string, languageCode?: string): Promise<TranscriptTrack> {
    const tracks = await this.listTracks(videoId);
    
    if (tracks.length === 0) {
      throw new Error("No accessible transcript or captions were found for this video.");
    }
    
    // Select the requested track, or default to English, or fallback to the first track.
    let selectedTrackInfo = tracks[0];
    if (languageCode) {
      const match = tracks.find(t => t.languageCode === languageCode);
      if (match) {
        selectedTrackInfo = match;
      } else {
        throw new Error("A transcript is available, but not in the selected language.");
      }
    } else {
      // Default heuristics: prefer manual over auto, prefer english
      const enManual = tracks.find(t => t.languageCode.startsWith('en') && t.kind === "manual");
      const enAuto = tracks.find(t => t.languageCode.startsWith('en') && t.kind === "auto");
      const anyManual = tracks.find(t => t.kind === "manual");
      selectedTrackInfo = enManual || enAuto || anyManual || tracks[0];
    }
    
    // Fetch the transcript XML
    const xmlUrl = selectedTrackInfo.url;
    // Proxify the request as a caption resource
    const res = await fetch(this.proxyUrl(xmlUrl, "caption"));
    if (!res.ok) {
      throw new Error(`Failed to fetch transcript XML. Status: ${res.status}`);
    }
    
    const xmlText = await res.text();
    
    // Parse the XML using DOMParser (since this will run in the browser)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    const textNodes = Array.from(xmlDoc.getElementsByTagName("text"));
    
    const segments: TranscriptSegment[] = textNodes.map((node, index) => {
      const start = parseFloat(node.getAttribute("start") || "0");
      const dur = parseFloat(node.getAttribute("dur") || "0");
      // InnerHTML can contain escaped HTML like &#39;, textContent gets unescaped text
      let text = node.textContent || "";
      // Replace non-breaking spaces and trim
      text = text.replace(/&nbsp;/g, " ").trim();
      // Remove duplicate adjacent whitespace
      text = text.replace(/\s+/g, " ");
      
      return {
        id: index.toString(),
        start,
        end: start + dur,
        text,
      };
    }).filter(seg => seg.text.length > 0);
    
    // Deduplicate logic (conservative overlap detector as per spec)
    // Sometimes auto-captions overlap.
    const cleanedSegments: TranscriptSegment[] = [];
    for (let i = 0; i < segments.length; i++) {
      if (i === 0) {
        cleanedSegments.push(segments[i]);
        continue;
      }
      
      const prev = cleanedSegments[cleanedSegments.length - 1];
      const curr = segments[i];
      
      // Check for overlap in text
      // E.g. Prev: "Welcome to", Curr: "Welcome to today's lecture"
      // If curr starts with prev, we can just replace prev with curr, but we must update the start time.
      if (curr.text.startsWith(prev.text) && prev.text.length > 3) {
        // High confidence overlap
        // We modify the current one to adopt the start time of the previous one
        // and remove the previous one.
        curr.start = prev.start;
        cleanedSegments.pop();
        cleanedSegments.push(curr);
      } else {
         cleanedSegments.push(curr);
      }
    }
    
    return {
      languageCode: selectedTrackInfo.languageCode,
      languageName: selectedTrackInfo.languageName,
      kind: selectedTrackInfo.kind,
      segments: cleanedSegments,
    };
  }
}
