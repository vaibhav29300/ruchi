# Quick Start: Deploy to GitHub Pages

## 🚀 Quick Deployment Steps

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

3. **Wait for deployment**:
   - Go to **Actions** tab in your repository
   - The workflow will automatically build and deploy
   - Takes 1-2 minutes

4. **Access your site**:
   - Your site will be live at:
     - `https://your-username.github.io` (if repo is `username.github.io`)
     - `https://your-username.github.io/Puzzle-Solver/` (if repo is `Puzzle-Solver`)

## 📝 Notes

- The workflow automatically detects your repository name and sets the correct base path
- If you need to change the base path manually, edit `.github/workflows/deploy.yml`
- The site rebuilds automatically on every push to `main` or `master` branch

## 🔧 Manual Build Test

To test the build locally:
```bash
npm run build:gh-pages
```

Built files will be in the `dist` folder.

