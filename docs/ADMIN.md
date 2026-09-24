# Donation pledges and foundation admin

The donation modal opens from Donate, Sponsor and the three pillar support controls. Volunteer remains a link to Contact. The selected pillar is preselected in its modal. The form records a **pledge**, not a completed payment; no payment gateway or tax-exemption claim is included.

## Connect services

Use a dedicated PostgreSQL database for this foundation. Do not point this app at the reference project's database: auth table names intentionally match the Better Auth conventions.

Set these values in `.env.local` and the hosting environment:

- `DATABASE_URL`: PostgreSQL connection URL.
- `BETTER_AUTH_SECRET`: strong random secret, at least 32 characters.
- `BETTER_AUTH_URL`: full site origin (`http://localhost:3000` locally).
- `ADMIN_EMAILS`: comma-separated approved administrator addresses.
- `DONOR_DATA_KEY`: separate 32-byte base64 key, generated with `openssl rand -base64 32`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: sender used for admin login codes and existing contact notifications.

Local auth/encryption secrets were generated without printing them. Keep `DONOR_DATA_KEY` backed up securely: changing it without re-encrypting existing records makes stored PAN values unreadable. Never expose these values through `NEXT_PUBLIC_` variables.

Run `npm run db:migrate`, then restart the application. `npm run db:generate` is available for subsequent schema changes. Migrations are committed under `drizzle/`.

## Admin flow

Visit `/sign-in`, enter an allowlisted email, then enter the emailed six-digit code. Codes expire after five minutes and allow three attempts. Authentication is database-rate-limited. Sessions last eight hours; authorization is checked again in every admin page and status action.

- `/admin`: totals and awaiting-review counts.
- `/admin/donations`: paginated pledges, search by name/email, filter by status.
- `/admin/donations/[id]`: donor contact details, amount, cause, optional PAN and follow-up status.
- `/admin/contact-messages`: paginated contact inquiries.
- `/admin/activity`: paginated submission, status-change and session activity.

Statuses are `new`, `contacted`, and `closed`; these are follow-up states, never payment confirmation. PAN is encrypted at rest and is only decrypted on the authenticated detail page. Public submission responses never return donor data.

## Submission behavior

`POST /api/donations` validates the input on the server, stores amounts in integer paise, accepts optional PAN, limits requests, and uses a UUID request ID to prevent duplicates when retrying the same open form. Donation records and their activity entries are saved in one transaction. Missing configuration or database failures return a visible error rather than a success message.

Contact inquiries are saved before email delivery. If notification email fails after storage, the user still receives success because the inquiry is available in admin; this prevents duplicate retries. Before a database is configured, the existing email-only contact flow is preserved. Once configured, storage is required before a successful response. Historical email-only submissions cannot automatically appear in this database.

## Verification

- `node --experimental-strip-types --test tests/donations.test.mjs`
- `npm run lint`
- `npm run build`

Before launch, configure services and verify: allowlisted email OTP login; unapproved email denial; successful pledge and inquiry persistence; refresh/list/detail views; follow-up update and activity log; sign-out and expired sessions; SMTP notification delivery. Current setup cannot complete those service-dependent checks without the database, admin address and SMTP credentials.

Authentication follows the same Better Auth/Drizzle/PostgreSQL pattern as the reference project. Relevant upstream documentation: https://better-auth.com/docs/plugins/email-otp and https://better-auth.com/docs/reference/options.
