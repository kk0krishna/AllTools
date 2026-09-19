git add .
git commit -m "Fix file:// Security Error by dynamically importing pdfjs-dist in pdf-compressor"
git push
call npm run build
call npx firebase deploy
