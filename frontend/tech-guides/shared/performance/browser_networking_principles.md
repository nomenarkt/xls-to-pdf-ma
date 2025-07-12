# Web Performance Networking Principles

## 🔁 Core Principles
- Latency is the dominant factor in perceived performance
- Minimize round trips through batching, inlining, and connection reuse
- TCP and TLS handshake overhead must be accounted for early
- Mobile constraints (radio wake-up time, battery usage) differ from desktop

## 🧩 Design Patterns
- **Resource Prioritization**: preload critical assets (`<link rel="preload">`)
- **Bundling Strategy**: avoid over-bundling; prefer strategic code-splitting
- **Connection Management**:
  - Use persistent connections (keep-alive)
  - Optimize reuse via `Connection` headers and domain sharding strategies
- **Caching Layers**:
  - Set aggressive `Cache-Control` for immutable assets
  - Leverage service workers for offline-first and background sync

## ✅ Do
- Use HTTP/2 or HTTP/3 to multiplex requests and reduce latency
- Apply `prefetch`, `preload`, and `dns-prefetch` when useful
- Minimize DNS lookups and consolidate domains
- Co-locate assets with CDN edge caches
- Monitor real-world metrics (TTFB, FCP, LCP, INP) not just synthetic ones
- Use image formats like WebP/AVIF and responsive `<img>`/`<source>` sets

## 🚫 Don’t
- Don’t lazy-load assets critical to first paint (CSS, fonts)
- Don’t block the main thread with synchronous XHR
- Don’t ignore the cost of mobile network overhead and wake-up cycles
- Don’t inline large scripts/styles unless necessary for first render
- Don’t assume high-speed connections—optimize for worst-case first

## 📚 Codex Use Cases
Codex should use this when:
- Reviewing or writing network-bound frontend features
- Designing loading strategies (e.g., prefetch, lazy, SSR hydration)
- Auditing web vitals during CI/CD performance gates
- Proposing optimizations for resource loading (fonts, media, scripts)
- Integrating PWA, CDN, or service worker layers

