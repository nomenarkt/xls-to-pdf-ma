# GitHub Actions CI/CD Principles

## 🔁 Core Principles
- Automate everything: lint, test, build, deploy.
- Keep workflows modular, reusable, and environment-aware.
- CI should fail fast, give actionable feedback, and run efficiently.
- CI pipelines should reflect project structure and team responsibilities.

## 🧩 Design Patterns
- **Workflow Breakdown**:
  - `lint.yml`, `test.yml`, `build.yml`, `deploy.yml` in `.github/workflows/`
- **Reusable Jobs** via `workflow_call`
  - Centralize logic in `.github/workflows/reusable-*.yml`
- **Matrix Strategy**:
  - Use `strategy.matrix` to test across versions/environments (e.g., Node 16/18)
- **Conditional Steps**:
  - Use `if:` to run steps by branch, path, or previous job result
- **Secrets & Contexts**:
  - Secure secrets via GitHub Settings → `secrets.GITHUB_TOKEN`, `secrets.ENV_VAR`
- **Artifact & Cache Layers**:
  - Use `actions/upload-artifact` for build outputs
  - Use `actions/cache` for node_modules, build/.next/, etc.

## ✅ Do
- Separate CI concerns by workflow file (test vs deploy)
- Use `actions/setup-node`, `setup-python`, etc. with version pinning
- Use `pull_request` and `push` events separately where needed
- Define a `default` shell and working directory for clarity
- Prefer `workflow_dispatch` + inputs for manual triggers
- Use reusable workflows to DRY up job logic

## 🚫 Don’t
- Don’t hardcode secrets or tokens in YAML—always use `${{ secrets.* }}`
- Don’t commit large artifacts—use GitHub’s cache or artifact actions
- Don’t run full deploys on PRs—use conditional deploy gates (`if: github.ref`)
- Don’t use `run:` steps for critical logic—extract to scripts with proper error handling
- Don’t duplicate logic—use shared actions or composite steps

## 📚 Codex Use Cases
Codex should use this when:
- Creating or reviewing workflows in `.github/workflows/`
- Designing lint/test/build/deploy separation across environments
- Refactoring long YAML into reusable workflows with `workflow_call`
- Applying matrix builds for library or SDK testing
- Validating usage of caching, secrets, and artifact uploads
