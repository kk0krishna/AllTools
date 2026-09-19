git add .
git commit -m "Optimize Ishihara charts, add guidelines, fix HEIC"
git push
call npm run build
call npx firebase deploy
