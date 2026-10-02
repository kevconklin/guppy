# Guppy AI 🐟

**This is a satire website.** Guppy AI is not a real product, company, or service.

Guppy AI parodies the kind of AI product landing page that makes big claims and never explains what the product does. Every feature sounds impressive and delivers nothing. It's fish-themed throughout, and its chatbot mascot, Gillbert, answers every question with confidence and no content.

Live at **https://guppyai.app**

## What's here

A static site with no framework, no build step and no dependencies, served by GitHub Pages from the repo root on `main`.

| File | Purpose |
| --- | --- |
| `index.html` | The landing page |
| `styles.css` | All styles (CSS custom properties on `:root`) |
| `script.js` | Copy button, toasts, mobile nav, terminal animation, Gillbert chatbot |
| `incident.html` | Fake incident report: 17 agents leave the pond and do fish stuff |
| `report.css` | Styles for the incident report (charts, timeline, tables) |
| `assets/guppy-incident-report.pdf` | PDF of the incident report, printed from `incident.html` (regenerate after editing it) |
| `404.html` | "This page got away." |
| `assets/` | Hand-drawn SVG mascot, logo, and Open Graph image |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll |

## Privacy

The site makes no network requests except loading Google Fonts. There's no analytics, no tracking and no API calls. The chatbot picks canned replies at random in your browser.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

To regenerate the incident report PDF after editing `incident.html`, with the local server running:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf=assets/guppy-incident-report.pdf http://localhost:8000/incident.html
```

## Support

If Guppy AI made you laugh, you can [buy me a coffee](https://buymeacoffee.com/kevconklin). ☕

## Disclaimer

Guppy AI is a parody of vague AI marketing as a genre. It doesn't refer to, quote or impersonate any real company or person. No fish, agents, or insights were harmed or produced.
