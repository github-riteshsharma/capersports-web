#!/bin/bash

# Force rebuild script for Azure Static Web App
# This triggers a rebuild with the updated environment variables

echo "🚀 Forcing rebuild with updated environment variables..."
echo ""

# Add timestamp to README to trigger rebuild
echo "" >> README.md
echo "<!-- Force rebuild: $(date) -->" >> README.md

# Stage changes
git add .

# Commit
git commit -m "Force rebuild with Azure environment variables - $(date +%Y-%m-%d)"

# Push to trigger GitHub Actions
echo ""
echo "📤 Pushing to GitHub to trigger rebuild..."
git push origin main

echo ""
echo "✅ Done! Check GitHub Actions for build progress:"
echo "   https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
echo ""
echo "⏱️  Build will take 5-10 minutes"
echo "🌐 After build completes, hard refresh your browser (Ctrl+Shift+R)"
echo ""
