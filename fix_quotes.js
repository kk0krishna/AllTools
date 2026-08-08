const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix corrupted quotes caused by naive regex
            if (content.includes('&quot; />')) {
                content = content.replace(/&quot;\s*\/>/g, '" />');
                modified = true;
            }
            if (content.includes('&quot; className=')) {
                content = content.replace(/&quot;\s*className=/g, '" className=');
                modified = true;
            }
            if (content.includes('&quot;>')) {
                content = content.replace(/&quot;>/g, '">');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed ${fullPath}`);
            }
        }
    }
}

processDir('src/tools');
