import { ToolEntry } from "@/tools/registry";
import { BmiCalculator } from "./index";

export const bmiCalculatorEntry: ToolEntry = {
  metadata: {
    name: "Advanced Clinical BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) with WHO classifications, discover your Ideal Body Weight, and explore personalized clinical insights.",
    category: "calculators",
    slug: "bmi-calculator",
    keywords: ["bmi calculator", "body mass index", "ideal body weight", "ibw calculator", "medical bmi", "who guidelines", "healthy weight range"],
  },
  component: BmiCalculator,
  content: () => (
    <>
      <h2>Understanding Your BMI & Ideal Body Weight</h2>
      <p>
        This calculator provides Body Mass Index (BMI) computations along with clinical classifications 
        based on the World Health Organization (WHO) guidelines. It is designed for both personal health tracking and clinical use. It also estimates Ideal Body Weight (IBW) 
        using the Devine formula, which is commonly used in clinical practice for health assessment and medication dosing.
      </p>
      
      <h3>Interpretation of BMI</h3>
      <ul>
        <li><strong>Underweight (&lt; 18.5):</strong> May indicate malnutrition, eating disorders, or other health issues. Consulting a healthcare provider is recommended.</li>
        <li><strong>Normal Weight (18.5 - 24.9):</strong> Associated with the lowest risk of weight-related health issues.</li>
        <li><strong>Overweight (25 - 29.9):</strong> Indicates an increased risk for cardiovascular disease and metabolic conditions.</li>
        <li><strong>Obese Class I (30 - 34.9) & Class II (35 - 39.9):</strong> Higher risk for conditions like Type 2 diabetes and hypertension.</li>
        <li><strong>Obese Class III (&ge; 40):</strong> Severe obesity, posing a very high risk of comorbidities. Medical guidance is strongly advised.</li>
      </ul>

      <h3>Important Limitations</h3>
      <p>
        While BMI is a widely used and helpful screening tool, it has limitations. 
        It does not differentiate between fat mass and lean muscle mass. For example, highly muscular athletes may have a high BMI without having high body fat. 
        Furthermore, it does not account for fat distribution (like visceral fat). 
        BMI should be used as a starting point, and measurements like waist circumference or body fat percentage can provide a more complete picture of your metabolic health.
      </p>
    </>
  ),
};
