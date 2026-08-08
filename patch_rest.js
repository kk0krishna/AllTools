const fs = require('fs');

const updates = [
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\pediatrics\\immunization-schedule\\metadata.tsx',
    search: `    <>
      <h2>Childhood Immunization Schedule</h2>
      <p>
        This tool provides a simplified, quick-reference guide to the standard CDC childhood 
        immunization schedule (0 to 18 years). 
      </p>
      <h3>Disclaimer</h3>
      <p>
        This is a reference tool for the standard, healthy childhood schedule. It does not account for 
        catch-up schedules, specific high-risk conditions, or recent annual updates. Always refer to the 
        official CDC/ACIP guidelines for clinical decision-making.
      </p>
    </>`,
    replace: `    <>
      <h2>Childhood Immunization Schedule</h2>
      <p>
        The standard childhood immunization schedule is an evidence-based roadmap designed by the CDC and ACIP to protect infants and adolescents from preventable, life-threatening infectious diseases.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Herd Immunity:</strong> Consistent adherence to the schedule is crucial not only for individual protection but to maintain herd immunity for immunocompromised patients who cannot be vaccinated.</li>
        <li><strong>Simultaneous Administration:</strong> Most childhood vaccines can be safely administered at the same visit without decreasing efficacy or increasing adverse events.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Catch-up Schedules:</strong> If a child falls behind, refer to the CDC's dedicated catch-up schedule. Do not restart a vaccine series simply because the interval was prolonged.</li>
        <li><strong>Live Vaccines:</strong> Pay special attention to live-attenuated vaccines (e.g., MMR, Varicella, Rotavirus), which have specific contraindications (like severe immunodeficiency or pregnancy) and spacing requirements.</li>
      </ul>
      <p>
        <em>Note: Always refer to the most recent official CDC/ACIP guidelines for definitive clinical decision-making.</em>
      </p>
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\ophthalmology\\ishihara-test\\metadata.tsx',
    search: `    <>
      <h2>Ishihara Color Vision Test</h2>
      <p>
        The Ishihara test is a color perception test for red-green color deficiencies, the first in 
        a class of successful color vision tests called pseudo-isochromatic plates.
      </p>
      <h3>Important Note</h3>
      <p>
        Digital screens (monitors, phones) emit light in RGB and may not accurately reproduce the 
        exact color spectrum required for a diagnostic Ishihara test, which is intended to be viewed 
        on printed plates under natural lighting. This tool is for <strong>screening and educational purposes only</strong>.
      </p>
    </>`,
    replace: `    <>
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
    </>`
  },
  {
    file: 'C:\\Users\\krish\\web APP\\ToolVerse\\src\\tools\\obstetrics\\bishop-score\\metadata.tsx',
    search: `    <>
      <h2>About the Modified Bishop Score</h2>
      <p>
        The Bishop Score is a pre-labor scoring system to assist in predicting whether induction of 
        labor will be required or successful. The Modified Bishop Score evaluates five parameters of 
        the cervix on digital examination.
      </p>
      <h3>Parameters Evaluated</h3>
      <ul>
        <li><strong>Dilation:</strong> Opening of the cervix (cm).</li>
        <li><strong>Effacement:</strong> Thinning of the cervix (%).</li>
        <li><strong>Station:</strong> Position of the fetal head relative to the ischial spines.</li>
        <li><strong>Consistency:</strong> Feel of the cervix (firm, medium, soft).</li>
        <li><strong>Position:</strong> Alignment of the cervix with the fetal head (posterior, mid, anterior).</li>
      </ul>
      <p>
        A score of &ge; 8 indicates a favorable cervix (high likelihood of successful induction), 
        while a score &le; 6 typically warrants cervical ripening agents.
      </p>
    </>`,
    replace: `    <>
      <h2>About the Modified Bishop Score</h2>
      <p>
        The Modified Bishop Score is the standard obstetric metric used to objectively assess cervical favorability and predict the likelihood of a successful vaginal delivery following labor induction.
      </p>

      <h3>Clinical Pearls</h3>
      <ul>
        <li><strong>Score Interpretation:</strong> A score of &ge; 8 is considered "favorable," meaning the probability of vaginal delivery is comparable to that of spontaneous labor. A score of &le; 6 is "unfavorable."</li>
        <li><strong>Modifications:</strong> The classic Bishop Score used station relative to -3 to +3. The "Modified" version adjusts for cervical effacement measured in centimeters rather than percentages, though both are used clinically.</li>
      </ul>

      <h3>Next Steps &amp; Pitfalls</h3>
      <ul>
        <li><strong>Ripening Agents:</strong> If the cervix is unfavorable (Score &le; 6), cervical ripening agents (such as prostaglandins like Misoprostol or Dinoprostone, or mechanical methods like a Foley balloon) should be considered prior to initiating Pitocin (oxytocin).</li>
        <li><strong>Subjectivity:</strong> The exam relies on a digital cervical check, which can be highly subjective between different providers. Consistent documentation of all 5 parameters (Dilation, Effacement, Station, Consistency, Position) is vital for accurate hand-offs.</li>
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
