# Wisekew

A course marketplace and exam-prep platform (Udemy + Gleim style): video courses, structured question banks, timed practice exams, progress tracking, and certificates.

## Prerequisites

Install these two things before anything else:

1. **Node.js 20 or later** — [nodejs.org](https://nodejs.org) (LTS version)
2. **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) (used to run the Postgres database — no manual Postgres install needed)

After installing Docker Desktop, **open it and make sure it's running** (you'll see a whale icon in your system tray/menu bar) before continuing — the setup steps below will fail silently or hang if Docker isn't actually running yet.

## Setup (first time only)

Run these commands **in order**, from the project folder, in a terminal:

```bash
docker compose up -d
```
Starts the Postgres database in the background. First run downloads the Postgres image, which can take a minute or two.

```bash
npm install
```
Installs all dependencies. This also runs `prisma generate` automatically at the end — if that step fails, it usually means step 1 didn't finish yet.

```bash
cp .env.example .env
```
Creates your local environment file from the template. (On Windows Command Prompt, use `copy .env.example .env` instead — PowerShell and Git Bash can both use `cp`.)

```bash
npm run db:migrate
```
Creates the database tables. When prompted for a migration name, you can just press Enter — the schema is already defined, this applies the existing migration.

```bash
npm run db:seed
```
Fills the database with demo data: sample courses, an exam question bank, and test accounts (see below).

```bash
npm run dev
```
Starts the app. Open **[http://localhost:3000](http://localhost:3000)**.

## Running it again later

Once the first-time setup above is done, you only need two commands to come back to it:

```bash
docker compose up -d
npm run dev
```

(Docker Desktop still needs to be running first.)

## Seeded accounts (password: `password123` for all)

| Role       | Email                    |
|------------|--------------------------|
| Admin      | admin@wisekew.com        |
| Instructor | instructor@wisekew.com   |
| Student    | student@wisekew.com      |

Seed data includes a video course, a full CPA exam-prep course (with a question bank and a timed practice exam), and 7 additional exam-prep courses (CMA, CIA, EA, FMAA, CPE, AFSP, IAP).

## Troubleshooting

- **`docker compose up -d` hangs or errors** — Docker Desktop isn't running yet. Open the Docker Desktop app and wait for it to fully start (whale icon stops animating), then retry.
- **Port 5432 already in use** — you already have another Postgres running locally. Either stop it, or change the port mapping in `docker-compose.yml`.
- **Port 3000 already in use** — another app (or a previous `npm run dev`) is using that port. Stop it, or Next.js will offer to use 3001 instead.
- **`npm install` fails on `prisma generate`** — the database container isn't reachable yet. Confirm `docker compose ps` shows the `db` service as `healthy`, then run `npx prisma generate` manually.
- **Blank/broken page, nothing clickable** — if you're accessing the site from a different device on your network (not `localhost`), see the comment in `next.config.ts` about `allowedDevOrigins`.

## Stack

- Next.js 16 (App Router, TypeScript), Server Actions for mutations
- PostgreSQL via Docker Compose
- Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`)
- Auth.js (NextAuth v5) — credentials login, role-based access (STUDENT / INSTRUCTOR / ADMIN)
- Tailwind CSS + shadcn/ui (Base UI primitives)

Payments and video hosting are stubbed for local prototyping:
- "Enroll" creates a mock `Payment` (`provider: "MOCK"`) + `Enrollment` — no real charge. Swap in Stripe later.
- Lectures accept a video URL (YouTube/Vimeo/mp4) or a direct file upload saved to `public/uploads` — fine for a prototype, not production storage.

## Scripts

- `npm run dev` / `npm run build` / `npm run start`
- `npm run db:push` — push schema without a migration (quick iteration)
- `npm run db:migrate` — create/apply a migration
- `npm run db:seed` — re-run the seed script
- `npm run db:studio` — open Prisma Studio (visual database browser)

## Project structure

- `src/app` — routes: public catalog/course pages, `/dashboard` (student), `/instructor` (course + exam authoring), `/admin`
- `src/lib/actions` — server actions (courses, enrollment, exams, auth)
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — demo data
