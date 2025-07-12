# Vue 3 Architecture & Design Principles

## 🔁 Core Principles
- Favor **composition over configuration** using the Composition API.
- Structure apps around **single-responsibility components** and **feature modules**.
- Promote **reactivity, declarative rendering**, and **separation of concerns**.

## 🧩 Design Patterns
- **Feature-based structure**:
```

/features/
/auth/
LoginForm.vue
useLogin.ts
authService.ts

```
- **Component Split**:
- UI logic in `.vue` files (template + script + style)
- Business logic in composables (`/composables/useFeature.ts`)
- **State Management**:
- Use `Pinia` as store framework
- Colocate stores inside features or `stores/` root
- **Routing**:
- Define routes by feature in `router/index.ts`
- Lazy-load route components via `defineAsyncComponent`

## ✅ Do
- Use `setup()` with the Composition API
- Extract business logic into composables (e.g. `useAuth`, `useCart`)
- Scope styles using `<style scoped>`
- Use `defineProps` and `defineEmits` for prop contracts
- Validate with `vee-validate` or `Zod` in composables
- Lazy-load components and routes when possible

## 🚫 Don’t
- Don’t mix logic in templates—use computed or methods
- Don’t overuse global state—prefer local state or scoped stores
- Don’t directly mutate props—use `v-model` or `emit`
- Don’t nest deeply reactive logic in templates—extract to composables
- Don’t rely on Options API for new code—prefer Composition API

## 📚 Codex Use Cases
Codex should use this when:
- Creating feature modules inside `/features/`
- Building form logic using `vee-validate` or `useXYZForm`
- Writing state stores with `Pinia` inside `/stores/` or features
- Defining routes and lazy-loading components
- Reviewing component logic for setup/composables separation