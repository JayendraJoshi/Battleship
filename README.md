
# My Webpack 5 Template Notes

This is my personal Webpack 5 starter setup. All notes, reminders, and explanations below are for my own reference when starting new projects or tweaking this template.

---


## Features 

- Split config: `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js` (using `webpack-merge`).
- CSS: `style-loader` in dev for HMR, `mini-css-extract-plugin` + `css-minimizer-webpack-plugin` in prod.
- HTML: `html-webpack-plugin` for injecting assets into my template.
- Live reload: `webpack-dev-server` with HMR.
- Source maps: `eval-source-map` in dev, `source-map` in prod.
- Asset imports: Images/fonts via imports in JS/CSS.
- Clean builds: `dist/` wiped before each build.
- Easy to extend: Babel, TypeScript, SASS, etc. if I want.

---


## My Quickstart

1. Clone or copy this repo.
2. `npm install`
3. `npm run dev` for local dev (http://localhost:8080)
4. `npm run build` for production build (output in `dist/`)
5. `npm run deploy` to push `dist/` to GitHub Pages (if I want)

---


## Folder Structure 

```
/ (root)
├── src/
│   ├── index.js         # Main JS entry
│   ├── style.css        # Example CSS (imported in index.js)
│   └── template.html    # HTML template
├── dist/                # Output (auto-generated)
├── webpack.common.js    # Shared config
├── webpack.dev.js       # Dev config
├── webpack.prod.js      # Prod config
├── package.json         # Scripts/deps
├── .gitignore           # Node, dist, etc.
└── README.md            # This file
```

---


## Config Reminders

- `webpack.common.js`: Entry/output, HTML plugin, shared stuff.
- `webpack.dev.js`: Dev server, style-loader, fast source maps.
- `webpack.prod.js`: CSS extraction/minification, full source maps, asset optimization.

CSS: Injected in dev, extracted/minified in prod.
HTML: Generated/injected by plugin, edit `src/template.html` for structure.
Source maps: Fast in dev, full in prod.
Dev server: Config in `webpack.dev.js`, serves from `dist/`, opens browser, HMR.
Assets: Import in JS/CSS, or use `static` in devServer for public stuff.

---


## Scripts 
- `npm run dev` – Dev server + HMR
- `npm run build` – Production build
- `npm run deploy` – Deploy to GitHub Pages 

---


## If I Want to Extend

- TypeScript: Add `ts-loader`, update entry/output.
- Babel: Add `babel-loader`, `.babelrc` for ES6+.
- SASS/SCSS: Add `sass-loader`, `sass`, update CSS rules.
- Linting: ESLint/Stylelint.

---


## My FAQ / Reminders

- Why split config files? → So dev/prod settings stay clean and are optimized for their respective purpose.
- Why use MiniCssExtractPlugin only in prod? → Extracting CSS is slow in dev, but great for caching in prod.
- How do I add more entry points/pages? → Update `entry` in `webpack.common.js`, add more `HtmlWebpackPlugin` instances (one per page/chunk).
- How do I add static assets? → Import in JS/CSS from `src/`, or use `static` in devServer for public stuff.

---

## Notes
- This README is just for me. Delete or edit as needed if I ever share this.
