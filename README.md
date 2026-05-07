# Content Broadcasting System (CBS) — Frontend

A professional content broadcasting platform where teachers upload educational content for principal approval, which then appears on a live public display.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Teacher | teacher@school.com | password123 |
| Principal | principal@school.com | password123 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query v5 |
| HTTP | Axios |
| Toasts | Sonner |
| Icons | Lucide React |

> **Note:** shadcn/ui was not installed as a dependency. All UI components (StatCard, StatusBadge, Skeleton, Modal, etc.) are custom-built to match the design spec. The component architecture mirrors shadcn/ui conventions.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login`.

## Project Structure

```
src/
  app/
    (auth)/login/           # Login page (no layout)
    (dashboard)/
      teacher/
        dashboard/          # Stats + recent uploads
        upload/             # File upload with preview
        my-content/         # Paginated content list with filters
      principal/
        dashboard/          # Stats + pending items preview
        pending/            # Approve / reject with modal
        all-content/        # Full table with search + pagination
    live/[teacherId]/       # Public display page (no auth, 30s polling)
  components/
    shared/                 # Navbar, Sidebar, AuthGuard
    ui/                     # StatCard, StatusBadge, Skeleton, Modal, etc.
  services/
    auth.service.js         # Mock auth (localStorage)
    content.service.js      # Mock content CRUD (localStorage)
    approval.service.js     # Approve/reject mutations
  hooks/
    useAuth.js              # Login/logout
    useContent.js           # Queries + mutations for content
  context/
    AuthContext.jsx         # Global auth state
  utils/
    validators.js           # Zod schemas
    formatters.js           # Date/time helpers
  lib/
    queryClient.js          # TanStack Query client (singleton)
```

## Features

- **Role-based routing**: Teachers see upload/manage pages; principals see approval/review pages. `AuthGuard` redirects on wrong role or missing session.
- **Teacher flow**: Upload content (title, subject, description, schedule, image file) → awaits principal approval → appears on live display if approved and within schedule window.
- **Principal flow**: Review pending items with approve or reject (rejection requires a reason). All content visible in a searchable, filterable table.
- **Live display** (`/live/[teacherId]`): Public page (no login), polls every 30 s, shows Scheduled / LIVE / Expired badges based on current time vs. start/end timestamps.
- **Skeleton loaders** on every async section; **toast notifications** (Sonner) on all mutations.
- **Responsive**: Table columns collapse on mobile; sidebar collapses to icon-only mode.

## Assumptions & Limitations

### Mock API (no real backend)
All data is stored in **`localStorage`** under the key `cbs_content`. The mock layer (`content.service.js`) ships with 18 seed items (6 approved, 7 pending, 5 rejected) that are written on first load. Clearing browser storage resets all data.

There is no real server, database, or file upload endpoint. The "file upload" stores the browser `File` object reference in memory only — it does not persist across page refreshes. The displayed image URLs in seed data point to `picsum.photos` for demonstration.

### Authentication
Auth is fully mocked. `auth.service.js` checks credentials against a hardcoded list and stores `{ id, name, role }` in `localStorage`. There are no JWT tokens, refresh flows, or CSRF protection.

### Schedule / Live logic
`getScheduleStatus(startTime, endTime)` computes badge state from `Date.now()` at render time — there is no server-side clock sync. A content item is considered **active** when the current time is between `startTime` and `endTime`.

The live page auto-refreshes every 30 seconds via `refetchInterval` in TanStack Query. It does not use WebSockets or SSE.

### Pagination
Pagination is client-side only — all matching records are returned from localStorage, then sliced in the component. This is fine for a demo dataset but would not scale to large collections.

### No real file storage
Uploaded files are not stored anywhere persistent. The `fileUrl` field on new uploads will be empty; only seeded items have `picsum.photos` thumbnails.

### Tailwind CSS v4
This project uses **Tailwind v4** which has breaking changes from v3:
- Config via `@import "tailwindcss"` in CSS (no `tailwind.config.js`)
- Canonical utility names differ: `bg-linear-to-br` (not `bg-gradient-to-br`), fractional sizes like `h-4.5`

### Browser compatibility
Tested in modern Chromium-based browsers. Not tested in Safari or Firefox.
