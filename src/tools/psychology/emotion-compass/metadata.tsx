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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold mb-4">Understanding Your Emotions: A Guide to the Feelings Wheel</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Take a moment to connect with yourself and find calm by exploring the interactive Feelings Wheel, also known as the Emotion Wheel.
          It&apos;s a simple yet powerful mental health tool designed to help you identify and understand your emotions better.
        </p>
      </div>

      <hr className="my-8" />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h3>The Feelings Wheel Explained</h3>
          <p>
            Emotions are powerful forces that shape our lives. But sometimes, pinpointing exactly how we feel can be tricky. 
            The Feelings Wheel is designed to help you navigate the complex world of emotions and gain a deeper understanding of yourself.
          </p>
          <p>
            The Feelings Wheel is a powerful visual tool shaped like a wheel, typically divided into several sections to help you better identify and understand your emotions. 
            It categorizes emotions into different levels, starting with core emotions at the center and branching out to more nuanced feelings on the periphery. 
            This progression helps explore the full spectrum of emotions, going beyond basic feelings to uncover more nuanced states.
          </p>
        </div>
        <div>
          <h3>How Does the Feelings Wheel Work?</h3>
          <p>The Feelings Wheel typically works in three layers:</p>
          <ul>
            <li><strong>Center:</strong> This core layer contains the basic emotions: happiness, sadness, anger, fear, surprise, disgust and bad. These are considered fundamental building blocks of our emotional experience.</li>
            <li><strong>Middle Layer:</strong> Expanding on the core emotions, this section offers more specific terms that branch out from each core emotion. For example, sadness might be further defined as loneliness, vulnerability, or despair.</li>
            <li><strong>Outer Layer:</strong> The outermost layer contains even more nuanced emotions, offering a rich vocabulary to describe subtle variations in how you feel. For instance, anger could be further categorized as resentment, fury, or indignation.</li>
          </ul>
        </div>
      </div>

      <div className="my-10 p-6 bg-primary/5 rounded-2xl border border-primary/10">
        <h3>Why the Feelings Wheel is Essential</h3>
        <ul className="space-y-3">
          <li><strong>Improved Emotional Awareness:</strong> Identifying your emotions with greater precision is the first step towards managing them effectively.</li>
          <li><strong>Better Communication:</strong> By having a wider vocabulary of emotions, you can communicate your feelings more clearly to others, fostering stronger relationships.</li>
          <li><strong>Emotional Regulation:</strong> Understanding your emotions allows you to manage them in healthy ways. The Feelings Wheel can help you identify triggers and develop coping mechanisms.</li>
          <li><strong>Increased Self-Compassion:</strong> Recognizing the full spectrum of your emotions, both positive and negative, can lead to greater self-acceptance.</li>
        </ul>
      </div>

      <hr className="my-8" />

      <div className="space-y-8">
        <h2 className="text-center">A Step-by-Step Tutorial</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4>Step One: Identify What You Are Really Feeling</h4>
            <p>
              Reduce the Emotional Intensity. Identify how you are feeling by beginning in the middle of the wheel and working your way to the edge. 
              Especially with negative emotions, by clearly identifying and articulating how you feel you can reduce the intensity of the experience.
              Expressing yourself with a deep emotional vocabulary helps to reengage your neocortex instead of being carried away by your emotions.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-xl text-sm border-l-4 border-l-primary">
              <strong>Amygdala Hijack</strong>
              <p className="mt-2 mb-0 text-muted-foreground">
                When your brain perceives it is under threat your amygdala reacts much faster than your rational, conscious mind.
                In what Daniel Goleman describes as an &quot;amygdala hijack&quot; you experience the classic &quot;freeze, flight, fight&quot; response and the chemical rush that follows is part of what we call emotions (Goleman, 1996).
                This heightened state of mind can be very useful if you are under an imminent physical threat but more likely it will make you less able to respond in a rational and considered way to relational challenges and complex problems.
              </p>
            </div>
          </div>

          <div>
            <h4>Step Two: Acknowledge and Appreciate</h4>
            <p>
              You never want to make your emotions wrong. The idea that anything you feel is &quot;wrong&quot; is a great way to destroy honest communication with yourself as well as with others.
              Be thankful that there&apos;s a part of your brain that is sending you a signal of support, a call to action to make a change in either your perception of some aspect of your life or in your actions.
            </p>

            <h4 className="mt-6">Step Three: Get Curious</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>What would I have to believe in order to feel the way I&apos;ve been feeling?</li>
              <li>What am I willing to do to create a solution and handle this right now?</li>
              <li>What do I really want to feel?</li>
              <li>What can I learn from this?</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="bg-card p-5 rounded-xl shadow-sm border border-border">
            <h4 className="text-primary mt-0">Step Four: Get Confident</h4>
            <p className="text-sm">
              Get confident that you can handle this emotion immediately. The quickest, simplest, and most powerful way I know to handle any emotion is to remember a time when you felt a similar emotion and realize that you&apos;ve successfully handled this emotion before.
            </p>
            <p className="text-xs italic text-muted-foreground">- Tony Robbins</p>
            <ul className="text-xs text-muted-foreground mt-3 space-y-1">
              <li>What strategies have I used in the past to deal with this emotion?</li>
              <li>Do I know someone who is great at dealing with this? What strategies do they use?</li>
            </ul>
          </div>

          <div className="bg-card p-5 rounded-xl shadow-sm border border-border">
            <h4 className="text-primary mt-0">Step Five: Get Certain</h4>
            <p className="text-sm">
              You want to feel certain that you can handle this emotion easily in the future by having a great plan to do so.
              One way to do this is to simply remember the ways you&apos;ve handled it in the past and rehearse handling situations where this emotion would come up in the future.
              See, hear, and feel yourself handling the situation easily.
            </p>
            <p className="text-xs italic text-muted-foreground">- Tony Robbins</p>
          </div>

          <div className="bg-card p-5 rounded-xl shadow-sm border border-border flex flex-col justify-between">
            <div>
              <h4 className="text-primary mt-0">Step Six: Take Action</h4>
              <p className="text-sm">
                Get excited, and take action! Now go and do something! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <hr className="my-10" />
    </>
  ),
};
