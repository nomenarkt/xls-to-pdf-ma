# Frontend Architecture for Design Systems

## 🔁 Core Principles
- Architecture serves collaboration: facilitate smooth designer–developer–PM workflows.
- Structure UI code by **responsibility**, not technology.
- Encourage **reusability through composability** and clear abstraction layers.
- Your architecture should be **tool-agnostic**: don’t tie foundational decisions to frameworks.
- Treat design systems as **living products**—versioned, maintained, documented.

## 🧩 Design Patterns
- **The Four Layers Model**:
  1. **Content**: HTML, data, structure (e.g., Markdown, CMS blocks)
  2. **Presentation**: CSS, tokens, themes (Tailwind, SCSS variables)
  3. **Behavior**: JavaScript interactivity, user events (e.g., modals, accordions)
  4. **Data**: APIs, state, models (React Query, Redux, stores)
- **Atomic Design-inspired component structure**:
  - *Atoms*: Buttons, inputs, icons
  - *Molecules*: Input groups, cards
  - *Organisms*: Modals, navbars
  - *Templates*: Layouts with empty data
  - *Pages*: Routed containers with real data

## ✅ Do
- Use `design tokens` for consistent spacing, colors, and typography.
- Document components and variants with stories, props, and visual examples.
- Separate **data-fetching logic** from presentation components.
- Create shared utility hooks (e.g., `useDialog`, `useFormErrors`) in `/shared/`.
- Write **testable**, pure presentational components (zero side effects).
- Organize files by **domain or feature**, not by type alone (`/features/auth/Form.tsx` > `/components/Form.tsx`).

## 🚫 Don’t
- Don’t embed fetch logic or business rules in UI components.
- Don’t use unscoped global styles—prefer tokens, modules, or BEM.
- Don’t let CSS cascade chaos reign—use encapsulated patterns (CSS-in-JS, utility classes).
- Don’t duplicate token values (e.g., hardcoded colors, padding).
- Don’t build unversioned or undocumented design systems.

## 📚 Codex Use Cases
Codex should use this when:
- Creating or reviewing UI components in `/web/components/` or `/mobile/components/`
- Structuring `/shared/` layers between platforms
- Building systems with Tailwind, Dripsy, or theme-based styling
- Designing reusable inputs, dialogs, or layout shells
- Documenting components in Storybook or MDX
- Implementing role-based visual variants via props or tokens
