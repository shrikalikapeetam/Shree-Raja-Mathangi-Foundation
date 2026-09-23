# SEO audit — 23 September 2026

Production build tested locally at http://localhost:3100 using Lighthouse 12.8.2. All three currently published Prismic pages were audited with standard mobile and desktop configurations.

| Page | Device | Performance | Accessibility | Best practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| /about | mobile | 97 | 100 | 100 | 100 |
| /about | desktop | 100 | 100 | 100 | 100 |
| /contact | mobile | 97 | 100 | 100 | 100 |
| /contact | desktop | 100 | 100 | 100 | 100 |
| / | mobile | 93 | 100 | 100 | 100 |
| / | desktop | 100 | 100 | 100 | 100 |

## Verified fixes

- Removed production build type errors in Footer, ImpactOverview and ValuesActions.
- Added page metadata, social tags, canonicals, typed JSON-LD, sitemap, robots, llms.txt, foundation icons and social card.
- Fixed image alternative text, heading hierarchy, accessible brand-link names and text contrast.
- Prioritized the early profile image and added intermediate responsive image sizes.
- Footer actions now use CMS destinations; missing destinations are disabled.
- Verified all internal anchor destinations, one H1 per page, unique titles/descriptions, schema entity links, crawler routes, icons, /homepage redirect, missing-page 404 and simulator noindex.
- Mobile menu opens correctly; published pages fit a 390px viewport.
- All three prepared pillar slices render in the embedded Slice Simulator without mobile overflow. Local mock images use Next Image; uploaded Prismic images use the Prismic image component.

## Remaining limits

The production domain is not yet confirmed. The Prismic field/content/image uploads are prepared but not applied; API fallback authorization is pending. The three new pillars are not part of the published-page Lighthouse scores.

Lighthouse still reports framework JavaScript/polyfill opportunities and some image-transfer savings. Mobile performance is a lab result and varies with network/cache conditions; desktop performance is 100. The audit does not prove real-user Core Web Vitals, search indexing or rich-results eligibility. Rerun against the final deployment and after publishing the pillar content.

Header and footer donation/volunteer destinations are empty in published Prismic content. One homepage Go Samrakshnam link references an unpublished document. Configure these CMS links when publishing the pillars; no arbitrary payment destinations were invented.

HTML and JSON reports: reports/lighthouse/final/. Configuration and repeatable commands: [SEO.md](SEO.md).

## Publication update

On 23 September 2026 at 15:42 UTC, the three pillar slices, their images and complete homepage content were published in Prismic. The published homepage now has seven slices, including the three pillars immediately after the hero. Content API and local homepage rendering were verified. The Lighthouse scores above predate this content publication.
