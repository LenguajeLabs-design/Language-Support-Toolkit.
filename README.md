# Language Support Toolkit

**Live toolkit:** [Language Support Toolkit](https://lenguajelabs-design.github.io/Language-Support-Toolkit./). Use this address in workshop materials and shared links.

A lightweight companion website for **Every Lesson Is a Language Lesson**, a November 2026 professional-development workshop for teachers working with multilingual learners.

The site is intentionally a teaching resource—not an AI chatbot. It helps teachers identify a language demand, select a fitting scaffold, create a draft with their school-approved AI tool, and review it before teaching.

## Included

- Responsive homepage with the NOTICE → SCAFFOLD → CREATE → REVIEW framework
- Six dedicated strategy routes: Adapt a Text, Build a Word Bank, Translate a Visual, Support Speaking, Scaffold Writing, and Find Language Demands
- Before-and-after classroom examples, including a Grade 4 landforms word bank
- Strategy pages open directly on customizable AI prompts, with examples, rationale, and teaching tips alongside
- Copy before an optional full-prompt preview, with teacher-review reminders and a manual-copy fallback
- A four Key Language Uses planning reference and independent-resource disclaimer
- Keyboard-accessible navigation, semantic HTML, direct hash links, and phone-first layouts

## Local development

Prerequisite: Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the printed local URL. Run the prompt-personalization regression checks with `npm test` (Node.js 22.6 or newer). Run a production check with:

```bash
npm run build
```

## Editing content

Strategy text, examples, prompts, and links live in [`src/data/strategies.ts`](src/data/strategies.ts). Shared personalization and the specialized text-adaptation and word-bank builders live in [`src/lib/prompt.ts`](src/lib/prompt.ts). Components stay intentionally small and reusable in `src/components/`, so an educator can update the instructional content without redesigning pages.

Every strategy accepts an optional learning objective and classroom observations, with or without a reported proficiency level. Blank speaking and writing goals request a clearly labeled inference from the lesson material rather than substituting a preset goal.

Only grade, subject, language, proficiency, and resource preferences are saved for the browser-tab session. Lesson-specific text, including goals, objectives, and learner observations, is excluded when saving and restoring preferences.

## Links and static hosting

The site uses hash-based routes (for example `/#/strategy/build-a-word-bank`). This keeps individual strategy links working on static hosts—including GitHub Pages—without server-side route rewrites. Relative build asset paths let the same `dist` output work at a domain root or the GitHub Pages project path. Keep Vite's `base` set to `./` when publishing to either host.

GitHub Pages is the primary address above. The existing Sites publication remains a working copy of the toolkit. Its `.openai/hosting.json` retains the existing Site identity. The service worker checks the network first for page navigation so returning visitors receive current releases, with an offline fallback when available.

## GitHub Pages

The workflow at `.github/workflows/deploy.yml` runs the prompt tests and production build for pull requests to `main`. Pushes to `main` deploy the tested `dist` folder to GitHub Pages; pull requests do not deploy.

1. Create a GitHub repository and push this project to its `main` branch.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main`, then use the workflow’s deployment URL.

No accounts, file uploads, AI integrations, analytics, or student data collection are included.
