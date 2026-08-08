const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\krish\\web APP\\ToolVerse\\etc\\www.mdcalc.com\\calc\\arterial-blood-gas-abg-analyzer.htm', 'utf8');
const match = content.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
const data = JSON.parse(match[1]);
console.log(Object.keys(data.props.pageProps));
// let's print the whole pageProps keys recursively up to 2 levels
function printKeys(obj, prefix = '') {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key of Object.keys(obj)) {
    console.log(prefix + key);
    if (prefix.length < 4) {
      printKeys(obj[key], prefix + '  ');
    }
  }
}
printKeys(data.props.pageProps);
