# /tech-guides/mobile.md – Mobile Frontend Tech Guide

This guide defines how to build robust and testable mobile frontends across multiple frameworks. It complements the immutable `/frontend/AGENT.md` and is governed by architectural principles from `/frontend/tech-guides/README.md`.

## ✅ Supported Frameworks

* React Native (Expo + expo-router)
* Flutter (Dart)

All implementations live under `/frontend/mobile/` and follow platform-agnostic rules unless specified below.

---

## 👥 Role-Based Access

* Organize features under `/mobile/app/{role}/` (e.g., admin, user, courier)
* Use stack-native navigation:

  * React Native: `Stack`, `Tabs`, or `Drawer` (expo-router)
  * Flutter: `Navigator`, `GoRouter`, `AutoRoute`

---

## 🎨 Styling

* Use **token-based styling**:

  * React Native: Dripsy (preferred) or nativewind
  * Flutter: `ThemeData` with token-driven config
* No inline styles or raw values
* Respect platform-safe areas (e.g., `SafeAreaView`, `MediaQuery`)

---

## 📦 Components

* Must be fully touch-accessible
* Support dark mode, accessibility (roles/labels)
* Responsive to device types (phone, tablet)

---

## 🧠 State Management

* For **remote state**: use React Query (React Native), Riverpod/Bloc (Flutter)
* For **local/session state**: use useState/context (React Native), `StateNotifier`, `Provider`, or `setState` (Flutter)
* Avoid prop drilling; prefer scoped hooks/providers

---

## 🧾 Forms & Validation

* Use stack-appropriate form libraries:

  * React Native: `react-hook-form` + Zod
  * Flutter: `Form`, `TextFormField`, custom validators
* All schemas must reside in `/shared/schemas/`
* Show inline validation + server errors

---

## 🔌 API Integration

* Define API logic in `/shared/api/`
* Use:

  * Hooks (React Native) wrapped in React Query
  * Services/Repositories (Flutter) with `http` or `dio`
* Never call fetch/axios/http directly in screens/components

---

## 🧪 Testing

* Use stack-native testing tools:

  * React Native: `@testing-library/react-native` + Jest
  * Flutter: `flutter_test`, `mockito`, `integration_test`
* Cover:

  * Rendering and props
  * Gestures (tap, swipe, input)
  * Navigation behavior
  * Mutation triggers
  * Accessibility and semantics
* Minimum 90% test coverage

---

## 🧩 File Naming & Structure

```
/mobile/
├── app/
│   ├── admin/
│   ├── user/
│   └── courier/
├── components/        # Shared mobile widgets
└── navigation/        # Navigation structure
```

* Files: `ComponentName.tsx|.dart`, `ComponentName.test.ts|_test.dart`
* Group by feature/module/role

---

## 🪄 Tooling

* Enable TypeScript strict mode (React Native)
* Use Dart analyzer + lints (Flutter)
* ESLint with mobile-specific rules (React Native)
* Dev tools:

  * React Native: `expo-debugger`, Flipper
  * Flutter: DevTools, hot reload

---

Always consult [`/frontend/AGENT.md`](../frontend/AGENT.md) for shared constraints and task protocols, and [`/frontend/tech-guides/ARCHITECT.md`](../frontend/ARCHITECT.md) for stack-specific architectural strategy.

