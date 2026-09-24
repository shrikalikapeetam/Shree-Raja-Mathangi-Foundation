# Trust Members

The `TrustMembers` slice renders an introduction beside a list of circular portraits, names, roles, professional descriptions, and places. It stacks on smaller screens and uses the existing foundation palette and spacing.

Prismic fields:
- `anchor_id` (homepage value: `trustees`)
- `pre_title`, `title`, `description`
- `members`: repeatable group containing `profile_image`, `name`, `title`, `description`, `place`
- `image_caption`: editable note identifying illustrative photographs

The homepage contains the four supplied trustees. Uploaded portraits are AI-generated fictional placeholders, not photographs of the named people. Replace each profile image with an approved actual portrait before removing the caption.

Component: `src/slices/TrustMembers/index.tsx`. Registered in the generated slice registry and the public server registry.

`node --env-file=.env.local scripts/prismic/sync-trust-members.mjs` prepares homepage data. `--apply` uploads only this model and its images, merges its availability into the remote Page model, and saves a migration draft. It preserves other published homepage content and exits without overwriting if the section already exists. The first content update was published through the Prismic editor.
