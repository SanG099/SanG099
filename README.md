# Sangam Subedi — Data Analyst Portfolio

A sleek, dark-mode portfolio website built with vanilla HTML, CSS, and JavaScript. No build tools required.

## 🚀 Quick Start

1. **Open locally** — Just open `index.html` in your browser.
2. **Live Server** — Use VS Code's "Live Server" extension for hot-reload during development.

## 📁 Project Structure

```
portfolio/
├── index.html          # Main single-page site
├── css/
│   └── style.css       # Design system + responsive styles
├── js/
│   └── main.js         # Interactions, animations, canvas
├── assets/
│   └── resume.pdf      # (Add your resume here)
├── .gitignore
└── README.md
```

## 🎨 Design Features

- **Dark Mode** — Deep navy + charcoal palette with neon mint accents
- **Glassmorphism** — Frosted-glass cards with `backdrop-filter`
- **Interactive Canvas** — Animated network-node background (mouse-reactive)
- **Scroll Animations** — Intersection Observer–powered fade-in reveals
- **Responsive** — 4 breakpoints: Desktop → Tablet → Mobile → Small Mobile

## ✏️ Customization

### Replace placeholder content:
- **Name / Brand** — Update `<title>`, nav logo, and footer
- **Hero text** — Edit headline, description, and stats in `#hero`
- **Projects** — Replace the 6 placeholder cards with your real work
- **Case Study** — Swap the churn example with your own deep dive
- **About** — Add your photo and personal bio
- **Links** — Update GitHub, LinkedIn, and email URLs in the footer
- **Resume** — Drop your PDF into `/assets/resume.pdf`

### Embed real dashboards:
In the Case Study section, replace the placeholder `<div class="embed-placeholder">` with:
```html
<iframe src="https://public.tableau.com/views/YOUR_DASHBOARD" 
        width="100%" height="500" frameborder="0"></iframe>
```

## 🌐 Deploy

### GitHub Pages (free):
1. Push this repo to GitHub
2. Go to Settings → Pages → Source: `main` branch
3. Your site is live at `https://yourusername.github.io/portfolio`

### Netlify:
1. Drag-and-drop the folder to [netlify.com/drop](https://app.netlify.com/drop)

## 📦 Dependencies

**Zero** build tools. All dependencies are loaded via CDN:
- [Inter Font](https://fonts.google.com/specimen/Inter) — Google Fonts
- [Devicon](https://devicon.dev/) — Tech stack icons
- [Lucide](https://lucide.dev/) — UI icons

## License

MIT — use freely for your own portfolio.
