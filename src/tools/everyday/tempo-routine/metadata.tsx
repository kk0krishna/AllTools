import { ToolEntry } from "@/tools/registry";
import { TempoRoutine } from "./index";

export const tempoRoutineEntry: ToolEntry = {
  metadata: {
    name: "Tempo: Routine Engine",
    description: "A recurring routine engine to schedule and manage your repeating tasks without setting multiple alarms.",
    category: "everyday",
    slug: "tempo-routine",
    keywords: ["routine", "recurring alarm", "interval timer", "habit tracker", "tempo"],
  },
  component: TempoRoutine,
  content: () => (
    <>
      <h2>How to use Tempo Routine Engine</h2>
      <p>
        Tempo is designed to help you manage repetitive tasks (like drinking water, taking medicine, or stretching) 
        during a defined period, without the hassle of creating numerous individual alarms.
      </p>
      <h3>Features:</h3>
      <ul>
        <li><strong>One rule, automatic reminders:</strong> Set a task, interval, start and end times, and let Tempo handle the rest.</li>
        <li><strong>Smart Dashboard:</strong> Instantly see what's next and your progress for the day.</li>
        <li><strong>Actionable Alerts:</strong> Mark routines as done, snooze them, or skip directly.</li>
        <li><strong>Local & Private:</strong> All your routines are stored locally in your browser.</li>
      </ul>
    </>
  ),
};
