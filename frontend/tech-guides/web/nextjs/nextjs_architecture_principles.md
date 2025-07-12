# Real-World Next.js Architecture Principles

## 🔁 Core Principles
- Prioritize **developer experience and performance** together—SSR and static must co-exist.
- Embrace **file-based routing** and component modularity.
- Favor **progressive enhancement** and **edge-ready architecture**.
- All components should be **predictably colocated by route or domain**.
- Separate **server** vs **client** responsibilities clearly using RSC boundaries.

## 🧩 Design Patterns
- **Route Group Structure**:
  - Group features inside `/app/(group)/[page|layout].tsx`
  - Use `@` or `_` prefixes for private routes or shared layout wrappers
- **Segmented Data Fetching**:
  - Use `getServerSideProps`, `generateStaticParams`, or `fetch()` within RSC boundaries
- **RSC + Client Component Boundaries**:
  - Pure UI = Server Component
  - Interactive logic = `use client` with `useEffect`, `useState`, etc.
- **API Layer**:
  - Co-locate handlers inside `/app/api/[route]/route.ts`
  - Use Zod + TRPC/OpenAPI contracts to validate requests/responses

## ✅ Do
- Co-locate `page.tsx`, `layout.tsx`, and `loading.tsx` inside feature folders
- Use `generateStaticParams()` for dynamic static routes
- Use `revalidate` tag in fetch for ISR patterns
- Wrap client logic in `use client` + extract to `ClientComponent.tsx`
- Split concerns via `/components/ui/`, `/components/shared/`, `/lib/`, `/hooks/`
- Use `export const dynamic = 'force-dynamic'` or `'force-static'` when needed

## 🚫 Don’t
- Don’t mutate request/response objects directly—use helpers and wrappers
- Don’t overuse `useEffect` in Client Components—prefer Server-first rendering
- Don’t put `fetch()` calls inside Client Components
- Don’t skip route loading/suspense boundaries—leads to poor UX
- Don’t flatten your folder structure—groups > sprawl

## 📚 Codex Use Cases
Codex should use this when:
- Scaffolding new routes in `/app/` with RSC and Client split
- Creating API handlers in `/app/api/` with validation schemas
- Reviewing SSR/static/data fetch boundaries
- Organizing component layers (UI, shared, feature-specific)
- Applying `generateStaticParams`, `revalidate`, or `cache` strategies
