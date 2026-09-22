git add .
git commit -m "CliniKKit PWA updates, AI icons, and Emotion Compass Print PDF layout fixes"
git push
call npm run build
call npx firebase deploy
