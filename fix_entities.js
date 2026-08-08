const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only process the content block to avoid breaking TSX attributes
  const contentStart = content.indexOf('content: () => (');
  if (contentStart === -1) return;
  
  let prefix = content.substring(0, contentStart);
  let jsxBlock = content.substring(contentStart);

  // Fix apostrophes in words like patient's, don't, etc.
  jsxBlock = jsxBlock.replace(/(\w)'(\w)/g, "$1&apos;$2");
  
  // Fix quotes (only those surrounded by spaces or brackets in text)
  jsxBlock = jsxBlock.replace(/ "/g, ' &quot;');
  jsxBlock = jsxBlock.replace(/" /g, '&quot; ');
  jsxBlock = jsxBlock.replace(/>"/g, '>&quot;');
  jsxBlock = jsxBlock.replace(/"</g, '&quot;<');

  fs.writeFileSync(filePath, prefix + jsxBlock);
  console.log('Fixed ' + filePath);
}

const toolsDir = path.join(__dirname, 'src', 'tools');
const categories = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

categories.forEach(category => {
  const categoryPath = path.join(toolsDir, category);
  const tools = fs.readdirSync(categoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  tools.forEach(tool => {
    const metadataPath = path.join(categoryPath, tool, 'metadata.tsx');
    if (fs.existsSync(metadataPath)) {
      fixFile(metadataPath);
    }
  });
});

console.log("Done");
