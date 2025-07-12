# React Native Architecture Principles

## 🔁 Core Principles
- Mobile UIs should be built from **composable, reusable components**.
- Prefer **cross-platform consistency** with platform-specific overrides only when needed.
- Keep **business logic out of the UI**—separate concerns cleanly.
- React Native projects benefit from **single-responsibility components and screens**.

## 🧩 Design Patterns
- **Container–Presentational split**:
  - Containers manage state, effects, and props.
  - Presentational components are stateless and purely UI-driven.
- **Modular feature structure**:
```

/features/
/auth/
LoginScreen.tsx
useLogin.ts
authService.ts

```
- **Navigation encapsulation** using `react-navigation`:
- StackNavigator per domain
- Central route registry with type safety
- **State + API layers**:
- `useXYZQuery()` for data fetching (React Query or SWR)
- `context` or `zustand` for app-wide state

## ✅ Do
- Use `StyleSheet.create` or Dripsy/nativewind for consistent styling.
- Use `SafeAreaView`, `KeyboardAvoidingView`, and `ScrollView` appropriately.
- Abstract common UI (e.g., `Button`, `TextInput`, `Header`) into `/components/`.
- Handle side effects (navigation, storage, analytics) in containers or hooks.
- Prefer async/await with `try/catch` for all API calls.
- Use platform checks (`Platform.OS === 'ios'`) sparingly and clearly.

## 🚫 Don’t
- Don’t embed async logic or business logic in `render()` or JSX directly.
- Don’t use `setState` inside API callbacks—prefer `useState` updates through effects.
- Don’t assume component reuse across platforms without testing.
- Don’t mix navigation logic with view logic—encapsulate in handlers or `useNavigation`.

## 📚 Codex Use Cases
Codex should use this when:
- Scaffolding feature folders under `/mobile/features/`
- Creating screens or navigators with `react-navigation`
- Building shared UI components in `/mobile/components/`
- Integrating hooks or services in `/mobile/hooks/` or `/mobile/services/`
- Reviewing PRs for state-isolation and render hygiene
```
