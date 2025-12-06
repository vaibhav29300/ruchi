# Deploying to GitHub Pages

This guide will help you deploy the Puzzle-Solver website to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Node.js and npm installed

## Setup Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it either:
   - `your-username.github.io` (for root domain: `https://your-username.github.io`)
   - Any other name (for subdirectory: `https://your-username.github.io/repo-name`)

### 2. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 4. Configure Base Path (if needed)

If your repository is NOT named `your-username.github.io`, you need to set the base path.

Edit `.github/workflows/deploy.yml` and update the `GITHUB_PAGES_BASE` environment variable:

```yaml
GITHUB_PAGES_BASE: /your-repo-name/
```

Replace `your-repo-name` with your actual repository name.

### 5. Push to GitHub

The GitHub Actions workflow will automatically:
- Build your site when you push to `main` or `master` branch
- Deploy it to GitHub Pages

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push
```

### 6. Access Your Site

After the workflow completes (usually 1-2 minutes):
- Go to your repository **Settings** → **Pages**
- Your site will be available at:
  - `https://your-username.github.io` (if repo is `your-username.github.io`)
  - `https://your-username.github.io/repo-name` (if repo has a different name)

## Manual Build (Optional)

If you want to test the build locally:

```bash
npm run build:gh-pages
```

The built files will be in the `dist` folder.

## Troubleshooting

### Site shows 404
- Make sure GitHub Pages is enabled in repository settings
- Check that the base path in the workflow matches your repository name
- Wait a few minutes for the deployment to complete

### Assets not loading
- Verify the `base` path in `vite.config.ts` matches your repository structure
- Check browser console for 404 errors

### Build fails
- Check the Actions tab in your GitHub repository for error details
- Ensure all dependencies are in `package.json`
- Make sure Node.js version in workflow matches your local version

