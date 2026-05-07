# Content Broadcasting System Frontend

A professional, robust content broadcasting system frontend built with Next.js 14 (App Router), JavaScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Axios, and React Query.

## Features

- Role-based dashboards for Teacher and Principal
- Secure authentication with JWT (mocked)
- Content upload, approval, and live public view
- Complete mock API layer (in-memory/localStorage)
- Responsive, clean UI with shadcn/ui and Tailwind
- Skeleton loaders, toasts, modals, and error handling
- Pagination, filtering, and search for large datasets

## Tech Stack

- Next.js 14 (App Router)
- JavaScript (ES6+)
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- Axios + React Query

## Folder Structure

```
src/
  app/
    (auth)/login/
    (dashboard)/teacher/
    (dashboard)/principal/
    live/[teacherId]/
  components/
    ui/
    shared/
    teacher/
    principal/
  services/
    api.js
    auth.service.js
    content.service.js
    approval.service.js
  hooks/
    useAuth.js
    useContent.js
    useApproval.js
  context/
    AuthContext.jsx
  utils/
    validators.js
    formatters.js
  lib/
    queryClient.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

See `Frontend-notes.txt` for architecture, authentication, routing, API, and state management details.

---

- Teacher login: `teacher@school.com` / `password123`
- Principal login: `principal@school.com` / `password123`
