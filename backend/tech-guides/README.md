# Tech Guides – Contributor Guide

> ⚠️ This guide supports extension via `/tech-guides/{language}.md` and `/tech-guides/backend.md`. Do not alter `/backend/AGENT.md` — it is locked by design.

This README explains how to create, extend, and maintain the backend tech guides under `/backend/tech-guides/`. These documents translate the principles from `/backend/AGENT.md` into actionable implementation strategies for each supported language or shared backend policy.

## 📌 Purpose

* Ensure every backend language has a repeatable Codex protocol.
* Maintain alignment with Clean Architecture, TDD, and AGENT discipline.
* Centralize stack-agnostic practices (e.g., folder layout, JWT schema, CI expectations).
* Make new languages easy to onboard for developers and AI agents alike.

## 🧱 Structure of a Tech Guide

Each tech guide must include:

1. **Stack & Tools**

   * Runtime and language version
   * Web framework, ORM, validation, JWT, testing
   * Formatters, linters, static analyzers, doc generators

2. **Folder Conventions**

   * Match `/backend` layout: delivery, usecase, repository, domain
   * State import and coupling rules clearly

3. **Interfaces & Dependency Injection**

   * How to define/use interfaces in that language
   * How to inject services and repositories

4. **Testing Guidelines**

   * Tools, mocks, coverage tools
   * Style: unit, integration, CI expectations

5. **Security & Auth**

   * How JWT is parsed and validated
   * How roles and claims are enforced

6. **CI/CD Expectations**

   * Format/lint/test commands
   * Coverage threshold
   * GitHub Actions, pre-commit, or other enforcement tools

7. **Code Examples**

   * Sample usecase interface and endpoint
   * Must be production-grade and Codex-friendly

---

## ✅ Rules for Adding New Language Guides

To create `/tech-guides/{language}.md`:

1. Choose a mainstream, well-supported stack
2. Use Clean Architecture mapping (not MVC)
3. Research test, lint, DI, and JWT patterns in that stack
4. Write a draft with all sections above
5. Review with Architect before merge

## 📚 Rules for Updating Shared Backend Practices

If a principle applies to all backend languages (e.g., folder structure, JWT claim schema, testing layers), document it in `/tech-guides/backend.md`.

Use this shared guide as a default policy when no `{language}.md` exists or to keep language guides lean.

---

## 🧭 AGENT.md Is Immutable

🚫 Do NOT modify `/backend/AGENT.md`.

It defines the core responsibilities of Codex, the architecture (Clean Architecture), and the contribution protocols.

Only evolve stack-specific or shared execution logic inside `/tech-guides/`.

If the architecture itself must evolve (e.g., away from Clean Architecture), clone AGENT.md into a `v2` or `archive` branch and create a new one from scratch with versioning.

---

With this structure, we ensure consistency, extensibility, and precision as new runtimes or teams join the project.

