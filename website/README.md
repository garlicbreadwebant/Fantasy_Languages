# Fantasy Languages website

Open index.html directly in a browser. Dictionaries, flashcards, language guides, and policies work offline. The application preserves the Universal_Languages layout and file structure with five new language collections and a plum/lavender/copper palette.

## Refresh content

The language folders are the source of truth. After editing a CSV run its tools/check_language.cjs with --write. Then run:

```sh
node website/build-data.cjs
node website/check-site.cjs
node website/build-site.cjs
```

The builder enforces the exact frozen 397 English headwords in tools/english-headwords.json. A dash is an explicitly unresolved equivalent or missing direct correspondence. Refer to each DESIGN.md for sources and historical qualifications. Learning forms are a starter collection requiring specialist review.

## Features

- Searchable dictionaries with categories, usage notes, pagination, and CSV download.
- Flashcards with category and direction controls, reveal, shuffle, and wraparound navigation.
- Six reference pages per language and offline policy documents.
- Responsive keyboard-accessible mobile menu, focus states, and readable control sizes.
- Optional session-only API keys, streaming AI companion, and read-aloud tools inherited from the sibling project.

Local practice examples are curated per language. Lingua Ignota and initial Solresol practice use isolated glossary items rather than invented sentences. AI tools receive the reference constraints; generated content and speech require review.

## Optional AI and privacy

AI settings support OpenAI, Gemini, and Claude chat. Speech supports OpenAI, Gemini, and the browser. These features require internet and your own provider keys; provider charges and data policies apply. Keys and conversations stay in page memory and are cleared on reload or leaving the page. No cookies, analytics, accounts, external scripts, automatic provider requests, or shared server credentials are used. A browser speech service may contact its vendor. Never share keys or add untrusted scripts to the page. HTTPS is recommended for API features; file URLs may encounter provider CORS restrictions.

Mocked-provider checks run in check-ai.cjs without real keys or paid calls. check-browser.cjs checks all five languages at desktop and mobile widths using local Chrome; no installation is required. Live provider behavior and language pronunciation quality are not certified by these checks.

## Publishing

Build output is .site-build/. The GitHub Actions workflow validates changes and publishes to GitHub Pages on main when Pages is configured to use GitHub Actions.
