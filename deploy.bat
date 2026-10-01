git add .
git commit -m "auto update"
git push
call npm run build
call npx firebase deploy
