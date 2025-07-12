# API Security Best Practices

## 🔁 Core Principles
- Secure by design — security must be integrated from the start
- Explicitly define trust boundaries between clients, services, and databases
- Use layered defense ("defense in depth") for authentication, authorization, input validation, and rate limiting
- Treat every API as a potential attack vector
- Prefer standards (OAuth 2.0, OpenID Connect, JOSE) over custom security solutions

## 🧩 Design Patterns
- **Token-Based Auth**: Use JWTs or opaque tokens for stateless access control
- **API Gateway Enforcement**: Centralized security enforcement — rate limits, auth, logging
- **HMAC Request Signing**: Ensure request integrity (especially for internal API-to-API communication)
- **OAuth 2.0 Flows**: Use correct flows per client (e.g., PKCE for mobile, client credentials for service-to-service)
- **Access Scopes**: Restrict token capabilities by intent (read-only, admin, etc.)
- **Rate Limiting + Throttling**: Prevent brute force or misuse
- **Security Headers**: Enforce HTTPS, CORS, content-type, and cache-control policies

## ✅ Do
- Validate input at every layer — never trust user-supplied data
- Rotate secrets, keys, and tokens periodically (short TTLs, automated renewal)
- Log and alert on suspicious activity (e.g., repeated auth failures)
- Use consistent error responses that don’t leak internal details
- Apply least privilege access to every token and API key
- Enforce TLS/HTTPS on all external and internal traffic
- Design auth to be stateless and cache-friendly when possible
- Use mutual TLS or signed requests for backend service authentication

## 🚫 Don’t
- Don’t log sensitive data (tokens, passwords, PII)
- Don’t rely solely on API keys for security — they’re bearer tokens without context
- Don’t use custom crypto — always use vetted libraries
- Don’t skip input validation — SQLi, XSS, and injection attacks thrive on this
- Don’t return stack traces or internal messages in HTTP errors
- Don’t allow long-lived tokens without revocation or rotation strategy

## 📚 Codex Use Cases
Codex should apply this guide when:
- Designing API authentication and authorization flows
- Implementing OAuth 2.0 or JWT token validation middleware
- Creating endpoint-level security rules (scopes, roles)
- Validating request bodies, headers, and query params
- Generating secure API gateways or service proxies
- Refactoring APIs to handle authorization via policy-driven checks

> Source: *API Security in Action — Neil Madden*
