# GitHub Actions Automation Guide

## 🔁 Core Principles
- CI/CD pipelines should be version-controlled and self-documenting
- Keep workflows declarative and modular for readability and reuse
- Fail fast and provide clear feedback to developers
- Use automation to enforce quality, security, and consistency across environments
- Avoid coupling pipeline logic to external assumptions or developer environments

## 🧩 Design Patterns
- **Matrix Builds**: Run parallel jobs across different OS/language versions
- **Reusable Workflows**: DRY pipelines using `workflow_call`
- **Job Composition**: Use `needs` to chain jobs and enforce dependency order
- **Secrets Management**: Store tokens and credentials in GitHub Secrets — never hardcoded
- **Monorepo CI Strategy**: Filter builds using `paths` and `if` conditions
- **Environment Gates**: Use `environments` + `required_reviewers` for manual approvals

## ✅ Do
- Pin action versions (e.g., `@v3`) to avoid breaking changes
- Use `actions/cache` for dependency caching to speed up builds
- Lint, test, build, and deploy as separate stages
- Fail fast on test or lint errors — do not proceed to build or deploy
- Name and label jobs clearly for log traceability
- Use `continue-on-error: true` only for non-blocking diagnostics
- Automate security scanning (e.g., `codeql`, `trivy`) in nightly or PR workflows
- Clean up temporary artifacts between stages to reduce noise

## 🚫 Don’t
- Don’t commit secrets or long-lived tokens in repo
- Don’t run deploys on unverified branches or forks
- Don’t hardcode environment-specific values — use secrets or matrix strategies
- Don’t overload workflows with too many responsibilities
- Don’t ignore failed jobs — review logs and annotate PRs
- Don’t use `main` as a testing branch — protect it with status checks

## 📚 Codex Use Cases
Codex should apply this guide when:
- Generating GitHub Actions CI/CD pipelines for backend/frontend repos
- Adding linting, testing, and deploy stages in PR workflows
- Setting up reusable workflows for different project types
- Creating secure publish pipelines (npm, Docker, PyPI, etc.)
- Enforcing PR quality gates (test pass, coverage, static checks)
- Refactoring monolithic workflows into reusable jobs

> Source: *GitHub Actions Cookbook — Michael Kaufmann*
