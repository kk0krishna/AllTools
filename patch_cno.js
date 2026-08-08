const fs = require('fs');

const updates = [
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\cardiology\\jones-criteria\\metadata.tsx',
    search: `    <>
      <h2>Jones Criteria</h2>
      <p>
        The Jones Criteria are used to diagnose Acute Rheumatic Fever (ARF), a delayed nonsuppurative 
        sequela of a pharyngeal infection with Group A Streptococcus.
      </p>
      <h3>Diagnosis Requirement</h3>
      <p>Initial diagnosis requires <strong>evidence of a preceding Group A strep infection</strong> PLUS:</p>
      <ul>
        <li>2 Major Criteria <em>OR</em></li>
        <li>1 Major Criterion + 2 Minor Criteria</li>
      </ul>
      <p>
        <em>Note: The criteria were updated by the AHA in 2015 to distinguish between low-risk and moderate/high-risk populations. This tool evaluates the general criteria.</em>
      </p>
    </>`,
    replace: `    <>
      <h2>Jones Criteria</h2>
      <p>
        The Jones Criteria are the gold standard for diagnosing Acute Rheumatic Fever (ARF), providing a structured evaluation of major and minor clinical manifestations.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Strep Validation is Mandatory:</strong> Laboratory evidence of an antecedent Group A Streptococcal (GAS) infection (e.g., positive throat culture, rapid strep test, or elevated antibody titers) is mandatory for diagnosis.</li>
        <li><strong>Infection Site:</strong> Only GAS infections of the upper respiratory tract can precipitate ARF. Cutaneous GAS infections (like impetigo) do not lead to ARF.</li>
        <li><strong>Age Considerations:</strong> Children under 3 years old rarely develop the autoimmune response necessary for ARF. In this age group, pursue other etiologies first.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Minor Criteria Trap:</strong> Do not diagnose an initial episode of ARF based exclusively on minor criteria.</li>
        <li><strong>Chorea &amp; Carditis:</strong> Isolated chorea, indolent carditis, or a recurrent history of ARF are highly suggestive. In these specific cases, ARF is the presumptive diagnosis even if all criteria are not strictly met.</li>
        <li><strong>Management:</strong> If ARF is diagnosed, perform a screening echocardiogram (even in the absence of a murmur) and begin appropriate antibiotic therapy (typically penicillin).</li>
      </ul>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\cardiology\\nyha-heart-failure\\metadata.tsx',
    search: `    <>
      <h2>NYHA Functional Classification</h2>
      <p>
        The New York Heart Association (NYHA) Functional Classification provides a simple way of 
        classifying the extent of heart failure. It places patients in one of four categories based on 
        how much they are limited during physical activity.
      </p>
      <h3>Classes</h3>
      <ul>
        <li><strong>Class I:</strong> No limitation of physical activity.</li>
        <li><strong>Class II:</strong> Slight limitation of physical activity. Comfortable at rest.</li>
        <li><strong>Class III:</strong> Marked limitation of physical activity. Comfortable at rest.</li>
        <li><strong>Class IV:</strong> Unable to carry on any physical activity without discomfort. Symptoms of HF at rest.</li>
      </ul>
    </>`,
    replace: `    <>
      <h2>NYHA Functional Classification</h2>
      <p>
        The NYHA Functional Classification is a widely utilized system to categorize the severity of heart failure based on a patient's physical limitations and symptom burden.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Subjective Nature:</strong> This classification was developed by consensus rather than derivation. It is inherently subjective, and studies show it has poor interobserver agreement (around 54%).</li>
        <li><strong>Prognostic Value:</strong> Despite its subjectivity, higher NYHA classes strongly correlate with higher rates of cardiovascular events and hospitalizations.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Clinical Context:</strong> The AHA/ACC guidelines recommend using the NYHA class to characterize symptom burden in Stage C and D heart failure. However, it should never be the sole metric for clinical decision-making.</li>
        <li><strong>Objective Correlation:</strong> Always interpret a patient's NYHA class alongside objective clinical data (e.g., LVEF via echocardiogram, BNP levels, and 6-minute walk test results).</li>
      </ul>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\neurology\\glasgow-coma-scale\\metadata.tsx',
    search: `    <>
      <h2>About the GCS</h2>
      <p>
        The Glasgow Coma Scale (GCS) provides a practical method for assessment of impairment of conscious 
        level in response to defined stimuli. It is used universally to objectively describe the extent 
        of impaired consciousness in all types of acute medical and trauma patients.
      </p>
      <h3>Components</h3>
      <ul>
        <li><strong>Eye Opening (E):</strong> 1 to 4</li>
        <li><strong>Verbal Response (V):</strong> 1 to 5</li>
        <li><strong>Motor Response (M):</strong> 1 to 6</li>
      </ul>
      <p>
        The lowest possible GCS is 3 (deep coma or death), while the highest is 15 (fully awake).
      </p>
    </>`,
    replace: `    <>
      <h2>About the GCS</h2>
      <p>
        The Glasgow Coma Scale (GCS) is the universal standard for objectively assessing and describing the level of consciousness in acute medical and trauma patients.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Motor Score Dominance:</strong> The Motor component (M) is the most predictive individual factor for patient outcome. In intubated patients where verbal response cannot be assessed, the motor score provides the best indication of neurologic status.</li>
        <li><strong>Confounders:</strong> Always account for confounding variables such as intoxication, sedation, paralytics, and severe facial trauma that may artificially lower the score.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Intubation Threshold:</strong> The classic axiom "GCS less than 8, intubate" serves as a clinical heuristic for airway protection, though clinical judgment regarding airway reflexes always supersedes the raw number.</li>
        <li><strong>Serial Monitoring:</strong> A single GCS score is less valuable than the trend. A drop of 2 or more points is considered a significant neurologic decline warranting immediate reassessment or imaging (e.g., Stat CT Head).</li>
      </ul>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\oncology\\gleason-score\\metadata.tsx',
    search: `    <>
      <h2>Understanding the Gleason Score</h2>
      <p>
        The Gleason scoring system is used to evaluate the prognosis of men with prostate cancer 
        using samples from a prostate biopsy. It relies on the architectural pattern of the tumor.
      </p>
      <h3>How it works</h3>
      <p>
        The pathologist assigns a grade from 1 to 5 to the most common tumor pattern (Primary) 
        and the second most common pattern (Secondary). These are summed to yield the total Gleason Score (ranging from 6 to 10 in modern practice).
      </p>
      <p>
        The International Society of Urological Pathology (ISUP) introduced <strong>Grade Groups (1-5)</strong> 
        to provide a simpler and more accurate prognostic classification.
      </p>
    </>`,
    replace: `    <>
      <h2>Understanding the Gleason Score</h2>
      <p>
        The Gleason scoring system evaluates the architectural pattern of prostate cancer tissue from a biopsy to determine histologic grade and prognosis.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Sum of Patterns:</strong> The score is the sum of the primary (most prevalent) and secondary (second most prevalent) tumor patterns. In modern practice, patterns 1 and 2 are rarely assigned, meaning total scores effectively range from 6 to 10.</li>
        <li><strong>ISUP Grade Groups:</strong> Because a Gleason 6 represents the lowest grade of prostate cancer (with excellent prognosis), the International Society of Urological Pathology (ISUP) introduced Grade Groups (1-5). A Gleason 3+3=6 is Grade Group 1, helping to reduce patient anxiety regarding the "6" out of 10 score.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Risk Stratification:</strong> The Gleason Score, combined with PSA levels and clinical staging (TNM), drives treatment decisions—ranging from active surveillance for low-risk disease to radical prostatectomy or radiation for higher-risk groups.</li>
        <li><strong>Order Matters:</strong> A Gleason score of 4+3=7 represents a more aggressive tumor than a 3+4=7 because the more aggressive pattern (4) is primary.</li>
      </ul>
    </>`
  }
];

updates.forEach(({file, search, replace}) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  } else {
    console.log('Search string not found in ' + file);
  }
});
