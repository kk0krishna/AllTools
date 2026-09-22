import React from "react";
import { ToolEntry } from "@/tools/registry";
import { EmotionCompassTool } from ".";
import { Button } from "@/components/ui/button";

export const emotionCompassEntry: ToolEntry = {
  metadata: {
    name: "Feelings Wheel",
    description: "Navigate your feelings with an interactive emotion wheel. Identify what you are really feeling and connect with yourself.",
    category: "psychology",
    slug: "emotion-compass",
    keywords: [
      "feelings wheel", "emotion compass", "emotion wheel", "plutchik", "gloria willcox",
      "mental health", "mood tracker", "emotional intelligence", "self-awareness",
      "feelings", "emotions", "psychology tool", "amygdala hijack"
    ],
    hideHeader: true,
  },
  component: EmotionCompassTool,
  content: () => (
    <>
      <div className="text-center mb-10 no-print">
        <h2 className="text-3xl font-extrabold mb-4">Navigating Your Inner World: The Interactive Emotion Compass</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Pause and tune into your emotional landscape using our dynamic Emotion Compass. This visual guide is crafted to help you name, process, and ultimately understand what you&apos;re truly experiencing at any given moment.
        </p>
      </div>

      <hr className="my-8 no-print" />

      <div className="grid md:grid-cols-2 gap-8 items-start no-print">
        <div>
          <h3>Demystifying the Emotion Compass</h3>
          <p>
            Our feelings dictate much of how we experience life, yet identifying them can often feel overwhelming. This compass serves as a map for your internal world, helping you trace vague sensations back to their roots.
          </p>
          <p>
            Structured like a color-coded wheel, it categorizes feelings into layers. You start with broad, primary emotions at the center and work your way outward to discover more specific, nuanced emotional states.
          </p>
        </div>
        <div>
          <h3>How to Use This Tool</h3>
          <p>The compass is divided into three distinct layers:</p>
          <ul>
            <li><strong>The Core:</strong> The innermost circle holds your primary emotions—like joy, sadness, anger, fear, and disgust. These are the fundamental foundations of how we feel.</li>
            <li><strong>The Middle Ring:</strong> Moving outward, you&apos;ll find more defined feelings that stem from the core. For example, sadness branches out into feelings like loneliness or vulnerability.</li>
            <li><strong>The Outer Edge:</strong> The final layer provides a highly specific emotional vocabulary. It allows you to pinpoint exactly what you&apos;re experiencing, turning a general feeling of &apos;anger&apos; into &apos;resentment&apos; or &apos;indignation&apos;.</li>
          </ul>
        </div>
      </div>

      <div className="my-10 p-6 bg-primary/5 rounded-2xl border border-primary/10 no-print">
        <h3>The Benefits of Emotional Mapping</h3>
        <ul className="space-y-3">
          <li><strong>Enhanced Clarity:</strong> Naming an emotion accurately is the first critical step toward processing it effectively.</li>
          <li><strong>Stronger Connections:</strong> With a richer emotional vocabulary, you can express your needs to others much more clearly, building healthier relationships.</li>
          <li><strong>Self-Regulation:</strong> Recognizing your feelings in real-time helps you manage your reactions and build constructive coping strategies.</li>
          <li><strong>Deepened Empathy:</strong> Acknowledging your entire spectrum of feelings fosters a kinder, more accepting relationship with yourself.</li>
        </ul>
      </div>

      <hr className="my-8 no-print" />

      <div className="space-y-8 no-print">
        <h2 className="text-center">A Practical Guide to Processing Emotions</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4>Step 1: Name the Feeling</h4>
            <p>
              Start from the center and move outward to find the exact word for your current state. Simply putting a name to a feeling can immediately lessen its overwhelming grip on your mind, bringing your rational brain back online.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-xl text-sm border-l-4 border-l-primary">
              <strong>The Brain&apos;s Alarm System</strong>
              <p className="mt-2 mb-0 text-muted-foreground">
                When threatened, your brain&apos;s emotional center (the amygdala) reacts faster than your logical mind, triggering a sudden &apos;fight, flight, or freeze&apos; response. Actively naming your feelings helps bypass this alarm, re-engaging your logical thought processes so you can respond calmly to complex challenges.
              </p>
            </div>
          </div>

          <div>
            <h4>Step 2: Accept Without Judgment</h4>
            <p>
              There are no &quot;wrong&quot; feelings. Every emotion is simply data—a signal from your brain alerting you that something in your environment or perception needs attention. Welcome them as helpful messengers rather than trying to suppress them.
            </p>

            <h4 className="mt-6">Step 3: Ask the Right Questions</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>What underlying belief is triggering this feeling?</li>
              <li>What steps can I take right now to address this?</li>
              <li>How do I actually want to feel instead?</li>
              <li>What lesson is this emotion trying to teach me?</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="bg-card p-5 rounded-xl shadow-sm border border-border">
            <h4 className="text-primary mt-0">Step 4: Draw on Past Resilience</h4>
            <p className="text-sm">
              Remind yourself of previous times you successfully navigated similar feelings. You have a track record of surviving difficult emotions. What coping strategies worked for you back then? Lean on your own history of resilience.
            </p>
          </div>

          <div className="bg-card p-5 rounded-xl shadow-sm border border-border">
            <h4 className="text-primary mt-0">Step 5: Prepare for the Future</h4>
            <p className="text-sm">
              Create a mental toolkit. Visualize yourself handling this emotion gracefully the next time it arises. Rehearsing your response builds confidence, ensuring you won&apos;t be caught off guard when these feelings inevitably return.
            </p>
          </div>

          <div className="bg-card p-5 rounded-xl shadow-sm border border-border flex flex-col justify-between">
            <div>
              <h4 className="text-primary mt-0">Step 6: Move Forward</h4>
              <p className="text-sm">
                With clarity and a plan in place, channel your energy into positive action. Take the next right step and let your emotions propel you forward! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <hr className="my-10 no-print" />

      <div className="flex justify-center mb-10 no-print">
        <Button asChild size="lg" className="rounded-full shadow-md font-semibold px-8 hover:scale-105 transition-transform">
          <a href="#emotion-wheel">↑ Go Back to Interactive Compass</a>
        </Button>
      </div>
    </>
  ),
};
