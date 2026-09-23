import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('CkP_8bkjf1E');
    console.log("Success! Length:", transcript.length);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

test();
