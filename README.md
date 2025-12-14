# Ramadan Giving Website

A beautiful, responsive website for the Ramadan Giving Organization - a grassroots initiative building connection and serving vulnerable families in Cairo and the GTA.

## 🌟 Features

- Responsive design with modern UI/UX
- Interactive world map showing service locations
- Photo gallery with slideshow
- Impact timeline visualization
- Particle.js background effects
- Smooth animations and transitions

## 🚀 Running Locally

This is a static website that doesn't require any build process. You can run it locally in several ways:

### Option 1: Simple HTTP Server (Recommended)

Using Python (if installed):

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Using Node.js (if installed)

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 3: Using VS Code Live Server

If you're using Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Direct File Opening

You can also simply open `index.html` directly in your browser, though some features (like loading external resources) may be limited.

## 📁 Project Structure

```
ramadangiving.github.io/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Stylesheet
├── js/
│   └── script.js      # JavaScript functionality
├── assets/
│   ├── images/        # Logo and team images
│   └── years/         # Year-specific images
└── README.md          # This file
```

## 🌐 GitHub Pages Deployment

This repository is configured for automatic deployment to GitHub Pages. Since the repository is named `ramadangiving.github.io`, GitHub will automatically:

1. **Deploy from the `main` branch** (or `master` if that's your default branch)
2. **Publish to**: `https://ramadangiving.github.io`

### Automatic Deployment Setup

GitHub Pages should already be enabled, but to verify or configure:

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
4. Click **Save**

### Manual Deployment

Any push to the `main` branch will automatically trigger a deployment:

```bash
# Make your changes
git add .
git commit -m "Update website content"
git push origin main
```

Deployment typically takes 1-2 minutes. You can check the deployment status:
- Go to **Settings** → **Pages** to see deployment history
- Or check the **Actions** tab for deployment logs

### Custom Domain (Optional)

If you have a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Follow GitHub's instructions to configure DNS records
4. Enable **Enforce HTTPS** (recommended)

## 🛠️ Development Workflow

### Making Changes

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your edits** to HTML, CSS, or JS files

3. **Test locally** using one of the methods above

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub for review

6. **Merge to main** - Once merged, GitHub Pages will automatically deploy

### Best Practices

- Always test changes locally before pushing
- Use descriptive commit messages
- Create pull requests for review before merging to main
- Keep the `main` branch stable and production-ready

## 📝 Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (flexbox, grid, animations)
- **JavaScript (ES6+)** - Interactivity
- **Particles.js** - Background particle effects
- **amCharts 5** - Interactive world map
- **Google Fonts** - Typography (Cormorant Garamond, DM Sans, Crimson Pro)

## 🔧 Troubleshooting

### Images not loading locally
- Make sure you're using a local server (not just opening the HTML file)
- Check that image paths are correct relative to the HTML file

### GitHub Pages not updating
- Wait 1-2 minutes after pushing
- Check the **Actions** tab for any deployment errors
- Verify GitHub Pages is enabled in Settings → Pages
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Styling issues
- Ensure `css/style.css` is properly linked in `index.html`
- Check browser console for any 404 errors

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team

## 📄 License

All rights reserved. © 2025 Ramadan Giving Organization
