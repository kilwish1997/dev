# GitHub Upload Instructions

## Step-by-Step Guide to Upload Your Project to GitHub

### Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `local-shops-finder` (or your preferred name)
   - **Description**: "A React app to find nearby shops using OpenStreetMap"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Configure Git (One-time setup)

Open your terminal in the `new` directory and run:

```bash
# Set your name and email (use your GitHub email)
git config user.name "Your Name"
git config user.email "your-github-email@example.com"
```

### Step 3: Initialize and Commit Your Code

```bash
# Navigate to your project directory
cd new

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Local Shops Finder with OpenStreetMap integration"
```

### Step 4: Connect to GitHub and Push

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Example (Replace with your details):

```bash
git remote add origin https://github.com/johndoe/local-shops-finder.git
git branch -M main
git push -u origin main
```

### Step 5: Enter GitHub Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)

#### How to Create a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Local Shops Finder Upload"
4. Select scopes: Check **"repo"** (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

### Alternative: Using SSH (Recommended)

If you have SSH keys set up:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 6: Verify Upload

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files uploaded!

## Quick Command Summary

```bash
# One-time setup
git config user.name "Your Name"
git config user.email "your@email.com"

# Initialize and commit
git init
git add .
git commit -m "Initial commit: Local Shops Finder with OpenStreetMap"

# Connect and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "nothing to commit"
```bash
git add .
git commit -m "Initial commit"
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "failed to push"
- Make sure you're using a Personal Access Token, not your password
- Check that the repository URL is correct
- Ensure you have write access to the repository

### "Author identity unknown"
```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

## After Successful Upload

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Done! Your app will be live at `https://your-app.vercel.app`

### Update Your Repository Later

```bash
# After making changes
git add .
git commit -m "Description of changes"
git push
```

## Files Included in This Upload

✅ Source code with all fixes
✅ API helper utilities with retry logic
✅ Vercel configuration
✅ Comprehensive documentation:
   - README.md
   - DEPLOYMENT.md
   - FIXES_SUMMARY.md
   - QUICK_START.md
✅ Environment configuration
✅ .gitignore (excludes node_modules, build, etc.)

## Need Help?

- **GitHub Docs**: https://docs.github.com/en/get-started
- **Git Basics**: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
- **Personal Access Tokens**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

**Ready to upload!** Follow the steps above and your project will be on GitHub in minutes! 🚀
