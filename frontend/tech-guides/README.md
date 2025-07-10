# Tech Guides – Frontend Contributor Guide

> ⚠️ This guide supports extension via `/tech-guides/{platform}.md`. Do not alter `/frontend/AGENT.md` — it is locked by design.

This README explains how to create, extend, and maintain the platform-specific tech guides under `/frontend/tech-guides/`. These guides translate the core rules from `/frontend/AGENT.md` into implementation-level guidance for platforms like web and mobile.

## 📌 Purpose

* Provide implementation guidance for Codex across supported frontend stacks
* Ensure every frontend platform follows a repeatable, test-first, type-safe execution model
* Align Codex execution with the architectural goals defined by The Polyglot

## 🤖 Used by The Polyglot Architect

These tech guides are referenced by **The Polyglot** during task generation and by Codex during execution. They support all frontend stacks — web, mobile, and shared — and their specific implementations:

* Web: React, Vue, Svelte, Angular
* Mobile: React Native, Flutter
* Shared: platform-agnostic validation, state, and services

Each `.md` file here defines **how** something should be built; The Polyglot defines **what** and **why**.

## 🧱 Structure of a Tech Guide

Each tech guide must include:

1. **Stack & Tools**
   * Framework and rendering model (e.g., Next.js App Router, Flutter)
   * Styling (Tailwind, Dripsy, ThemeData)
   * Forms, schema validation, routing
   * Testing tools and linting rules

2. **Folder Conventions**
   * Pages, screens, components, logic structure
   * Locations for hooks, schemas, state, and tests

3. **Data Access & State**
   * API integration patterns (e.g., React Query, Riverpod)
   * Centralized API logic in `/shared`
   * State management guidelines (local, session, cache)

4. **Testing Guidelines**
   * Test tools by stack (RTL, flutter_test, etc.)
   * Mocking strategies, edge cases, and coverage standards

5. **Styling & Tokens**
   * Use of `theme.ts`, `ThemeData`, or equivalent
   * No hardcoded values
   * Platform-specific styling rules

6. **Code Examples**
   * Sample component or screen with test
   * API hook or service layer pattern
   * Form with validation schema

---

## ✅ Rules for Adding New Platform Guides

To create `/tech-guides/{platform}.md`:

1. Use a real-world production-ready stack
2. Follow the section format above
3. Provide examples with tests and validation
4. Link to `/frontend/AGENT.md`
5. Review with The Polyglot before merging

---

## 🧭 AGENT.md Is Immutable

🚫 Do NOT modify `/frontend/AGENT.md`.

It defines:

* Codex’s execution boundary
* Core platform separation (web/mobile/shared)
* Contribution, test, and commit protocols

Any changes to platform behavior belong in `/tech-guides/*.md`.

With this structure, we enable scalable, testable, and maintainable frontend development across all supported stacks.

