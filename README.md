# Cogniva Compass

Independent, privacy-first multilingual cognitive and emotional skills reflection for adults. It is not an IQ test, diagnosis, clinical assessment, or substitute for a qualified professional.

The versioned banks contain 250 cognitive and 250 emotional items in every supported language. A cognitive form contains 20 questions (5 per domain, including one at each blueprint difficulty level); an emotional form contains 24 statements (6 per domain with balanced scoring direction).

After completion, the result page gives a positive, descriptive interpretation rather than a label: an overall pattern, four domain explanations, practical next steps and guidance on how to read the scores. The three display bands are reflection aids, not norms, percentiles, diagnoses or validated cut scores. Cognitive results describe performance on the current task sample; emotional results describe the respondent's current self-reported habits.

## Languages

Hungarian, English, German, Italian, Spanish, Simplified Chinese, Japanese, Arabic (RTL), Polish, Portuguese and French.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`. Health check: `/health`.

Build and verify the banks before release:

```bash
npm run build:banks
npm run audit:all
```

The design and validation boundaries are documented in `docs/ASSESSMENT_BANK_STANDARD.md`.

## Webflow

Create a blank Webflow page without the default navbar or footer, add a single full-width Embed element and paste the contents of `webflow/cogniva-compass-embed.html`. The Webflow embed is intentionally a one-line external loader. The loader, HTML shell, styles and questionnaire runtime remain version-controlled in GitHub and are served by the independent Railway service.

Webflow page settings should use:

- title: `Cogniva Compass | Cognitive & Emotional Skills Reflection`
- description: `Explore cognitive strengths and emotional habits with two private, non-clinical reflections in 11 languages.`
- indexing disabled until privacy, terms and final content review are complete

## Deployment

The repository contains `railway.toml` and reads Railway's `PORT` automatically. No database or secret is required. Answers and results stay in browser memory and are cleared on reload. For repeat protection, the browser stores only versioned question IDs: the active form in `sessionStorage` and exposure history in `localStorage`. It stores no answers, scores or personal data; clearing browser data or changing browser/device resets the history.
