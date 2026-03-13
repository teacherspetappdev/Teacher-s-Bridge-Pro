# Recipe: Add Supabase Backend

Add Supabase (PostgreSQL) backend with RLS, Auth, and RAG pipeline.

## When to Use

- User needs cloud-based data persistence
- Application requires authentication with Supabase Auth
- Need vector embeddings for RAG/lLM applications

## Prerequisites

- Supabase project created at supabase.com
- Supabase URL and keys obtained from project settings

## Setup Steps

### Step 1: Install Dependencies

```bash
bun add @supabase/supabase-js @supabase/ssr @supabase/postgrest-js
```

### Step 2: Configure Environment

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Step 3: Run Schema

Execute `supabase/schema.sql` in Supabase SQL Editor to create:
- `profiles` table with auto-creation trigger
- `curriculum_docs` table with vector column
- `lesson_plans` table
- RLS policies for all tables
- Vector similarity search function

### Step 4: Use the Clients

```typescript
// Server components/actions
import { createClient } from "@/supabase/server";
const supabase = await createClient();

// Client components
import { createClient } from "@/supabase/client";
const supabase = createClient();

// Admin (bypass RLS)
import { createAdminClient } from "@/supabase/admin";
```

## Usage Examples

### Auth

```typescript
import { getSession, getUser, requireAuth } from "@/supabase/auth";

const session = await getSession();
const user = await requireAuth();
```

### Database Operations

```typescript
import { getUserDocuments, storeDocument, searchDocuments } from "@/lib/rag";
import { getLessonPlans, createLessonPlan } from "@/lib/db/lesson-plans";

const docs = await getUserDocuments(user.id);
await storeDocument(user.id, "Title", "Content");
const results = await searchDocuments("query");

const plans = await getLessonPlans(user.id);
await createLessonPlan(user.id, { title: "Lesson 1", ... });
```
