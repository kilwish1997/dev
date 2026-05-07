# 🚀 Upload to GitHub - Quick Guide

## Option 1: Automated Script (Easiest)

Run this command in your terminal:

```bash
cd new
./upload-to-github.sh
```

The script will guide you through the process!

---

## Option 2: Manual Commands (5 Steps)

### Before You Start:
1. Create a new repository on GitHub: https://github.com/new
   - Name it: `local-shops-finder`
   - Don't initialize with README
   - Click "Create repository"

### Step 1: Configure Git
```bash
cd new
git config user.name "Your Name"
git config user.email "your-github-email@example.com"
```

### Step 2: Initialize and Commit
```bash
git init
git add .
git commit -m "Initial commit: Local Shops Finder with OpenStreetMap fixes"
```

### Step 3: Add Remote (Replace YOUR_USERNAME)
```bash
git remote add origin https://github.com/YOUR_USERNAME/local-shops-finder.git
git branch -M main
```

### Step 4: Push to GitHub
```bash
git push -u origin main
```

**When prompted for password**: Use a Personal Access Token from https://github.com/settings/tokens

### Step 5: Verify
Go to: `https://github.com/YOUR_USERNAME/local-shops-finder`

---

## ⚠️ Important Notes

### Personal Access Token (Required)
GitHub no longer accepts passwords for git operations. You need a token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Local Shops Finder"
4. Select scope: ✅ **repo** (full control)
5. Click "Generate token"
6. **Copy it immediately** (you won't see it again!)
7. Use this token as your password when pushing

### Common Issues

**"Repository not found"**
→ Make sure you created the repository on GitHub first

**"Authentication failed"**
→ Use Personal Access Token, not your password

**"remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

---

## 🎉 After Upload

### Deploy to Vercel (2 minutes)

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Done! 🚀

Your app will be live at: `https://your-app.vercel.app`

---

## 📁 What's Being Uploaded

✅ Complete React application
✅ OpenStreetMap integration with fixes
✅ API retry logic and error handling
✅ Vercel deployment configuration
✅ Comprehensive documentation
✅ All source code and utilities

---

## Need Help?

- **Detailed Instructions**: See `GITHUB_UPLOAD_INSTRUCTIONS.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Technical Details**: See `FIXES_SUMMARY.md`

---

**Ready? Let's upload!** 🚀

Choose Option 1 (script) or Option 2 (manual) above and follow the steps!
