# /tech-guides/angular.md – Angular Tech Guide

This guide defines conventions for Angular-based frontend projects. It aligns with Codex execution and task specs from `/frontend/ARCHITECT.md`.

---

## ✅ Framework

* Angular 17+ (standalone components supported)
* Angular CLI + Nx (optional)
* RxJS for reactive streams

---

## 🧭 File Structure

```
/frontend/angular/
├── app/
│   ├── core/           # Services, guards, interceptors
│   ├── shared/         # Reusable components/pipes
│   ├── features/       # Domain-specific modules
│   └── app.config.ts   # Routing, providers
```

* Follow SCAM (Single Component Angular Module) pattern if not using standalone
* Organize by domain (e.g., orders, users)

---

## 🎨 Styling

* Tailwind CSS with tokens from `/shared/theme.ts`
* Prefer `@Component({ styles })` scoped styles
* Respect accessibility roles and ARIA attributes

---

## 🧠 State Management

* Signals (Angular 17) or `@ngrx/component-store`
* Avoid global NgRx unless complex state
* Prefer observables and signals in components

---

## 🧾 Forms & Validation

* Use Reactive Forms (`FormGroup`, `FormControl`)
* Validate with custom validators or use `ngx-validate` with Zod
* Reflect errors in templates with `formControl.errors`

---

## 🔌 API Integration

* Use `HttpClient` wrapped in services in `/core`
* Abstract API logic into `/shared/api/` when needed
* Prefer typed DTOs from `/shared/types/`

---

## 🧪 Testing

* Use `@angular/core/testing` + Jasmine/Karma or Jest
* Minimum 90% coverage
* Test components, services, guards, pipes
* Use Spectator or TestBed for unit/integration testing

---

## 🪄 Tooling

* ESLint with Angular rules
* Prettier
* TypeScript strict mode
* Optional Nx plugin setup

---

## 📚 Reference Books

* *Ng-Book: The Complete Guide to Angular* – Nate Murray et al
* *Effective TypeScript* – Dan Vanderkam
* *Frontend Architecture for Design Systems* – Micah Godbolt

---

Refer to [`/frontend/AGENT.md`](../AGENT.md) and [`/frontend/ARCHITECT.md`](../ARCHITECT.md) for implementation boundaries and task protocols.

