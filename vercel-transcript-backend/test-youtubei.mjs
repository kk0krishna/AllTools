import { Innertube, UniversalCache } from 'youtubei.js';

async function testYoutubei() {
  try {
    const yt = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true
    });
    
    const info = await yt.getInfo('CkP_8bkjf1E');
    
    if (info.captions?.caption_tracks?.length > 0) {
      const transcriptData = await info.getTranscript();
      console.log("Success! Transcript length:", transcriptData.transcript.content.body.initial_segments.length);
    } else {
      console.log("No captions available for this video according to youtubei.");
    }
  } catch (error) {
    console.error("Youtubei failed:", error);
  }
}

testYoutubei();
