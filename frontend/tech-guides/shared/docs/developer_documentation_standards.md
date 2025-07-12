# Developer Documentation Standards

## 🔁 Core Principles
- Documentation is a **product**, not a byproduct.
- Write for **your reader’s context**, not your own.
- Good docs are **actionable**, **findable**, and **maintainable**.
- Treat docs like code: **reviewed, versioned, tested**.
- Always aim for **minimum necessary complexity** in language.

## 🧩 Design Patterns
- **Diataxis framework**: Separate content into four types:
  - *Tutorials*: learning-oriented
  - *How-to guides*: goal-oriented
  - *Reference*: information-oriented
  - *Explanation*: understanding-oriented
- **Documentation layers**:
  - Code comments → Inline usage
  - README → Onboarding and purpose
  - `/docs/*.md` → Detailed guides and architecture
  - API reference → Generated or maintained specs

## ✅ Do
- Use consistent **voice, style, and terminology** across docs.
- Write in **second person** ("you") and active voice.
- Write **short paragraphs**, clear headings, and use bullet lists.
- Document **what**, **why**, and **how** in every change.
- Define **terms**, especially when using domain-specific jargon.
- Include **examples** that are tested or easily runnable.

## 🚫 Don’t
- Don’t document what’s obvious from the code without added value.
- Don’t use internal team slang or abbreviations.
- Don’t assume the reader knows your architecture or history.
- Don’t let documentation drift from implementation—link or generate when possible.
- Don’t mix tutorial and reference content in the same doc.

## 📚 Codex Use Cases
Codex should use this when:
- Writing or updating `/docs/*.md` or `/README.md`
- Contributing shared hooks or APIs that need reference and example
- Reviewing PRs with developer-facing changes (e.g., new components, APIs)
- Generating or extending OpenAPI or component documentation
- Writing inline documentation for custom hooks, utilities, or modules

