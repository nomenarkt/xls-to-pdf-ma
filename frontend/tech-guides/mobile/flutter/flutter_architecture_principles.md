# Flutter Architecture & Design Principles

## 🔁 Core Principles
- UIs are built via **composition** of widgets, not inheritance.
- Prefer **declarative programming**: UI = f(state).
- Maintain a **clear separation between UI and business logic**.
- Use Flutter’s **widget tree** to express hierarchy and layout.

## 🧩 Design Patterns
- **MVU (Model-View-Update)** with state passed down and events bubbled up.
- **Scoped state containers** using `InheritedWidget`, `Provider`, or `Riverpod`.
- **Modular routing**: route per feature, with parameterized widget constructors.
- **Layered state logic**:
  - UI Layer: Stateless + StatefulWidgets
  - ViewModel Layer: change notifiers, streams, or value notifiers
  - Data Layer: repositories and services

## ✅ Do
- Use `StatelessWidget` wherever possible.
- Use `const` constructors and widgets for render performance.
- Leverage `ThemeData` and `MediaQuery` for responsive UIs.
- Organize code by feature (`/features/feature_name/`) not by type.
- Use `FutureBuilder` and `StreamBuilder` for async UIs.
- Extract widgets early—favor many small reusable components.

## 🚫 Don’t
- Don’t write large `build()` methods—refactor into sub-widgets.
- Don’t directly manipulate global state—use controlled state patterns.
- Don’t mix navigation logic into UI layers—use navigation services.
- Don’t overload `setState`—prefer scoped or reactive state management.
- Don’t skip `Key`s when needed for identity (esp. in lists).

## 📚 Codex Use Cases
Codex should use this when:
- Creating screens in `/mobile/features/` with scoped widget and state files
- Building apps using `Riverpod`, `Provider`, or `Bloc` for state control
- Writing componentized and reusable widgets for UIs
- Defining shared layout and theme via `theme.dart`, `layout.dart`
- Reviewing PRs to ensure widget tree clarity and state isolation
