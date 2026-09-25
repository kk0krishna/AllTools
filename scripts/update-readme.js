const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/tools');
const readmePath = path.join(__dirname, '../README.md');
const files = [];

function getFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath);
    } else if (fullPath.endsWith('metadata.tsx') || fullPath.endsWith('metadata.ts')) {
      files.push(fullPath);
    }
  }
}

getFiles(toolsDir);

const tools = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const nameMatch = content.match(/name:\s*"(.*?)"/);
  const descMatch = content.match(/description:\s*"(.*?)"/);
  const slugMatch = content.match(/slug:\s*"(.*?)"/);
  const catMatch = content.match(/category:\s*"(.*?)"/);
  if (nameMatch && slugMatch && catMatch) {
    tools.push({
      name: nameMatch[1],
      desc: descMatch ? descMatch[1] : '',
      category: catMatch[1],
      slug: slugMatch[1]
    });
  }
});

tools.sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

let generatedList = '## 🧰 Available Tools\n\n';
let currentCat = '';
tools.forEach(t => {
  if(t.category !== currentCat) {
    currentCat = t.category;
    generatedList += `\n### ${currentCat.charAt(0).toUpperCase() + currentCat.slice(1)}\n`;
  }
  generatedList += `- [**${t.name}**](https://clinikkit.web.app/tools/${t.category}/${t.slug}): ${t.desc}\n`;
});

const readmeContent = fs.readFileSync(readmePath, 'utf8');
const beforeTools = readmeContent.split('## 🧰 Available Tools')[0];
const afterTools = readmeContent.split('## 👨‍💻 Developer & Maintainer')[1];

if (beforeTools && afterTools) {
  const newReadme = beforeTools + generatedList + '\n---\n\n## 👨‍💻 Developer & Maintainer' + afterTools;
  fs.writeFileSync(readmePath, newReadme);
  console.log('Successfully updated README.md with the latest tools!');
} else {
  console.log('Could not find the target replacement sections in README.md.');
}
