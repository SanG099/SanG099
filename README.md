# Sangam Subedi — Data Analyst Portfolio

A sleek, modern portfolio website with dark/light theme, blinking starfield background, glassmorphism UI, and scroll animations. Built with vanilla HTML, CSS & JavaScript — zero build tools, zero dependencies to install.

> **Live Site:** [https://sang099.github.io/Portfolio/](https://sang099.github.io/Portfolio/)

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repo
git clone https://github.com/SanG099/Portfolio.git

# 2. Open the folder
cd Portfolio

# 3. Open in browser (pick one)
start index.html            # Windows
open index.html             # macOS
xdg-open index.html         # Linux
```

Or use VS Code's **Live Server** extension for hot-reload during development.

---

## 📁 Project Structure

```
Portfolio/
├── index.html              # Single-page site (all sections)
├── css/
│   └── style.css           # Design system, themes & responsive styles
├── js/
│   └── main.js             # Interactions, animations, starfield canvas
├── assets/
│   ├── mypicture-removebg.png  # Profile photo
│   └── resume.pdf              # (Add your resume here)
├── .gitignore
└── README.md
```

---

## 🎨 Features

| Feature | Details |
|---------|---------|
| **Dark / Light Theme** | Toggle via navbar button; preference saved in `localStorage` |
| **Blinking Starfield** | Canvas background with twinkling multi-colored stars & constellation lines |
| **Mouse Interaction** | Stars connect to cursor; gentle repulsion on hover |
| **Glassmorphism Cards** | Frosted-glass effect with `backdrop-filter: blur()` |
| **Scroll Animations** | Intersection Observer–powered fade-in reveals |
| **Active Nav Tracking** | Scroll spy highlights the current section in the navbar |
| **Project Filters** | Filter gallery cards by tech stack (Python, SQL, Tableau, Power BI) |
| **Count-Up Stats** | Animated numbers in the hero section |
| **Responsive** | 4 breakpoints — Desktop → Tablet → Mobile → Small Mobile |

---

## 🌐 Hosting & Deployment

### Option 1: GitHub Pages (Free — Recommended)

1. **Push to GitHub** (already done if you cloned this repo):
   ```bash
   git add .
   git commit -m "Deploy portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repo → **Settings** → **Pages**
   - Under **Source**, select **Branch:** `main`, **Folder:** `/ (root)`
   - Click **Save**

3. **Your site is live at:**
   ```
   https://sang099.github.io/Portfolio/
   ```
   *(Takes 1–2 minutes to deploy on first push)*

> **Custom Domain (optional):** In Settings → Pages → Custom domain, enter your domain (e.g. `sangamsubedi.com`). Add a `CNAME` file to the repo root with your domain name. Configure your DNS with a CNAME record pointing to `sang099.github.io`.

---

### Option 2: Netlify (Free)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. **Drag & drop** your project folder
3. Done — live URL generated instantly

**Or via CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

---

### Option 3: Vercel (Free)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo (`SanG099/Portfolio`)
3. Framework Preset: **Other**
4. Click **Deploy**

---

### Option 4: Cloudflare Pages (Free)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Connect your GitHub repo
3. Build command: *(leave blank)*
4. Output directory: `/`
5. Click **Deploy**

---

## ✏️ Customization

| What to change | Where |
|----------------|-------|
| Name & branding | `<title>`, nav logo in `index.html` |
| Hero headline & stats | `#hero` section in `index.html` |
| Profile photo | Replace `assets/mypicture-removebg.png` |
| Projects | Edit the 6 `<article class="project-card">` blocks |
| Case study | Replace the churn example in `#case-study` |
| About Me bio | `#about` section in `index.html` |
| Email & phone | Footer links in `index.html` |
| Social links | Update GitHub / LinkedIn URLs in footer |
| Resume | Drop your PDF into `assets/resume.pdf` |
| Colors | Edit CSS custom properties in `:root` (`css/style.css`) |

### Embed a real Tableau / Power BI dashboard:
Replace the placeholder in the Case Study section:
```html
<iframe src="https://public.tableau.com/views/YOUR_DASHBOARD"
        width="100%" height="500" frameborder="0"></iframe>
```

---

## 📦 Dependencies

**Zero** build tools. All external resources loaded via CDN:

| Resource | CDN |
|----------|-----|
| [Inter Font](https://fonts.google.com/specimen/Inter) | Google Fonts |
| [Devicon](https://devicon.dev/) | jsDelivr |
| [Lucide Icons](https://lucide.dev/) | unpkg |

---

## 📄 License

MIT — free to use, modify, and share.

---

**Built by [Sangam Subedi](https://github.com/SanG099)** with ☕ and curiosity.
