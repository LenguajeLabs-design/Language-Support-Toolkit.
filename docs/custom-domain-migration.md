# Custom domain migration

Preferred address: `https://www.languagesupporttoolkit.app/`.
Apex address: `https://languagesupporttoolkit.app/`, redirecting to `www` through GitHub Pages.

## Status and scope

Activated on 15 November 2026 after preparation PR #11 was merged and its production deployment succeeded. The preferred HTTPS address returns HTTP 200, its certificate is approved for both `www` and apex names, and repository Pages has HTTPS enforcement enabled.

Porkbun now has the four apex A records and the explicit `www` CNAME listed below, each with TTL 600. The apex parking ALIAS was replaced; the unrelated wildcard CNAME to `pixie.porkbun.com` was preserved. Nameservers and unrelated domain settings were unchanged. Cloudflare (`1.1.1.1`) and Google (`8.8.8.8`) public DNS lookups returned the GitHub targets.

Live browser checks passed for all seven direct strategy links and reloads at desktop and mobile widths, including prompt forms and example images. Live prompt copying and an old GitHub strategy link's hash-preserving redirect passed. The manifest, worker, favicon, and PWA icons all returned HTTP 200 over HTTPS.

HTTP `www` and the old GitHub project address return 301 redirects to the preferred HTTPS address. Apex HTTP and HTTPS also return 301, with the HTTPS certificate verified normally. The apex endpoint checks used `curl --resolve languagesupporttoolkit.app:443:185.199.108.153` because the authoring machine's default DNS resolver still cached a negative apex answer during the switch. Public DNS was correct; local DNS caches may need time to expire. This check preserved TLS hostname/certificate validation and did not use `-k`.

### Preparation history

Prepared on 15 November 2026 from GitHub `main` commit `931e6bb74219f290c82bd5a2895a92cdba48b7d7` in a separate checkout. This is a domain migration; no design, brand assets, strategy content, prompts, or application navigation changed.

Read-only preflight, before activation, found:

- Repository Pages `build_type` is `workflow` (GitHub Actions), with no custom domain (`cname: null`). HTTPS enforcement is enabled for the existing GitHub address.
- The current address, `https://lenguajelabs-design.github.io/Language-Support-Toolkit./`, returns HTTP 200.
- Public DNS uses Porkbun nameservers. The apex resolved to parking addresses `207.207.210.107` and `207.207.210.229`; `www` resolved to `pixie.porkbun.com`. These were not GitHub Pages targets. The subsequent authorized Porkbun inspection confirmed an apex ALIAS and a wildcard CNAME, both pointing to `pixie.porkbun.com` with TTL 600. There was no explicit `www` record.
- Before activation, HTTPS requests to both new domain variants failed their TLS handshake, and DNS, certificates, redirects, and the new live website had not yet been verified.

The preparation PR made no DNS or repository Pages settings changes. Activation was separately authorized afterward, including the Porkbun DNS edits. The configuration procedure below remains available for reference and recovery.

## Minimum repository changes

- `index.html`: preferred canonical URL and Open Graph URL now use `https://www.languagesupporttoolkit.app/`; sharing metadata reuses the existing `public/pwa-512.png` logo. The homepage canonical intentionally has no hash. The same static metadata applies to all hash routes.
- `README.md`: distinguish the preferred address from the current address and link to this guide.
- This guide documents the manual configuration and verification.

No changes are required to:

- `vite.config.ts`: `base: './'` generates relative asset URLs for both the old project path and new domain root.
- `.github/workflows/deploy.yml`: tests and production build already run before the `dist` artifact is deployed from `main`. PRs do not deploy. Keep Source = **GitHub Actions**.
- Routing: existing `#/strategy/...` links open the prompt form directly, without server-side rewrites. Do not replace them with clean paths.
- `public/site.webmanifest`: relative `start_url`, `scope`, and icon URLs resolve at the new origin automatically. Preserve the existing name, icons, display, and colors.
- `src/main.tsx` / `public/service-worker.js`: registration uses Vite's relative base; same-origin caching continues at the new origin over HTTPS.
- React components, CSS, fonts, source images, and external resource links.

