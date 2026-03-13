# Active Context: Supabase Backend with RAG Pipeline

## Current State

**Template Status**: ✅ Supabase backend configured

The template now has Supabase integration with PostgreSQL, RLS policies, and RAG pipeline for document embeddings.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Supabase backend setup
- [x] Tables: profiles, curriculum_docs, lesson_plans
- [x] Row Level Security policies (user isolation)
- [x] RAG pipeline with vector embeddings
- [x] Supabase Auth integration

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |
| `src/supabase/client.ts` | Browser client | ✅ Ready |
| `src/supabase/server.ts` | Server client | ✅ Ready |
| `src/supabase/admin.ts` | Admin client (RLS bypass) | ✅ Ready |
| `src/supabase/auth.ts` | Auth utilities | ✅ Ready |
| `src/supabase/types.ts` | TypeScript types | ✅ Ready |
| `src/lib/rag/` | RAG pipeline | ✅ Ready |
| `src/lib/db/` | DB operations | ✅ Ready |
| `supabase/schema.sql` | SQL schema + RLS | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| Current | Added Supabase backend with profiles, curriculum_docs, lesson_plans tables, RLS policies, and RAG pipeline |
