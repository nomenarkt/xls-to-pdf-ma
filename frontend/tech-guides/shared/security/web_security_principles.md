# Secure Web Development Guide

## 🔁 Core Principles
- Trust no input—validate and sanitize everything
- Secure by default: least privilege, secure headers, deny by default
- Attackers automate—defenses must assume scale
- Defense in depth: apply multiple layers of validation and containment

## 🧩 Design Patterns
- **Input Validation Layer**: use Zod/Yup in forms, API, and schema gates
- **Contextual Output Encoding**: HTML encode text, URL encode params
- **Token-Based Auth**: Use JWT or secure cookies with SameSite settings
- **CSP + Security Headers**: Apply global helmet-like headers via server

## ✅ Do
- Escape all untrusted output in HTML, JS, CSS, and URLs
- Set HTTP-only, Secure, SameSite=strict on cookies
- Use `Content-Security-Policy`, `X-Content-Type-Options`, and `X-Frame-Options`
- Use parameterized queries in backend ORMs (e.g., Prisma, SQLAlchemy)
- Validate both client-side and server-side inputs
- Use environment-based secrets storage, not hardcoded keys

## 🚫 Don’t
- Don’t trust frontend validation alone
- Don’t use `innerHTML` with untrusted data
- Don’t expose detailed errors to clients in production
- Don’t store passwords in plaintext—use bcrypt/scrypt with salting
- Don’t allow wildcard `CORS` origins (`*`) for authenticated routes

## 📚 Codex Use Cases
Codex should use this when:
- Reviewing API inputs, forms, or shared schemas
- Implementing authentication and session flows
- Writing SSR logic or HTML-rendered views
- Configuring API gateways, edge headers, or middleware
- Auditing open-source packages for potential XSS/SQLi/CORS risks

