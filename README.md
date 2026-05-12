# Liberty Digital Consulting Services

Premium Next.js service website and lightweight lead-tracking admin dashboard for Liberty Digital Consulting Services.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Supabase Auth
- Prisma + Supabase Postgres
- React Hook Form + Zod
- Resend-ready email notifications

## Required environment variables

Copy `.env.example` into `.env.local` and fill in:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

## Local development

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Push the Prisma schema to the database:

```bash
npm run db:push
```

Start the development server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

## Database models

The project includes:

- `Lead`
- `LeadNote`
- `LeadActivity`

Prisma schema:

- `prisma/schema.prisma`

## Supabase auth setup

This app does not expose public signup.

Create admin users manually in Supabase:

1. Open your Supabase project.
2. Go to Authentication.
3. Create a user manually with email and password.
4. Use that account at `/login`.

The admin area is protected at:

- `/admin`
- `/admin/leads`
- `/admin/leads/[id]`

## Lead workflow

1. A visitor opens a service page.
2. The visitor submits a service-specific form.
3. The request is validated with Zod.
4. A lead is created in the database.
5. A lead activity entry is logged.
6. Admin email notification is sent when email env vars are configured.
7. Admin reviews and updates the lead from the dashboard.

## Notes

- Public service content is centralized in `src/lib/services.ts`.
- Lead submission logic lives in `src/actions/lead-actions.ts`.
- Admin lead-management actions live in `src/actions/admin-lead-actions.ts`.
- Build uses `next build --webpack` for compatibility with the current local Windows environment.
