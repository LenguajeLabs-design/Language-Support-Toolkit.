# Language Support Toolkit

A lightweight companion website for **Every Lesson Is a Language Lesson**, a November 2026 professional-development workshop for teachers working with multilingual learners.

The site is intentionally a teaching resource—not an AI chatbot. It helps teachers identify a language demand, select a fitting scaffold, create a draft with their school-approved AI tool, and review it before teaching.

## Included

- Responsive homepage with the NOTICE → SCAFFOLD → CREATE → REVIEW framework
- Six dedicated strategy routes: Adapt a Text, Build a Word Bank, Translate a Visual, Support Speaking, Scaffold Writing, and Find Language Demands
- Before-and-after classroom examples, including a Grade 4 landforms word bank
- Copy-ready, customizable AI prompts with teacher-review reminders
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

Strategy text, examples, prompts, and links live in [`src/data/strategies.ts`](src/data/strategies.ts). Components stay intentionally small and reusable in `src/components/`, so an educator can update the instructional content without redesigning pages.

## Links and static hosting

The site uses hash-based routes (for example `/#/strategy/build-a-word-bank`). This keeps individual strategy links working on static hosts—including GitHub Pages—without server-side route rewrites.

## GitHub Pages

The included workflow at `.github/workflows/deploy.yml` builds and deploys the `dist` folder whenever `main` changes.

1. Create a GitHub repository and push this project to its `main` branch.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main`, then use the workflow’s deployment URL.

No accounts, file uploads, AI integrations, analytics, or student data collection are included.
