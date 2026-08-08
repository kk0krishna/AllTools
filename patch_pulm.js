const fs = require('fs');

const updates = [
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\pulmonology\\abg-analyzer\\metadata.tsx',
    search: `    <>
      <h2>Arterial Blood Gas (ABG) Interpretation</h2>
      <p>
        The ABG Analyzer uses a systematic approach to diagnose primary acid-base disorders 
        (acidosis or alkalosis, respiratory or metabolic) and evaluates whether appropriate 
        respiratory or metabolic compensation has occurred.
      </p>
      <h3>Interpretation Steps</h3>
      <ol>
        <li><strong>Assess pH:</strong> Determines primary acidemia (&lt; 7.35) or alkalemia (&gt; 7.45).</li>
        <li><strong>Evaluate PaCO2 and HCO3:</strong> Identifies which parameter aligns with the pH shift to determine the primary disorder.</li>
        <li><strong>Calculate Compensation:</strong> Uses formulas (like Winter's formula for metabolic acidosis) to check if the secondary parameter has changed adequately to compensate.</li>
      </ol>
      <p>
        <em>Note: This tool provides educational guidance. Clinical correlation is always required.</em>
      </p>
    </>`,
    replace: `    <>
      <h2>Arterial Blood Gas (ABG) Interpretation</h2>
      <p>
        ABG analysis provides critical insights into a patient's acid-base balance and oxygenation status. It is essential for evaluating complex respiratory, metabolic, and circulatory conditions.
      </p>
      
      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Context is Key:</strong> Always interpret results alongside the patient's clinical history. Laboratory values alone cannot diagnose the underlying etiology.</li>
        <li><strong>Determine Chronicity:</strong> For respiratory acid-base disorders, calculating compensation helps differentiate between acute and chronic processes.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Sampling Technique:</strong> Ensure true arterial sampling. Venous samples, air bubbles, or processing delays can falsely alter PaO2 and PaCO2.</li>
        <li><strong>Correlation:</strong> Consider checking a venous blood gas (VBG) for comparison; the pH and PaCO2 should closely correlate.</li>
        <li><strong>Repeat Testing:</strong> If calculated results conflict with the clinical picture, repeat the test to rule out pre-analytical errors.</li>
      </ul>
      <p>
        <em>Note: This tool provides educational guidance. Clinical correlation is always required.</em>
      </p>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\pulmonology\\lights-criteria\\metadata.tsx',
    search: `    <>
      <h2>Understanding Light's Criteria</h2>
      <p>
        Light's Criteria is a highly sensitive rule used to determine whether a pleural effusion is 
        an exudate (fluid leakage due to inflammation, infection, or malignancy) or a transudate 
        (fluid accumulation due to systemic factors like heart failure or cirrhosis).
      </p>
      <h3>The Criteria</h3>
      <p>An effusion is considered <strong>exudative</strong> if <em>at least one</em> of the following is true:</p>
      <ul>
        <li>Pleural Fluid Protein / Serum Protein ratio is <strong>&gt; 0.5</strong></li>
        <li>Pleural Fluid LDH / Serum LDH ratio is <strong>&gt; 0.6</strong></li>
        <li>Pleural Fluid LDH is <strong>&gt; 2/3</strong> the upper limit of normal for serum LDH</li>
      </ul>
    </>`,
    replace: `    <>
      <h2>Understanding Light's Criteria</h2>
      <p>
        Light's Criteria is used to accurately distinguish between exudative and transudative pleural effusions, guiding further diagnostic workup and treatment.
      </p>
      
      <h3>The Criteria</h3>
      <p>An effusion is considered <strong>exudative</strong> if <em>at least one</em> of the following is met:</p>
      <ul>
        <li>Pleural Fluid Protein / Serum Protein &gt; 0.5</li>
        <li>Pleural Fluid LDH / Serum LDH &gt; 0.6</li>
        <li>Pleural Fluid LDH &gt; 2/3 the upper limit of normal for serum LDH</li>
      </ul>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>High Sensitivity:</strong> Light's criteria are highly sensitive (up to 98%) for identifying exudates, meaning it rarely misses one. However, specificity is lower (~83%), so it may misclassify a transudate as an exudate (especially in patients taking diuretics).</li>
        <li><strong>Exudative Etiologies:</strong> Common causes include malignancy, infection (pneumonia, TB), pulmonary embolism, and inflammatory conditions.</li>
        <li><strong>Transudative Etiologies:</strong> Typically caused by systemic imbalances in hydrostatic or oncotic pressures (e.g., heart failure, cirrhosis, nephrotic syndrome).</li>
      </ul>

      <h3>Next Steps</h3>
      <ul>
        <li><strong>Diagnostic Workup:</strong> Exudative effusions usually require further investigation (cytology, culture, biopsy) to determine the exact cause, whereas transudative effusions often resolve by treating the underlying systemic condition.</li>
      </ul>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\pulmonology\\mmrc-dyspnea-scale\\metadata.tsx',
    search: `    <>
      <h2>About the mMRC Scale</h2>
      <p>
        The Modified Medical Research Council (mMRC) Dyspnea Scale is a simple grading system used to 
        quantify the disability associated with breathlessness. It is widely utilized in the assessment 
        of patients with COPD (Chronic Obstructive Pulmonary Disease) and is a key component of the GOLD criteria.
      </p>
      <h3>Clinical Utility</h3>
      <ul>
        <li><strong>Grades 0-1:</strong> Indicate less symptoms (lower risk category in GOLD).</li>
        <li><strong>Grades 2-4:</strong> Indicate more symptoms, significantly impacting daily living (higher risk category).</li>
      </ul>
    </>`,
    replace: `    <>
      <h2>About the mMRC Scale</h2>
      <p>
        The Modified Medical Research Council (mMRC) Dyspnea Scale is a validated, easy-to-use grading system that quantifies a patient's baseline disability attributable to breathlessness.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Baseline Assessment:</strong> The scale is excellent for capturing a patient's baseline functional impairment due to dyspnea, but it is less effective for measuring small, short-term responses to medical treatment.</li>
        <li><strong>Correlation:</strong> It correlates moderately well with healthcare-associated quality of life, morbidity, and mortality (especially in COPD), but does not consistently correlate with spirometric values (like FEV1).</li>
        <li><strong>Component Use:</strong> It is frequently used alongside other assessments. For example, it is a key variable in the BODE Index and is incorporated into the GOLD treatment guidelines for COPD.</li>
      </ul>

      <h3>Next Steps</h3>
      <ul>
        <li><strong>Contextualize:</strong> An mMRC grade of 2 or higher suggests significant impairment. In these patients, consider spirometry, determining their GOLD stage, and calculating their BODE Index.</li>
        <li><strong>Management:</strong> While the mMRC scale alone does not dictate specific medical interventions, GOLD guidelines combine the mMRC score with exacerbation history and spirometry to guide long-term COPD management strategies.</li>
      </ul>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\pulmonology\\pack-years-calculator\\metadata.tsx',
    search: `    <>
      <h2>Understanding Pack Years</h2>
      <p>
        A "pack year" is a clinical way to measure a person's cumulative exposure to tobacco smoke. 
        It is used to assess their risk of developing lung cancer or other tobacco-related pathologies 
        like Chronic Obstructive Pulmonary Disease (COPD).
      </p>
      <h3>Formula</h3>
      <p>
        <strong>Pack Years</strong> = (Number of cigarettes smoked per day &divide; 20) &times; Number of years smoked
      </p>
      <p>
        <em>Note: One standard pack contains 20 cigarettes.</em>
      </p>
    </>`,
    replace: `    <>
      <h2>Understanding Pack Years</h2>
      <p>
        A "pack year" is the standard clinical metric used to quantify a patient's cumulative lifetime exposure to tobacco smoke. It is a critical predictor for lung disease and malignancy risk.
      </p>
      
      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Standard Metric:</strong> This calculation is universally used to document smoking history and assess risk. 1 pack is equivalent to 20 cigarettes.</li>
        <li><strong>Prognostic Value:</strong> Higher pack years correlate strongly with adverse outcomes. In patients diagnosed with advanced non-small cell lung cancer, those with a &gt;15 pack-year history have significantly worse survival rates than those with fewer pack years.</li>
      </ul>

      <h3>Next Steps &amp; Guidelines</h3>
      <ul>
        <li><strong>Screening Recommendations:</strong> Current guidelines (USPSTF, AAFP) strongly recommend annual low-dose CT lung cancer screening for adults aged 50-80 who have at least a 20 pack-year smoking history and currently smoke or have quit within the past 15 years.</li>
        <li><strong>Counseling:</strong> A high pack-year history should immediately trigger robust smoking cessation counseling and intervention.</li>
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
