const fs = require('fs');
const path = require('path');

function walkAndFix(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith('__next.')) {
                // Flatten the directory contents
                flattenDirectory(path.join(dir, entry.name), dir, entry.name);
                // We don't recurse into walkAndFix for __next.* because it's handled by flattenDirectory
            } else {
                walkAndFix(path.join(dir, entry.name));
            }
        }
    }
}

function flattenDirectory(currentDir, targetDir, prefix) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            flattenDirectory(path.join(currentDir, entry.name), targetDir, prefix + '.' + entry.name);
        } else if (entry.isFile() && entry.name.endsWith('.txt')) {
            // Remove .txt from prefix if the folder itself had a .txt (unlikely, but just in case)
            let finalName = prefix + '.' + entry.name;
            const srcPath = path.join(currentDir, entry.name);
            const destPath = path.join(targetDir, finalName);
            console.log(`Copying RSC file: ${finalName}`);
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const outDir = path.join(__dirname, '../out');
console.log('Fixing RSC paths in out directory...');
walkAndFix(outDir);
console.log('Done fixing RSC paths.');
