# Cogniva Compass

Independent, privacy-first multilingual cognitive and emotional skills reflection for adults. It is not an IQ test, diagnosis, clinical assessment, or substitute for a qualified professional.

## Languages

Hungarian, English, German, Italian, Spanish, Simplified Chinese, Japanese, Arabic (RTL), Polish, Portuguese and French.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`. Health check: `/health`.

## Webflow

Create a blank Webflow page without the default navbar or footer, add a single full-width Embed element and paste the contents of `webflow/cogniva-compass-embed.html`. The embed keeps the Webflow markup small while loading versioned CSS and questionnaire runtime from the independent Railway service.

Webflow page settings should use:

- title: `Cogniva Compass | Cognitive & Emotional Skills Reflection`
- description: `Explore cognitive strengths and emotional habits with two private, non-clinical reflections in 11 languages.`
- indexing disabled until privacy, terms and final content review are complete

## Deployment

The repository contains `railway.toml` and reads Railway's `PORT` automatically. No database or secret is required for the privacy-first MVP; answers and results stay in browser memory and are cleared on reload.
