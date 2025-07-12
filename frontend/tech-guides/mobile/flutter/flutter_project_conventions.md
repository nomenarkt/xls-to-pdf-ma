# /tech-guides/flutter.md – Flutter Mobile Tech Guide

This guide defines Flutter-specific conventions for mobile development. It supports scalable UI and task protocols outlined in `/frontend/ARCHITECT.md`.

---

## ✅ Framework

* Flutter 3+ with Dart SDK
* Uses Material 3
* Modular file layout with `lib/`

---

## 🧭 File Structure

```
/frontend/flutter/
├── lib/
│   ├── app/             # Entry, theming, routing
│   ├── features/        # Domain modules
│   ├── widgets/         # Reusable UI components
│   ├── services/        # API, auth, storage
│   └── models/          # DTOs, schemas
```

* Organize by domain inside `/features/`
* Prefer `riverpod` or `bloc` for state

---

## 🎨 Styling

* Use ThemeData tokens defined in `app/theme.dart`
* Follow Material 3 design
* Use `MediaQuery` and `SafeArea` for responsiveness
* Respect accessibility: focus, semantics, contrast

---

## 🧠 State Management

* Preferred: `flutter_riverpod`
* Alternative: `bloc`, `provider`
* Avoid setState except for local UI tweaks

---

## 🧾 Forms & Validation

* Use `flutter_form_builder` or `reactive_forms`
* Use Zod-equivalent validation logic via service class or Dart packages
* Show errors inline; validate on blur and submit

---

## 🔌 API Integration

* Use `dio` or `http` for API calls
* Create API services in `/services/`
* Expose reactive hooks via Riverpod
* Typed models in `/models/`

---

## 🧪 Testing

* Use `flutter_test` + `mockito`
* Coverage: unit, widget, and golden tests
* Place tests in `/test/` folder
* Minimum 90% coverage

---

## 🪄 Tooling

* Dart `analyzer`, `lint`, `build_runner`
* Use `freezed` + `json_serializable` for models
* VSCode or Android Studio recommended

---

## 📚 Reference Books

* *Programming Flutter* – Carmine Zaccagnino
* *Frontend Architecture for Design Systems* – Micah Godbolt
* *Docs for Developers* – Zachary Corleissen

---

See [`/frontend/AGENT.md`](../AGENT.md) for Codex execution logic.
See [`/frontend/ARCHITECT.md`](../ARCHITECT.md) for your task specs.

