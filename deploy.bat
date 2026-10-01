git add .
git commit -m "auto update"
git push
call npm run build
node scripts/fix-rsc.js
call npx firebase deploy
