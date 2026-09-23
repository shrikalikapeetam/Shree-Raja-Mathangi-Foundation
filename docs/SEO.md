# Foundation SEO

The implementation follows the same categories as the SundeepKochar project, using the foundation's own branding, content and schema types.

## Production configuration

Set `NEXT_PUBLIC_SITE_URL` to the confirmed production origin (for example, `https://your-domain.org`, with no path), then rebuild and deploy. No production domain has been assumed. Without this setting, the site emits noindex, disallows crawlers, and returns an empty sitemap. Vercel preview deployments remain non-indexable even when the production origin is set.

The localhost origin used for verification was supplied only to the audit build commands. It was not written to .env.local. Rebuild with the real production origin before deployment.

## Page fields in Prismic

Under **SEO & Metadata**:

- `meta_title`, `meta_description`, `meta_image`: existing fields.
- `og_title`, `og_description`, `og_image`: social sharing overrides.
- `noindex`: exclude a page from search, sitemap and llms.txt.
- `schema_type`: WebPage, AboutPage, ContactPage or CollectionPage.

Empty fields use page-specific fallbacks. Social images fall back from og_image to meta_image to the 1200 × 630 foundation card. Canonicals, Open Graph URLs, Twitter cards and JSON-LD use the configured origin. Previewed documents are noindex.

The local models have been updated using the Prismic CLI. The pillar model, images, and homepage content (including its SEO defaults) were uploaded using the API fallback and published on 23 September 2026. The CLI could not access the repository and does not support asset/content migration. About and Contact SEO payloads remain prepared locally.

## Crawler files and branding

- /sitemap.xml: published, indexable Prismic pages, canonical paths, actual publication timestamps, five-minute cache.
- /robots.txt: environment-aware crawling rules; excludes API routes and the slice simulator.
- /llms.txt: a plain-text directory of published, indexable pages. It is not a search-ranking guarantee.
- /manifest.webmanifest: foundation name and icons.
- /favicon.ico, /icon.png, /apple-icon.png and /icons/icon-{192,512}.png: derived from the existing Prismic foundation logo.
- /images/social-card.png: branded default social sharing image.
- JSON-LD: NGO, WebSite, page-specific WebPage subtype and BreadcrumbList, with escaped JSON and consistent entity IDs.
- /homepage permanently redirects to /; missing pages return 404 and noindex.

No personal, business, address, ratings or analytics data was copied from the reference website. The organization name and logo come from the foundation's layout document.

## Content migration

Dry runs make no Prismic changes:

```sh
node --env-file=.env.local scripts/prismic/sync-pillars.mjs
node --env-file=.env.local scripts/prismic/sync-seo.mjs --skip-homepage
```

After the API fallback is authorized, add `--apply` to each command. The first includes the homepage's pillar content and SEO together. The second skips the homepage so it cannot overwrite the pillar draft. Both preserve existing published data and editorial SEO values, back up their input and save drafts without publishing the migration release. Review unpublished editorial changes before applying. Do not blindly publish a migration release containing unrelated documents.

The three pillar images are clearly captioned illustrations. Actual project photographs, the optional additional photographs, and the ten deity names remain to be supplied.

## Repeat verification

```sh
NEXT_PUBLIC_SITE_URL=http://localhost:3100 npx next build --webpack
NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run start -- --port 3100
AUDIT_BASE_URL=http://localhost:3100 npm run seo:verify
AUDIT_BASE_URL=http://localhost:3100 AUDIT_OUTPUT=reports/lighthouse/final npm run seo:audit
```

The audit discovers every page from the sitemap and runs Lighthouse's standard mobile and desktop configurations. Reports are saved locally as HTML/JSON and ignored by git. Set CHROME_PATH if Chrome cannot be found automatically.

The separate verifier checks metadata uniqueness, canonicals, social tags, JSON-LD, H1 counts, internal link responses, sitemap, robots, llms, manifests/icons, redirect behavior, simulator noindex and 404 status. Browser checks cover mobile overflow and menu opening. The contact form is inspected without sending an email.

Lighthouse checks and local JSON parsing do not establish search indexing or eligibility for rich results. After production deployment, check the real URLs in [Google's Rich Results Test](https://search.google.com/test/rich-results) and Search Console. See [Lighthouse documentation](https://developer.chrome.com/docs/lighthouse/overview) and [Google's organization structured-data guide](https://developers.google.com/search/docs/appearance/structured-data/organization).
