import { ToolEntry } from "@/tools/registry";
import { BmiCalculator } from "./index";

export const bmiCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Doctor-Oriented BMI Calculator",
    description: "Calculate BMI with WHO classifications, Ideal Body Weight (Devine), and medical insights.",
    category: "calculators",
    slug: "bmi-calculator",
    keywords: ["bmi calculator", "body mass index", "ideal body weight", "ibw calculator", "medical bmi", "who guidelines"],
  },
  component: BmiCalculator,
  content: () => (
    <>
      <h2>Clinical BMI & IBW Assessment</h2>
      <p>
        This calculator provides Body Mass Index (BMI) computations along with clinical classifications 
        based on the World Health Organization (WHO) guidelines. It also estimates Ideal Body Weight (IBW) 
        using the Devine formula, which is commonly used in clinical practice for medication dosing 
        (such as aminoglycosides and certain anesthetics).
      </p>
      
      <h3>Interpretation of BMI</h3>
      <ul>
        <li><strong>Underweight:</strong> &lt; 18.5 (May indicate malnutrition, eating disorders, or other health issues)</li>
        <li><strong>Normal Weight:</strong> 18.5 - 24.9 (Associated with the lowest risk of comorbidities)</li>
        <li><strong>Overweight:</strong> 25 - 29.9 (Increased risk for cardiovascular disease, Type 2 diabetes)</li>
        <li><strong>Obese (Class I):</strong> 30 - 34.9</li>
        <li><strong>Obese (Class II):</strong> 35 - 39.9</li>
        <li><strong>Obese (Class III):</strong> &ge; 40 (Severe/Morbid obesity, very high risk of comorbidities)</li>
      </ul>

      <h3>Limitations</h3>
      <p>
        While BMI is a useful population-level screening tool, it has limitations at the individual level. 
        It does not differentiate between fat mass and lean muscle mass, nor does it account for fat distribution 
        (e.g., visceral adiposity). Clinical judgment should always supplement BMI calculations, and 
        measurements like waist circumference may provide a more accurate risk assessment.
      </p>
    </>
  ),
};
