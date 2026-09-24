# Slice decoration and motion

All ten slices use `AnimatedSection` with server-rendered children and a decorative `SectionOrnament`. No animation library or CMS field changes are required.

- Hero: sun linework, a drawing accent rule, and a small settling movement on the badge and actions. The heading is never hidden.
- Featured profile: botanical detail, soft image reveal, and separate copy/callout entrances.
- Pillar feature: architectural linework; image and copy enter from their respective sides; initiative items stagger.
- Feature grid: geometric detail, staggered cards, and restrained hover lift.
- Foundation overview: concentric detail, image reveal, staggered statements, and an accented highlight panel.
- Initiative feature: botanical detail, growing heading rule, staggered statements, and a quiet callout entrance.
- Impact overview: concentric linework, panel reveal, and staggered numbered statements.
- Vision/mission: paired directional reveals and subtle hover emphasis for pillar cards.
- Trust members: botanical detail, staggered profiles, portrait outlines, and subtle portrait hover zoom.
- Contact inquiry: architectural detail and contact-detail reveals. Form fields remain stationary.

`data-reveal` supports up, left, right, image, line, settle, and fade. `data-stagger` staggers direct children by up to 90 ms. Reveals play once per mounted element, use transform/opacity only, and leave content visible without JavaScript. Content already visible at hydration is not faded out. Reduced-motion preferences skip reveals and hover movement; changing that preference cancels running animations. Keyboard focus also cancels an animation around the focused element.

Browser checks covered Home, About, and Contact at desktop and narrow viewport widths with no horizontal overflow. TypeScript and lint checks passed. Reduced-motion handling is implemented but was not emulated in the browser verification.

Header and footer share the visual treatment: navigation underline accents, a gold scroll separator, gentle brand hover, and botanical/architectural footer linework with staggered support cards. Entrances begin 40px before the viewport, using 14px movement (10px for images) and 560–720ms easing. No continuous animation runs.
