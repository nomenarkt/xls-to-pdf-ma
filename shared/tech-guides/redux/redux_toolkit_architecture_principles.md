# Modern Redux Toolkit Architecture Principles

## 🔁 Core Principles
- Favor **mutability with safety** via Immer—no more manual immutable updates.
- **Slice-first thinking**: colocate state, reducers, and actions in feature-based slices.
- Treat Redux Toolkit as an **opinionated, default-safe state platform**, not just a library.
- Keep business logic and side effects in **thunks or RTK Query endpoints**—not UI.

## 🧩 Design Patterns
- **Feature-first foldering**:
```

/features/
/cart/
cartSlice.ts
cartThunks.ts
cartSelectors.ts

```
- **RTK Query for async workflows**:
- `createApi` to define endpoints and inject hooks (`useGetXYZQuery`)
- **Normalized Entity Management**:
- Use `createEntityAdapter` for lists, maps, and pagination patterns
- **Thunk Composition**:
- Chain dispatches, read from `getState`, or guard with conditionals

## ✅ Do
- Use `createSlice` with type-safe initial state and reducers
- Group logic by domain, not by action type or store module
- Extract complex async flows into typed thunks
- Use RTK Query wherever API integration is needed
- Define selectors in feature slices to hide state shape from components
- Use `createEntityAdapter` when managing collections

## 🚫 Don’t
- Don’t handwrite action creators or reducers—use `createSlice`
- Don’t dispatch thunks or async actions directly from components without encapsulation
- Don’t spread Redux state across files—group it by feature
- Don’t use `connect()` HOC or class components—use hooks (`useSelector`, `useDispatch`)
- Don’t colocate API logic inside slices—use RTK Query `createApi` instead

## 📚 Codex Use Cases
Codex should use this when:
- Scaffolding Redux feature slices in `/features/` with `createSlice`
- Creating async workflows via typed thunks or RTK Query
- Building collections with `createEntityAdapter` and pagination selectors
- Reviewing slice file structure for colocated actions, reducers, and selectors
- Refactoring legacy Redux into Toolkit conventions
