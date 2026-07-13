import { ToolEntry } from "@/tools/registry";
import { AgeCalculator } from "./index";

export const ageCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Age Calculator",
    description: "Calculate your exact age in years, months, and days from your date of birth.",
    category: "calculators",
    slug: "age-calculator",
    keywords: ["age calculator", "calculate age", "dob calculator", "age difference"],
  },
  component: AgeCalculator,
  content: () => (
    <>
      <h2>How to use the Age Calculator</h2>
      <p>
        Simply select your date of birth from the calendar input or type it in. Click the 
        <strong> Calculate Age</strong> button, and the tool will instantly show your exact 
        age down to the number of days.
      </p>
      <h3>How is age calculated?</h3>
      <p>
        The calculation is based on the difference between the current date (today) and the 
        selected date of birth. It accounts for leap years and different month lengths to 
        provide a precise result in years, months, and days.
      </p>
    </>
  ),
};
