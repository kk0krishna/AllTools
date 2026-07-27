import { ToolEntry } from "@/tools/registry";
import { AudioSpectrumAnalyzer } from "./index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ChevronDown, BookOpen, ShieldCheck, HelpCircle, FileAudio, Disc, Activity } from "lucide-react";

export const audioSpectrumAnalyzerEntry: ToolEntry = {
  metadata: {
    name: "Audio Spectrum Analyzer & Lossless Track Verifier",
    description: "Verify if your audio tracks are truly lossless (FLAC/WAV) or fake transcoded 320 kbps MP3s. Full-track FFT spectrograms, dynamic range audits, and frequency cutoff analysis rendered 100% locally in your browser with zero file uploads.",
    category: "audio",
    slug: "audio-spectrum-analyzer",
    keywords: [
      "audio spectrum analyzer online",
      "check mp3 quality",
      "flac quality checker online",
      "spot fake 320 kbps mp3",
      "spectrogram generator online",
      "lossless audio verifier",
      "spek alternative browser",
      "check if flac is real or transcode",
      "fake 320 kbps mp3 checker",
      "audio frequency cutoff detector",
      "audiophile track forensics tool",
      "verify wav cd rip quality",
      "check audio bitrate online",
      "music frequency spectrum analyzer",
      "free audio spectrogram tool",
      "detect lossy transcode in flac",
      "measure audio dynamic range score online",
      "online spek audio checker",
      "id3 tag and encoder rip checker",
      "100 percent local browser audio analyzer",
    ],
  },
  component: AudioSpectrumAnalyzer,
  content: () => (
    <div className="space-y-8 pt-8 border-t">
      {/* Concise Knowledge Base & FAQ Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading flex items-center gap-2.5">
          <BookOpen className="size-6 text-primary" />
          <span>Audiophile Forensics & Spectrum FAQ Encyclopedia</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Click any section below to learn how acoustic forensics work, how to interpret spectrograms, and master audiophile terminology without scrolling through walls of text.
        </p>
      </div>

      {/* Master Collapsible Accordions Container */}
      <div className="space-y-3">
        {/* Accordion 1: Why check music files? */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <span>Why Check Your Music Files? The Secret of Fake 320 kbps & Lossless Rips</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 space-y-4 text-sm text-muted-foreground leading-relaxed mt-2">
            <p>
              DJs, producers, and audiophiles constantly pull tracks from record pools, digital stores, and free download gates — and the label on the filename is not always the truth. A 320 kbps MP3 re-encoded from a 128 kbps rip keeps the 320k bitrate tag but loses its top frequencies forever, and a FLAC made from an MP3 is still an MP3 underneath.
            </p>
            <p>
              A spectrogram makes this visible in seconds: lossy encoders cut the highest frequencies at predictable brickwall points, so the cutoff line tells you exactly what the audio has actually been through. This tool renders the full-track spectrogram, finds that cutoff automatically, and compares it with what the file claims to be.
            </p>
            <div className="grid gap-4 md:grid-cols-3 pt-2">
              <div className="rounded-xl bg-muted/30 p-3.5 border">
                <strong className="text-foreground block mb-1">🎯 Spot Fake 320s</strong>
                A true 320 kbps MP3 keeps energy up to roughly 20.5 kHz. If the spectrum dies at 16 kHz, the file was upconverted from a low-bitrate source.
              </div>
              <div className="rounded-xl bg-muted/30 p-3.5 border">
                <strong className="text-foreground block mb-1">💎 Verify Lossless Files</strong>
                Real lossless audio extends continuously to the edge of the spectrum. A hard horizontal cutoff around 19–20 kHz in a FLAC or WAV usually proves a lossy transcode.
              </div>
              <div className="rounded-xl bg-muted/30 p-3.5 border">
                <strong className="text-foreground block mb-1">🔒 No Uploads, No Queue</strong>
                Decoding, Fast Fourier Transform (FFT) mathematics, and canvas rendering execute 100% locally in your browser with zero server data transfer.
              </div>
            </div>
          </div>
        </details>

        {/* Accordion 2: Quick Start Guide */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <Activity className="size-5 text-emerald-500 shrink-0" />
              <span>Quick Start: 3-Step Guide to Verifying Audio Quality Locally</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 mt-2">
            <ol className="list-decimal list-inside space-y-2.5 text-sm leading-relaxed text-muted-foreground pl-1">
              <li><strong className="text-foreground">Drop any audio file</strong> into the analyzer — MP3, FLAC, WAV, AAC, OGG, and M4A all work instantly.</li>
              <li><strong className="text-foreground">Read the spectrogram:</strong> look for a hard horizontal line where color energy stops, and compare it with the cutoff frequency value the tool reports.</li>
              <li><strong className="text-foreground">Check the executive verdict</strong> against the declared format tags, and replace from a legitimate lossless source if the track fails audit.</li>
            </ol>
          </div>
        </details>

        {/* Accordion 3: How to Read the Spectrogram */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <FileAudio className="size-5 text-blue-500 shrink-0" />
              <span>How to Read a Spectrogram: Axes, Color Scales & Cutoff Signatures</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 space-y-4 text-sm text-muted-foreground leading-relaxed mt-2">
            <p>
              A spectrogram is a visual map of sound across three dimensions—time, frequency, and loudness. By understanding how to read these dimensions, you can immediately verify whether a file is genuine studio quality or a transcode.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-muted/25 p-4 border space-y-1.5">
                <strong className="text-foreground text-sm block mb-1">📐 Understanding the 3 Axes</strong>
                <p><strong className="text-foreground">Horizontal (X-Axis):</strong> Time from track start (0:00) to finish.</p>
                <p><strong className="text-foreground">Vertical (Y-Axis):</strong> Frequency (pitch) from 0 Hz (sub-bass) at the bottom up to 22 kHz or 48 kHz (ultrasonic treble) at the top.</p>
                <p><strong className="text-foreground">Color Intensity (dB):</strong> Represents energy loudness. Bright colors (yellow, white, red) indicate loud frequencies, while dark colors represent silence or low noise floor.</p>
              </div>
              <div className="rounded-xl bg-muted/25 p-4 border space-y-1.5">
                <strong className="text-foreground text-sm block mb-1">📶 Visual Signatures of Bitrates</strong>
                <p><strong className="text-foreground">True CD Lossless (FLAC/WAV):</strong> Frequencies extend continuously up to 20 kHz – 22.05 kHz with natural acoustic dither fading smoothly at the top edge.</p>
                <p><strong className="text-foreground">True 320 kbps MP3:</strong> Shows a sharp horizontal &ldquo;brickwall&rdquo; cutoff line around 20.0 kHz to 20.5 kHz.</p>
                <p><strong className="text-foreground">128 kbps MP3 / Low Bitrate:</strong> Shows a hard horizontal cutoff ceiling around 15.5 kHz to 16.0 kHz.</p>
              </div>
            </div>
            <div className="rounded-xl bg-primary/5 p-4 border border-primary/20 space-y-2">
              <strong className="text-foreground font-semibold block">💡 Quick Rule of Thumb for Verdicts:</strong>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-1">
                <li><strong className="text-foreground">FLAC file with ~20+ kHz cutoff:</strong> Genuine lossless studio master.</li>
                <li><strong className="text-foreground">FLAC file with ~16 kHz cutoff:</strong> Fake transcode (a &ldquo;lossy rip&rdquo; where an MP3 was saved as FLAC).</li>
                <li><strong className="text-foreground">MP3 file with ~20.5 kHz cutoff:</strong> Genuine 320 kbps encode (highest possible MP3 quality).</li>
                <li><strong className="text-foreground">MP3 file with ~16 kHz cutoff:</strong> Low-quality 128 kbps encode (regardless of what file tags claim).</li>
              </ul>
            </div>
          </div>
        </details>

        {/* Accordion 4: File Extensions Guide */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <Disc className="size-5 text-purple-500 shrink-0" />
              <span>Guide: Audio File Extensions Explained (.FLAC, .WAV, .MP3, .AAC, .OGG)</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 space-y-3 text-sm text-muted-foreground leading-relaxed mt-2">
            <p><strong className="text-foreground">Uncompressed (Studio Raw):</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong className="text-foreground">.wav (Waveform Audio File Format):</strong> The standard uncompressed audio format used in recording studios, CD mastering, and DAWs. (~10 MB per minute).</li>
              <li><strong className="text-foreground">.aiff / .aif (Audio Interchange File Format):</strong> Apple&rsquo;s uncompressed PCM equivalent to WAV.</li>
            </ul>
            <p className="pt-1"><strong className="text-foreground">Lossless Compressed (Studio quality, 40–50% smaller size):</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong className="text-foreground">.flac (Free Lossless Audio Codec):</strong> The universal audiophile gold standard. Compresses audio like a ZIP file with zero loss of acoustic data or dynamic range.</li>
              <li><strong className="text-foreground">.alac / .m4a (Apple Lossless):</strong> Apple&rsquo;s native lossless format used across Apple Music and iOS devices.</li>
            </ul>
            <p className="pt-1"><strong className="text-foreground">Lossy Compressed (Small file size, discards high frequencies):</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong className="text-foreground">.mp3 (MPEG-1 Audio Layer III):</strong> Uses psychoacoustic models to strip frequencies deemed &ldquo;inaudible&rdquo;, cutting off between 16 kHz and 20.5 kHz depending on bitrate.</li>
              <li><strong className="text-foreground">.aac / .m4a (Advanced Audio Coding):</strong> Modern successor to MP3 used by YouTube, Apple Music streaming, and Bluetooth audio. Provides significantly higher clarity than MP3 at identical bitrates.</li>
              <li><strong className="text-foreground">.ogg (Ogg Vorbis / Opus):</strong> High-efficiency open-source codecs used by Spotify (Vorbis) and Discord (Opus).</li>
            </ul>
          </div>
        </details>

        {/* Accordion 5: Audiophile Terminologies */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <BookOpen className="size-5 text-amber-500 shrink-0" />
              <span>Guide: Audiophile Song Editions & Terminologies (CD Rip, Studio Master, Vinyl Rip, Transcode)</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
            <p><strong className="text-foreground">Studio Master / 24-Bit Hi-Res:</strong> The direct digital master exported from the studio&rsquo;s mixing console, typically 24-bit depth and 48 kHz to 192 kHz sample rate. Offers purest dynamic resolution.</p>
            <p><strong className="text-foreground">CD Rip / Red Book (16-Bit / 44.1 kHz):</strong> Audio extracted bit-for-bit from a commercial Compact Disc using specialized verification software like Exact Audio Copy (EAC) or XLD. Capped at 16-bit / 44,100 Hz.</p>
            <p><strong className="text-foreground">WEB Rip / WEB-DL:</strong> Digital tracks purchased or streamed from online platforms (Qobuz, Tidal, Beatport, Apple Music, Amazon Music, Bandcamp).</p>
            <p><strong className="text-foreground">Vinyl Rip:</strong> Analog vinyl records played on high-end turntables and recorded into high-definition digital audio converters (ADCs). Often recognizable by ultrasonic turntable cartridge harmonics above 20 kHz and subtle low-end rumble.</p>
            <p><strong className="text-foreground">Remaster:</strong> A new mastering release of an older recording where EQ, compression, tape hiss reduction, and stereo imaging have been re-engineered for modern audio equipment.</p>
            <p><strong className="text-foreground">Transcode / Fake Lossless:</strong> The deceptive practice of taking a low-quality lossy file (like a 128 kbps MP3) and re-saving it as a FLAC or 320 kbps MP3. The file size inflates, but stripped audio frequencies are never restored.</p>
          </div>
        </details>

        {/* Accordion 6: Bitrates & Sample Rates */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <Activity className="size-5 text-cyan-500 shrink-0" />
              <span>Guide: Bitrates, Sample Rates, Bit Depth & The Nyquist Limit Explained</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
            <p><strong className="text-foreground">Sample Rate (Hz / kHz):</strong> How many times per second the analog waveform is measured digitally.</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong className="text-foreground">44.1 kHz (44,100 Hz):</strong> Standard CD quality. Reproduces all frequencies audible to human ears (up to 20 kHz).</li>
              <li><strong className="text-foreground">48.0 kHz:</strong> Standard sample rate for film, television, DVD, and video game sound.</li>
              <li><strong className="text-foreground">88.2 kHz / 96 kHz / 192 kHz:</strong> High-resolution audiophile formats capable of recording ultrasonic frequencies up to 48 kHz or 96 kHz.</li>
            </ul>
            <p><strong className="text-foreground">Bit Depth (16-bit vs 24-bit vs 32-bit float):</strong> Determines volume precision and dynamic range.</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong className="text-foreground">16-bit:</strong> Standard CD depth, providing 96 dB of dynamic range from silence to maximum volume.</li>
              <li><strong className="text-foreground">24-bit:</strong> Studio mastering standard, providing an immense 144 dB of dynamic range with a microscopic noise floor.</li>
            </ul>
            <p><strong className="text-foreground">The Nyquist Limit:</strong> A fundamental law of digital audio stating that the highest audio frequency a digital file can record is exactly <strong className="text-foreground">half of its sample rate</strong>. For example, a 44.1 kHz CD can record frequencies up to exactly 22,050 Hz.</p>
          </div>
        </details>

        {/* Accordion 7: Dynamic Range & Loudness War */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-rose-500 shrink-0" />
              <span>Guide: Dynamic Range (DR), Brickwalling, Clipping & Dither</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
            <p><strong className="text-foreground">Dynamic Range (DR):</strong> The decibel difference between quietest instrumental passages and loudest transient peaks (like snare hits or vocal crescendos). High dynamic range recordings sound punchy, deep, and natural.</p>
            <p><strong className="text-foreground">Brickwalling & The Loudness War:</strong> A controversial mastering practice where engineers apply heavy peak limiting to make a song sound as loud as possible on radio and phone speakers. This crushes dynamic range and makes the waveform look like a solid rectangular block.</p>
            <p><strong className="text-foreground">Digital Clipping:</strong> Distortion that occurs when an audio signal is boosted past the maximum digital ceiling of 0 dBFS (Full Scale), slicing off rounded tops of sound waves and creating harsh static buzzing.</p>
            <p><strong className="text-foreground">Dither:</strong> Extremely low-level acoustic random noise intentionally introduced by mastering engineers when converting a 24-bit studio recording down to 16-bit for CD release. This noise prevents harsh digital quantization distortion and preserves low-volume reverb tails.</p>
          </div>
        </details>

        {/* Accordion 8: FAQ - How can I tell if an MP3 is 320 kbps? */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <HelpCircle className="size-5 text-primary shrink-0" />
              <span>FAQ: How can I tell if an MP3 is really 320 kbps?</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 text-sm text-muted-foreground leading-relaxed mt-2">
            Look at where the high frequencies stop on the spectrogram. A genuine 320 kbps encode keeps content up to about 20.0–20.5 kHz, while files upconverted from 128 kbps stop near 16 kHz no matter what the file tag claims.
          </div>
        </details>

        {/* Accordion 9: FAQ - Why does my FLAC cut off at 19 kHz? */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <HelpCircle className="size-5 text-primary shrink-0" />
              <span>FAQ: Why does my FLAC cut off at 19 kHz?</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 text-sm text-muted-foreground leading-relaxed mt-2">
            A hard horizontal cutoff below 20 kHz in a lossless file usually means it was converted from a lossy source such as a 256 kbps MP3 or AAC. The container is lossless (.flac), but the missing high frequencies were discarded by the earlier lossy compression and are gone for good.
          </div>
        </details>

        {/* Accordion 10: FAQ - Why do acoustic tracks look darker at the top? */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <HelpCircle className="size-5 text-primary shrink-0" />
              <span>FAQ: Why do some acoustic or vocal FLAC tracks look darker at the top than EDM tracks?</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 text-sm text-muted-foreground leading-relaxed mt-2">
            Different instruments generate different harmonic overtones. EDM, rock, and synth tracks use heavy limiting, synthesized white noise, and crash cymbals that pack intense energy up to 24 kHz. In contrast, gentle acoustic guitars, solo piano, and female vocal ballads naturally produce fewer overtones above 16 kHz. As long as there is no sharp, horizontal brickwall line across the entire track, a quieter top end simply reflects the natural acoustics of the recording.
          </div>
        </details>

        {/* Accordion 11: FAQ - Is this a replacement for Spek? */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <HelpCircle className="size-5 text-primary shrink-0" />
              <span>FAQ: Is this a browser replacement for desktop Spek or Adobe Audition?</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="p-4 sm:p-5 pt-0 border-t bg-card/90 text-sm text-muted-foreground leading-relaxed mt-2">
            Yes! It covers the exact same forensic verification workflow directly in your browser: a full-track spectrogram with custom dB color palettes plus an automatic cutoff read-out and dynamic range audit, with zero installation and no file uploads — your music is analyzed 100% locally on your machine.
          </div>
        </details>
      </div>

      <Card className="border-primary/30 bg-primary/5 mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-primary">Explore More Categories</CardTitle>
          <CardDescription className="text-sm">
            Discover our full suite of online developer tools, calculators, and everyday utilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/categories/developer" className="underline underline-offset-4 hover:text-primary">
            Developer Tools
          </Link>
          <Link href="/categories/calculators" className="underline underline-offset-4 hover:text-primary">
            Calculators
          </Link>
          <Link href="/categories/everyday" className="underline underline-offset-4 hover:text-primary">
            Everyday Utilities
          </Link>
        </CardContent>
      </Card>
    </div>
  ),
};
