git add .
git commit -m "feat: Add MovieVerse suggestor tool and fix linting"
git push
call npm run build
call npx firebase deploy
