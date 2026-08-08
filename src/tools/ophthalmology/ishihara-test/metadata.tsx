import { ToolEntry } from "@/tools/registry";
import { IshiharaTest } from "./index";

export const ishiharaTestEntry: ToolEntry = {
  metadata: {
    name: "Ishihara Color Blindness Test",
    description: "Screen for red-green color deficiency.",
    category: "ophthalmology",
    slug: "ishihara-test",
    keywords: ["ishihara", "color blindness", "ophthalmology", "vision", "red-green deficiency"],
  },
  component: IshiharaTest,
  content: () => (
    <>
      <h2>Ishihara Color Vision Test</h2>
      <p>
        The Ishihara test utilizes pseudo-isochromatic plates to quickly and effectively screen patients for red-green color vision deficiencies (color blindness).
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>X-Linked Recessive:</strong> Red-green color blindness is predominantly an X-linked recessive trait, meaning it is significantly more common in males (up to 8%) than females (0.5%).</li>
        <li><strong>Acquired vs. Congenital:</strong> While typically congenital, acquired color vision defects can occur secondary to macular disease, optic neuritis, or medication toxicity (e.g., ethambutol). Acquired defects are often asymmetric and may lean towards blue-yellow deficiencies.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Screen Display Variability:</strong> The diagnostic validity of the Ishihara test relies on precise color calibration and natural lighting. Digital screens vary wildly in their RGB reproduction. Therefore, digital Ishihara tests are for screening only and cannot definitively diagnose or rule out color blindness.</li>
        <li><strong>Formal Testing:</strong> Patients failing the screen or requiring certification (e.g., pilots, electricians) must undergo formal testing with a printed Ishihara book or Farnsworth-Munsell hue test under standardized lighting conditions.</li>
      </ul>
    </>
  ),
};
