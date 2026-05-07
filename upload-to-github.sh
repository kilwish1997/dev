#!/bin/bash

# GitHub Upload Script for Local Shops Finder
# This script helps you upload your project to GitHub

echo "🚀 GitHub Upload Helper"
echo "======================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Get user information
echo "📝 Please provide your GitHub information:"
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your GitHub email: " GITHUB_EMAIL
read -p "Enter your repository name (e.g., local-shops-finder): " REPO_NAME

echo ""
echo "📋 Summary:"
echo "   Username: $GITHUB_USERNAME"
echo "   Email: $GITHUB_EMAIL"
echo "   Repository: $REPO_NAME"
echo ""
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Cancelled. Please run the script again."
    exit 1
fi

echo ""
echo "🔧 Setting up git configuration..."

# Configure git
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

echo "✅ Git configured"
echo ""

# Initialize git if needed
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📁 Adding files to git..."
git add .

echo ""
echo "💾 Committing changes..."
git commit -m "Initial commit: Local Shops Finder with OpenStreetMap integration and production fixes"

echo ""
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "🌿 Setting branch to main..."
git branch -M main

echo ""
echo "📤 Ready to push to GitHub!"
echo ""
echo "⚠️  IMPORTANT: When prompted for password, use a Personal Access Token, not your GitHub password!"
echo ""
echo "How to get a Personal Access Token:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select 'repo' scope"
echo "4. Copy the token and use it as your password"
echo ""
read -p "Press Enter to continue with push..."

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your project is now on GitHub!"
    echo ""
    echo "🌐 View your repository at:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Go to https://vercel.com"
    echo "   2. Import your GitHub repository"
    echo "   3. Click Deploy"
    echo "   4. Your app will be live!"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Repository doesn't exist on GitHub - Create it first at https://github.com/new"
    echo "   2. Wrong credentials - Make sure to use Personal Access Token"
    echo "   3. No write access - Check repository permissions"
    echo ""
    echo "📖 See GITHUB_UPLOAD_INSTRUCTIONS.md for detailed help"
fi
