<!--
This file defines your rules across all modules.
Platform-specific variations belong in:
- /backend/tech-guides/{language}.md
- /frontend/tech-guides/{platform}.md
-->

# AGENT.md – Global Codex Guidelines

## ✅ Codex Pre-PR Checklist

Before opening a pull request, **you must**:

- ✅ Format all code
- ✅ Run linter
- ✅ Run unit tests
- ✅ Run integration tests (if applicable)
- ✅ Ensure all checks pass

You must never open a pull request unless all steps above succeed.

---

## 🛠 Commands (Generalized)

| Scope    | Task                  | Description                                                                 |
|----------|-----------------------|-----------------------------------------------------------------------------|
| All      | **Format Code**       | Ensure all code is properly formatted using the language's formatter        |
| All      | **Run Linter**        | Run the linter for the specific language or platform                        |
| All      | **Run Tests**         | Execute all unit and integration tests                                      |
| All      | **Ensure Green State**| All steps above must pass before creating or proposing a pull request       |

> 📘 For system-wide engineering workflows, task specs, and architecture rules, see [`ENGINEERING_GUIDE.md`](./ENGINEERING_GUIDE.md).

> 💡 You must refer to `/backend/tech-guides/{language}.md` or `/frontend/tech-guides/{platform}.md` to determine exact tools and conventions per domain. For stack-specific implementation details (React, Vue, Angular, Flutter, etc.), see the relevant guide inside `/frontend/tech-guides/`. A full index is provided in `/frontend/tech-guides/README.md`.

## 📁 Feature Spec Index Protocol

All feature-level specifications must live under:

```
/docs/backend/epic/{EPIC_NAME}/{FEATURE}/[PRD.md, TECH_SPEC.md]
```

Each Epic must also include:

```
/docs/backend/epic/{EPIC_NAME}/PRD.md
/docs/backend/epic/{EPIC_NAME}/TECH_SPEC.md
```

> 🧭 Codex Rule:  
> Before implementing any route, usecase, or repository logic, Codex MUST:
> - Read `/docs/backend/epic/{EPIC_NAME}/PRD.md`
> - Locate the feature under `{FEATURE}/PRD.md` and `TECH_SPEC.md`
> - Follow the Clean Architecture flow from `delivery → usecase → repository`
> - Match test expectations defined in the TECH_SPEC.
