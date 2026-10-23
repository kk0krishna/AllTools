/**
 * Tab audio stream recorder for high-fidelity browser speech capture.
 */

export interface RecordedAudio {
  blob: Blob;
  url: string;
  durationSeconds: number;
  mimeType: string;
}

export function isDisplayAudioCaptureSupported(): boolean {
  if (typeof window === "undefined" || !navigator.mediaDevices) return false;
  return typeof navigator.mediaDevices.getDisplayMedia === "function";
}

export class TabAudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private recordedChunks: Blob[] = [];
  private startTime: number = 0;

  async start(): Promise<boolean> {
    if (!isDisplayAudioCaptureSupported()) {
      throw new Error("Screen/Tab Audio capture is not supported in this browser.");
    }

    this.recordedChunks = [];

    // Request display media with audio enabled
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true, // Required by browser specs to invoke display picker
      audio: true, // Crucial: Captures tab audio
    });

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      // Clean up video track
      stream.getTracks().forEach((track) => track.stop());
      throw new Error(
        "No audio track was selected. Please make sure to check the 'Also share tab audio' checkbox in the browser prompt."
      );
    }

    // Stop unused video track immediately to conserve resources
    stream.getVideoTracks().forEach((track) => track.stop());

    const audioStream = new MediaStream(audioTracks);
    this.mediaStream = audioStream;

    // Pick best supported MIME type
    const mimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];
    let selectedMime = "";
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    const options: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
    this.mediaRecorder = new MediaRecorder(audioStream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.startTime = Date.now();
    this.mediaRecorder.start(100); // 100ms chunks

    return true;
  }

  stop(): Promise<RecordedAudio> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error("Recorder is not active"));
      }

      const durationSeconds = Math.max(0.5, (Date.now() - this.startTime) / 1000);

      this.mediaRecorder.onstop = () => {
        try {
          const mimeType = this.mediaRecorder?.mimeType || "audio/webm";
          const audioBlob = new Blob(this.recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(audioBlob);

          // Stop all streams
          if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
          }

          resolve({
            blob: audioBlob,
            url,
            durationSeconds,
            mimeType,
          });
        } catch (err) {
          reject(err);
        }
      };

      if (this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
      }
    });
  }

  cancel() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.recordedChunks = [];
  }
}
