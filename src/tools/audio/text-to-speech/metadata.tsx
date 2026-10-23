import { ToolEntry } from "@/tools/registry";
import { TextToSpeechStudio } from "./index";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Headphones,
  FileAudio,
  Zap,
  Mic,
  Sliders,
  Sparkles,
} from "lucide-react";

export const textToSpeechEntry: ToolEntry = {
  metadata: {
    name: "Instant Text to Natural Voice & Audio Studio",
    description:
      "Transform written text into ultra-natural, lifelike human speech instantly. Preview with real-time waveform visualization, customize voice speed, pitch & accents, and record or download high-fidelity audio files directly in your browser.",
    category: "audio",
    slug: "text-to-speech",
    keywords: [
      "text to speech online",
      "natural voice generator",
      "instant tts to audio file",
      "convert text to voice mp3",
      "natural human voice generator",
      "free text to speech download",
      "browser text to speech studio",
      "voiceover generator online",
      "audiobook voice generator",
      "speech synthesis audio exporter",
      "microsoft natural voice online",
      "google neural text to speech",
      "download voice audio wav",
      "export speech to webm audio",
      "text to voice without sign up",
      "free tts audio recorder",
      "podcast voice generator",
      "youtube narration generator",
      "ai voice generator free online",
      "100 percent local text to speech",
    ],
  },
  component: TextToSpeechStudio,
  content: () => (
    <div className="space-y-8 pt-8 border-t border-border/40">
      {/* Knowledge Base Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading flex items-center gap-2.5">
          <BookOpen className="size-6 text-primary" />
          <span>Speech Synthesis & Audio Generation Guide</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Master natural voice synthesis, understand acoustic modulation, and discover how to capture studio-grade audio files directly from your browser without third-party subscriptions.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {/* Accordion 1: Natural Neural Voices vs Standard Formant Synthesis */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <Sparkles className="size-5 text-primary shrink-0" />
              <span>What Makes Neural & Natural Voices Sound Human?</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-3 leading-relaxed border-t border-border/20">
            <p>
              Traditional speech synthesizers (formant synthesis) combine mathematical sine waves and noise bands to simulate vocal cords and mouth resonances. While lightweight, they often sound robotic or metallic.
            </p>
            <p>
              <strong>Neural and Natural Voices</strong> (such as Microsoft's Jenny, Guy, and Aria, or Google's Neural TTS) use deep neural networks trained on hundreds of hours of high-definition human studio recordings. They accurately simulate human breath cadences, micro-inflections, emotional tone, and contextual rhythm.
            </p>
            <p className="text-xs bg-muted/40 p-3 rounded-xl border border-border/40">
              💡 <strong>Pro Tip:</strong> On Windows 10/11 and Microsoft Edge, you gain automatic access to over 400+ Microsoft Online Natural voices for free, offering voice actor quality without any monthly subscription.
            </p>
          </div>
        </details>

        {/* Accordion 2: How to Export Speech to Audio Files */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <FileAudio className="size-5 text-emerald-500 shrink-0" />
              <span>How Audio File Generation Works (WAV vs WebM vs MP3)</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-3 leading-relaxed border-t border-border/20">
            <p>
              Our studio provides two distinct export workflows depending on your requirements:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Studio Voice Recording (WebM / Opus at 48 kHz):</strong> By capturing your browser tab's audio output directly through modern HTML5 MediaRecorder APIs, you record the actual neural voice actor with zero compression artifacts. The resulting audio file can be dropped straight into Premiere Pro, DaVinci Resolve, Audacity, or Final Cut.
              </li>
              <li>
                <strong>Instant Offline Synthesizer (16-bit 44.1 kHz PCM WAV):</strong> Uses the client-side Web Audio API to directly assemble a standard RIFF WAV file in memory. Because it requires zero screen-capture permissions, you can download audio files with a single click even on restricted devices.
              </li>
            </ul>
          </div>
        </details>

        {/* Accordion 3: Voiceover Best Practices */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <Sliders className="size-5 text-indigo-500 shrink-0" />
              <span>Pacing, Pitch & Punctuation Tips for Voiceovers</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-3 leading-relaxed border-t border-border/20">
            <p>
              Modern speech synthesis models are highly sensitive to punctuation:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Commas (`,`)</strong> insert a short ~150ms natural breathing pause.
              </li>
              <li>
                <strong>Periods (`.`) and Semicolons (`;`)</strong> create a full ~300ms sentence boundary.
              </li>
              <li>
                <strong>Ellipses (`...`)</strong> trigger contemplative, slowed cadence—ideal for mindfulness scripts and dramatic storytelling.
              </li>
              <li>
                <strong>Exclamations (`!`) and Question marks (`?`)</strong> adjust pitch inflection upwards at the end of clauses.
              </li>
            </ul>
          </div>
        </details>

        {/* Accordion 4: Privacy & Client-Side Architecture */}
        <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300 shadow-xs">
          <summary className="cursor-pointer p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-base text-foreground hover:bg-muted/40 transition-colors list-none select-none">
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <span>100% Privacy-First Architecture (Zero Data Retention)</span>
            </span>
            <ChevronDown className="size-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300 shrink-0 ml-2" />
          </summary>
          <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-3 leading-relaxed border-t border-border/20">
            <p>
              Unlike commercial TTS platforms that transmit your sensitive scripts, personal notes, or company documents to third-party databases, Clinikkit processes synthesis 100% locally inside your web browser.
            </p>
            <p>
              Your text is never logged, stored, or sold. Generated audio files reside strictly in temporary browser memory (`Blob URL`) until you download them to your device.
            </p>
          </div>
        </details>
      </div>
    </div>
  ),
};
