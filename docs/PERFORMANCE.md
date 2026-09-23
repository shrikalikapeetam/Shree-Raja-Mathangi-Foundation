# Mobile performance check — 23 September 2026

| Environment | Performance | LCP | Blocking time | Layout shift |
| --- | ---: | ---: | ---: | ---: |
| Before: localhost:3000 development | 68 | 8.2 s | 330 ms | 0 |
| After: localhost:3000 development | 70 | 8.1 s | 250 ms | 0 |
| After: localhost:3200 production | 94 | 3.1 s | 50 ms | 0 |

These are individual Lighthouse mobile lab runs. Production and development scores are different environments, not a before/after code comparison. Development includes Next.js tooling and unminified code; production removes those automatically. No production baseline was measured for this change.

## Changes

- Public pages use direct server-side slice imports in src/slices/server.ts. Slice Machine retains its generated dynamic registry for the simulator. Its registry keys are type-checked against the public registry; add future slices to both.
- Portrait image is cropped by the CDN to match the existing 2:3 display ratio; image quality is set to 40 against Prismic's already compressed default. The sampled portrait response fell from 74,211 to 55,012 bytes.
- Pillar images use the same modest compression setting, and responsive sizes account for container padding and column gaps. Smaller 384px/480px image candidates are available. Initial image transfers fell from 140,693 to 118,795 bytes (about 16%).
- Removed a stale reference to the deleted pillar note field, restoring a passing production build.
- NEXT_BUILD_DIR allows isolated builds without replacing the active development server's output.

## Validation and remaining opportunities

Lint, production build/type checking, and the SEO route/link verifier pass. Production accessibility, best practices and SEO all score 100. The optimized portrait was visually inspected.

Production still reports LCP of 3.1 seconds and roughly 51 KiB of unused JavaScript. Further optimization should profile the interactive navigation/Sheet and button dependencies before adding more code splitting. The portrait already has high fetch priority and eager loading when near the top of the page.

Do not enable search indexing on localhost to improve its SEO score; the development noindex behavior is intentional. Lighthouse reports are under reports/lighthouse/local-mobile/ (ignored by git).

## Reproduce production testing

```sh
NEXT_BUILD_DIR=.next/performance NEXT_PUBLIC_SITE_URL=http://localhost:3200 npx next build --webpack
NEXT_BUILD_DIR=.next/performance NEXT_PUBLIC_SITE_URL=http://localhost:3200 npm run start -- --port 3200
```

Use the real production origin for deployments; localhost here is only the audit origin.
