# Gowri Prasath Shanmugasundaram — Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gowriprasathdev.github.io%2Fportfolio-41d1c2?style=for-the-badge&logo=google-chrome&logoColor=white)](https://gowriprasathdev.github.io/portfolio/)
[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Pages-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/gowriprasathdev/portfolio/actions)

> High-performance, accessibility-compliant (WCAG AA), and search-optimized developer portfolio built with modern Angular, SSG prerendering, and state-of-the-art **SEO, AEO, and Generative Engine Optimization (GEO)**.

---

## 🌐 Live Demo

Visit the live production site:  
👉 **[https://gowriprasathdev.github.io/portfolio/](https://gowriprasathdev.github.io/portfolio/)**

---

## ✨ Key Highlights & Features

### 1. Modern Angular Architecture
- **Angular 21 Standalone Components**: Modular, tree-shakable structure without NgModules.
- **Angular Signals**: Granular reactivity for theme switching, navigation scroll-spy, and carousel states.
- **Component Prerendering**: Fast First Contentful Paint (FCP) with build-time prerendered markup and client-side hydration.

### 2. Built for AI Search (SEO, AEO & GEO)
- **Generative Engine Optimization (GEO)**:
  - Custom [`/public/llms.txt`](https://gowriprasathdev.github.io/portfolio/llms.txt) adhering to the [llmstxt.org](https://llmstxt.org) standard for direct LLM ingestion (Perplexity, ChatGPT, Claude).
  - Explicit crawler whitelisting in [`robots.txt`](https://gowriprasathdev.github.io/portfolio/robots.txt) for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, and `Applebot-Extended`.
- **Answer Engine Optimization (AEO)**:
  - Schema.org JSON-LD `@graph` featuring `ProfilePage`, `Person` (with legal and family name disambiguation, `knowsAbout`, and `sameAs`), and `SoftwareSourceCode` entities.
  - Direct-answer factual statement chunks structured for instant AI search synthesis.
- **Traditional Technical SEO**:
  - Canonical URLs, Open Graph tags, Twitter Cards, dynamic meta descriptions, and XML sitemaps.

### 3. Accessible & Responsive UI/UX (A11y)
- **WCAG AA Compliance**: High-contrast ratios, focus rings, ARIA labels, and keyboard skip-navigation links.
- **Fluid Design System**: Responsive grid/flexbox layouts with sleek dark/light theme toggles and CSS-native micro-animations.
- **Zero Heavy CSS Frameworks**: Built using clean, scalable Vanilla CSS design tokens.

### 4. Automated CI/CD
- GitHub Actions pipeline automatically tests, builds, prerenders, and deploys the production bundle to GitHub Pages CDN on every push to `main`.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Angular 21](https://angular.dev/) (Signals, Standalone Components) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Rendering** | Build-Time SSR / Static Site Generation ([@angular/ssr](https://angular.dev/guide/ssr)) |
| **Styling** | Vanilla CSS3 (Custom CSS Tokens, Glassmorphism, CSS Grid & Flexbox) |
| **Testing** | [Vitest](https://vitest.dev/) with Angular TestBed |
| **Structured Data** | Schema.org JSON-LD (`@graph`, `Person`, `ProfilePage`, `SoftwareSourceCode`) |
| **AI Standards** | `llms.txt` (GEO standard) & `robots.txt` AI crawler rules |
| **Hosting & CI/CD** | [GitHub Pages](https://pages.github.com/) + [GitHub Actions](https://github.com/features/actions) |

---

## 📁 Repository Structure

```text
portfolio/
├── .github/workflows/          # Automated GitHub Actions deployment pipeline
├── public/                     # Static assets served at domain root
│   ├── data/
│   │   └── portfolio-data.json # Single source of truth for portfolio content
│   ├── images/                 # Profile avatars and visual assets
│   ├── llms.txt                # Plain-text markdown specification for LLMs (GEO)
│   ├── robots.txt              # Crawler permissions & AI bot rules
│   └── sitemap.xml             # Search engine URL indexing map
├── src/
│   ├── app/
│   │   ├── core/               # Singleton services, models, and state
│   │   │   ├── models/         # TypeScript interfaces (portfolio data models)
│   │   │   └── services/       # SEO, state management, and theme services
│   │   ├── features/           # Feature views (Hero, About, Experience, Projects, Contact)
│   │   ├── shared/             # Reusable UI components (Header, Footer, ThemeToggle)
│   │   ├── app.html            # Main application layout shell
│   │   └── app.ts              # Root component with dynamic meta-tag binding
│   ├── index.html              # Base HTML template with static fallback meta tags
│   └── styles.css              # Global design tokens and reset styles
└── angular.json                # Angular CLI workspace configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/gowriprasathdev/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local dev server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Testing
Execute unit tests via Vitest:
```bash
npm test
```

### Production Build
Generate an optimized, prerendered static build for production:
```bash
npm run build
```
The compiled output will be generated inside the `dist/portfolio/browser/` directory.

---

## 👤 Author

**Gowri Prasath Shanmugasundaram**  
*Senior Software Developer*

- **Website**: [gowriprasathdev.github.io/portfolio](https://gowriprasathdev.github.io/portfolio/)
- **GitHub**: [@gowriprasathdev](https://github.com/gowriprasathdev)
- **LinkedIn**: [in/gowri-prasath](https://www.linkedin.com/in/gowri-prasath)
- **Email**: [gowriprasath0304@gmail.com](mailto:gowriprasath0304@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use the architecture as inspiration for your own portfolio.