Do **not** add a `CNAME` file. Actions-based Pages uses repository Pages settings; a repository `CNAME` file is ignored for this deployment type. See [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## GitHub settings and switch order

1. Review and merge the migration branch into `main`. Confirm **Validate and deploy GitHub Pages** succeeds and the existing GitHub address still works. This deploys metadata only.
2. Recommended: in the **LenguajeLabs-design account Settings → Pages**, add and verify `languagesupporttoolkit.app`. GitHub supplies a TXT name and unique verification value; copy both exactly into Porkbun and complete verification. Keep that TXT record. This step alone does not move the site. See [domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
3. When ready to switch, open [repository Settings → Pages](https://github.com/LenguajeLabs-design/Language-Support-Toolkit./settings/pages). Leave **Build and deployment → Source** set to **GitHub Actions**. Set **Custom domain** to `www.languagesupporttoolkit.app` (no protocol, slash, or hash) and save.
4. Immediately configure the Porkbun records below. GitHub recommends saving the custom domain before pointing DNS at Pages. Keep these steps close together: changing Pages can redirect the old address before DNS/certificates are ready, so an uninterrupted switch cannot be guaranteed.
5. Wait for the Pages DNS check and certificate provisioning to finish, then enable/confirm **Enforce HTTPS**. Check it again for the custom domain even though it was already enabled for `github.io`. GitHub says DNS propagation and availability of HTTPS enforcement can take up to 24 hours. Do not announce the new URL until both variants pass the checks below.

GitHub Pages handles apex-to-`www` redirection when both DNS variants are configured and `www` is the saved custom domain. No Porkbun URL forwarding service or React redirect is needed. See [GitHub's domain and redirect configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [HTTPS provisioning](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Exact Porkbun DNS records

Porkbun → Domain Management → `languagesupporttoolkit.app` → **DNS** (or Details → DNS Records → edit). Record the existing entries first and edit records individually, preserving unrelated records. Avoid a bulk DNS reset or Quick DNS Config.

Use the following five records. A **blank Host** in Porkbun means the apex/root (`@` in generic DNS documentation). Use TTL **600 seconds** for each record, or retain Porkbun's default if the UI supplies it.

| Type | Porkbun Host | Answer / Value | TTL |
| --- | --- | --- | --- |
| A | leave blank | `185.199.108.153` | 600 |
| A | leave blank | `185.199.109.153` | 600 |
| A | leave blank | `185.199.110.153` | 600 |
| A | leave blank | `185.199.111.153` | 600 |
| CNAME | `www` | `lenguajelabs-design.github.io` | 600 |

Replace the apex parking A/ALIAS configuration and replace `www`'s `pixie.porkbun.com` CNAME. Do not leave competing apex web A/ALIAS/AAAA targets or competing `www` records alongside these records. If a conflicting record has an unclear purpose, identify its owner/service before removing it.

The CNAME target contains **no** `https://`, repository name, slash, or hash. Do not point `www` at the apex. Leave nameservers and unrelated MX, TXT (including SPF/DKIM/DMARC and GitHub verification), email, and other subdomain records alone.

No apex AAAA records are required for this minimal configuration. If you want to publish apex IPv6 records, use all four of GitHub's addresses below instead of any unrelated IPv6 destinations; keep the four A records too:

| Type | Porkbun Host | Answer / Value | TTL |
| --- | --- | --- | --- |
| AAAA | leave blank | `2606:50c0:8000::153` | 600 |
| AAAA | leave blank | `2606:50c0:8001::153` | 600 |
| AAAA | leave blank | `2606:50c0:8002::153` | 600 |
| AAAA | leave blank | `2606:50c0:8003::153` | 600 |

Sources: [GitHub DNS values](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Porkbun record fields and blank apex Host](https://kb.porkbun.com/article/231-how-to-add-dns-records-on-porkbun).

## Post-switch verification

### DNS, HTTPS, and redirects

```sh
dig +short www.languagesupporttoolkit.app CNAME
dig +short languagesupporttoolkit.app A
dig +short languagesupporttoolkit.app AAAA
curl -I https://www.languagesupporttoolkit.app/
curl -I https://languagesupporttoolkit.app/
curl -IL https://languagesupporttoolkit.app/
curl -IL http://www.languagesupporttoolkit.app/
curl -IL http://languagesupporttoolkit.app/
```

Expect `www`'s CNAME to be `lenguajelabs-design.github.io.`, the apex A answers to contain exactly the four GitHub addresses, and the apex AAAA answers to be empty or the four optional GitHub addresses. Both HTTPS variants must have valid, hostname-matching certificates without bypassing certificate validation (`curl -k` does not count). The apex and HTTP variants should redirect to `https://www.languagesupporttoolkit.app/`; that destination should return HTTP 200. Check for redirect loops.

In a browser, visit both HTTPS variants, confirm the certificate covers each hostname, and inspect the Console/Network panels for failed assets or mixed content. Confirm repository Pages shows a successful DNS check and **Enforce HTTPS** selected.

### All seven direct prompt routes

Open each URL directly, then reload it. The matching heading and editable prompt form should appear. Check Customize, Example, Why it helps, and Teaching tips; customize a prompt and confirm copying (or manual fallback) still works. Repeat on phone and desktop widths.

- `https://www.languagesupporttoolkit.app/#/strategy/adapt-a-text`
- `https://www.languagesupporttoolkit.app/#/strategy/build-a-word-bank`
- `https://www.languagesupporttoolkit.app/#/strategy/translate-a-visual`
- `https://www.languagesupporttoolkit.app/#/strategy/support-speaking`
- `https://www.languagesupporttoolkit.app/#/strategy/scaffold-writing`
- `https://www.languagesupporttoolkit.app/#/strategy/find-language-demands`
- `https://www.languagesupporttoolkit.app/#/strategy/create-lesson-slides`

Also check the homepage, strategy library/search, Quick start, Key language uses, internal navigation, browser back/forward, all example images, the logo, and social image at `https://www.languagesupporttoolkit.app/pwa-512.png`.

Check an apex strategy link and an existing shared `https://lenguajelabs-design.github.io/Language-Support-Toolkit./#/strategy/...` link in a real browser: the redirect must preserve the hash and open the same strategy. Hashes are not sent to the server, so `curl` alone cannot verify this behavior. Keep publishing strategy links with the same hash suffixes.

### PWA

Visit the preferred site online, confirm `site.webmanifest`, its icons, and `service-worker.js` load successfully, and confirm the registered worker's scope is `https://www.languagesupporttoolkit.app/`. Visit the relevant pages/examples before testing offline; the existing worker caches visited resources rather than precaching the whole app. Reload offline and check a previously visited strategy/example. Restore connectivity afterward.

An installation or browser-tab session from `github.io` belongs to the old origin. Existing installed PWAs do not automatically become installations of the new origin; reinstall from `www` after verification. Saved session preferences and offline caches also start fresh on the new origin. Lesson content is not transferred or collected.

## Validation of the prepared branch

Completed on 15 November 2026:

- Locked dependency installation: `npm ci` completed; no dependency or lockfile changes. Local runtime: Node.js 26.10.0. The existing workflow continues to use Node.js 22.
- `npm test`: **100 passed, 0 failed**.
- `npm run build`: **passed** (TypeScript and Vite production build). The local Node.js version emitted a non-blocking deprecation warning from the existing build tooling.
- Chromium production-preview checks passed at both `/` and `/Language-Support-Toolkit./`, with desktop 1440×1000 and mobile 390×844 viewports. All seven strategy URLs loaded directly and after reload in all four combinations: **56 strategy document loads/reloads**.
- Prompt customization and clipboard copying passed for all seven strategies in each combination. Customize, Example, Why it helps, and Teaching tips panels worked; loaded example images decoded successfully.
- Homepage, strategy search/reset, Quick start, Key language uses, internal links, and browser back/forward passed. No page-level horizontal overflow was found at either viewport. Mobile homepage and desktop example screenshots were visually inspected.
- Canonical/OG URLs, manifest resolution, icon responses, and service-worker script/scope passed for both base paths. A visited strategy and example reloaded offline in each combination. No browser exceptions, failed asset responses, or unexpected network failures occurred.
- `git diff --check` and file-scope checks passed. Only `index.html`, `README.md`, and this guide changed; no `CNAME` file was added.

Local preview checks cannot verify a future public DNS configuration, GitHub certificate, public redirects, social crawler refresh, or a device's installation UI. Complete the post-switch checks before marking the custom domain live. Existing shared hash links must be checked through the real redirects after activation.

## If activation fails

Do not change the framework base, routes, design, or prompts to diagnose a DNS problem. Check the Pages custom-domain spelling, DNS targets/conflicting parking records, certificate status, and latest successful Actions deployment first. A restrictive existing CAA policy may also prevent GitHub's Let's Encrypt certificate issuance; investigate before changing an unrelated policy.

If the new domain remains unusable and the old address must be restored immediately, remove the custom domain from repository Pages settings, redeploy the unchanged Actions workflow if needed, and verify the original GitHub address. Preserve the recorded Porkbun entries for diagnosis and coordinate any rollback there manually. Do not leave a retired domain pointing at Pages indefinitely without a GitHub claim. Revert the canonical/sharing metadata if the migration is abandoned.
