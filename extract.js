const fs = require('fs');
const path = require('path');

const files = [
  'arterial-blood-gas-abg-analyzer.htm',
  'lights-criteria-exudative-effusions.htm',
  'mmrc-modified-medical-research-council-dyspnea-scale.htm',
  'pack-years-calculator.htm',
  'jones-criteria-acute-rheumatic-fever-diagnosis.htm',
  'new-york-heart-association-nyha-functional-classification-heart-failure.htm',
  'glasgow-coma-scale-score-gcs.htm',
  'gleason-score-prostate-cancer.htm',
  'immunization-schedule-calculator.htm',
  'color-vision-screening-ishihara-test.htm',
  'bishop-score-vaginal-delivery-induction-labor.htm'
];

const dir = 'C:\\Users\\krish\\web APP\\ToolVerse\\etc\\www.mdcalc.com\\calc';
const results = {};

for (const file of files) {
  try {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      const calc = data?.props?.pageProps?.calc;
      
      if (calc) {
        results[file] = {
          name: calc.full_title_en || file,
          about: calc.content?.about || '',
          how_to_use: calc.content?.how_to_use || '',
          next_steps: calc.content?.next_steps || '',
          equation_logic: calc.equation_logic || ''
        };
      }
    }
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
}

const outPath = 'C:\\Users\\krish\\web APP\\ToolVerse\\extracted.json';
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`Extraction complete. Saved to ${outPath}`);
