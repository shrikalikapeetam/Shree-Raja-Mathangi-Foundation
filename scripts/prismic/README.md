# Three Pillars homepage content

The `PillarFeature` slice is connected to the Page slice zone. The supplied content is stored in `pillar-content.mjs`; three realistic slice examples are in `src/slices/PillarFeature/mocks.json`.

The optional `additional_image` field supports a second project photograph. It is intentionally empty until another photograph is supplied. The ten Dasa Maha Vidhya names are also pending; none have been invented.

## Prepare the homepage update

```sh
node --env-file=.env.local scripts/prismic/sync-pillars.mjs
```

This reads the current homepage and prepares an update under `.slicemachine/pillar-migration/`. It inserts three pillars immediately after the hero, preserves other page fields and slices, and uses the existing Contact page for support inquiries. It does not change Prismic.

## Apply the prepared content

```sh
node --env-file=.env.local scripts/prismic/sync-pillars.mjs --apply
```

Requires `PRISMIC_WRITE_TOKEN`. This uploads only the pillar slice model, adds its choice to the remote Page model, uploads three images, and saves a homepage draft in Prismic's migration release. It never publishes a release automatically. Review the existing homepage draft and migration release before applying or publishing to avoid replacing unpublished editorial work.

Backups and uploaded asset IDs are retained in `.slicemachine/pillar-migration/` to support review and reruns. That directory is ignored by git.

## Featured images

The three PNGs in `public/images/pillars/` were generated with the built-in image-generation tool from the approved mockup. They are illustrations, not photographs of the named projects, and their CMS captions and asset notes say so. Replace them with supplied project photographs when available.

Prompt: Recreate the corresponding cow shelter, Vedic classroom, or South Indian temple photograph from the mockup as a standalone 1536×1024 landscape illustrative image, retaining its composition and removing UI, text, captions, borders, and watermarks. The images must not be represented as documentary evidence of a named institution.

## SEO migration

The homepage payload also fills empty SEO/social fields and merges missing SEO model fields. Prepare the other pages with:

```sh
node --env-file=.env.local scripts/prismic/sync-seo.mjs --skip-homepage
```

The same `--apply` switch saves drafts after API fallback authorization. Keep `--skip-homepage` when combining this with the pillar migration, so the homepage draft is written only once. Neither script publishes a release. See ../../docs/SEO.md for configuration and audit details.
