# Web Application Security Principles

## 🔁 Core Principles
- Assume all user input is malicious until proven otherwise
- Defense in depth: secure every layer (client, API, DB, network)
- Least privilege: enforce minimal access across users, roles, and components
- Security is continuous: test, monitor, patch, and audit regularly
- Prefer proactive prevention over reactive mitigation

## 🧩 Design Patterns
- **Input Validation Layer**: Sanitize inputs at the boundary (form, API, CLI)
- **Output Encoding**: Context-aware escaping for HTML, JS, URL, headers
- **CSRF Tokens**: Embed per-session anti-CSRF tokens in forms and headers
- **Content Security Policy (CSP)**: Restrict allowed content sources (e.g., no inline JS)
- **Security Headers**: Enforce protections via HTTP headers (e.g., `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`)
- **Session Locking**: Bind sessions to device fingerprint or IP
- **Zero Trust Auth**: Require re-authentication or step-up auth for sensitive actions

## ✅ Do
- Validate and sanitize input using whitelists (not blacklists)
- Encode output per context: HTML encode in DOM, URL encode in query, etc.
- Store passwords using modern KDFs (e.g., bcrypt, scrypt, Argon2)
- Rotate session tokens on login, privilege change, or logout
- Use HTTP-only, Secure, and SameSite flags on cookies
- Log authentication events, invalid inputs, and unusual behaviors
- Enforce HTTPS and HSTS on all public-facing apps
- Verify CORS settings match access expectations (never use `*` in production)

## 🚫 Don’t
- Don’t rely solely on client-side validation
- Don’t include sensitive data (tokens, PII) in URL paths or logs
- Don’t disable browser security features (e.g., XSS protection headers)
- Don’t use custom crypto or store plaintext credentials
- Don’t trust cookies or JWTs without signature validation
- Don’t expose stack traces or internal exception messages in HTTP responses
- Don’t allow users to upload or execute arbitrary scripts/files

## 📚 Codex Use Cases
Codex should apply this guide when:
- Generating input validation schemas for APIs or forms
- Implementing secure cookie and session handling
- Designing CSP headers, HSTS policies, or custom auth flows
- Refactoring output rendering logic to prevent XSS
- Reviewing error-handling code for information leakage
- Suggesting authentication patterns and cryptographic storage practices

> Source: *Web Application Security — Andrew Hoffman*
