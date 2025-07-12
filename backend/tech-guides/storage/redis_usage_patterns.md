# Redis Architecture and Usage Patterns

## 🔁 Core Principles
- Redis is an in-memory data structure store — optimize for speed, not permanence
- Use the right data type for the right task: strings, hashes, lists, sets, sorted sets, etc.
- Data should expire or be evicted if it's transient — treat Redis as ephemeral unless explicitly persisted
- Leverage atomic operations and Lua scripting to manage concurrency safely
- Favor denormalized, precomputed views over relational joins

## 🧩 Design Patterns
- **Cache Aside**: Application fetches from Redis first, falls back to DB on miss, then populates Redis
- **Time Series Bucketization**: Store metrics using time-windowed sorted sets or hashes
- **Rate Limiting**: Use INCR + EXPIRE or sorted sets for request tracking per key/timeframe
- **Leaderboards**: Sorted sets for ranking with scores (e.g., game points)
- **Job Queues**: Lists (LPUSH/BRPOP) for producer-consumer queues
- **Pub/Sub Messaging**: Loose coupling of services with Redis channels
- **Session Store**: Store user session tokens or auth info with TTL

## ✅ Do
- Set appropriate `EXPIRE` on volatile keys to avoid memory bloat
- Use pipelines or Lua scripts for batch/multi-key atomic operations
- Monitor Redis metrics and keyspace to avoid OOM errors
- Keep payloads small — serialize JSON, avoid deep nesting
- Group keys using namespaces (e.g., `cart:user:123`) for traceability and eviction
- Use Redis for low-latency access patterns — feature flags, rate limits, ephemeral locks
- Choose eviction policy (`allkeys-lru`, `volatile-ttl`, etc.) based on access pattern

## 🚫 Don’t
- Don’t use Redis as your primary database without persistent backup plans
- Don’t store large blobs or deeply nested objects — flatten or break apart
- Don’t leave unbounded keys (e.g., growing lists/sets) without cleanup logic
- Don’t rely on pub/sub for guaranteed delivery — use queues or streams
- Don’t write raw strings for structured data — always serialize consistently
- Don’t mutate multiple keys in separate calls if atomicity is needed — use Lua

## 📚 Codex Use Cases
Codex should apply this guide when:
- Suggesting caching strategies for backend endpoints
- Building real-time features (rate limiting, queues, leaderboards)
- Adding Redis-backed feature flags or session management
- Generating key naming schemes for scoped isolation
- Recommending eviction and expiration settings
- Refactoring DB bottlenecks into Redis-enhanced workflows

> Source: *Redis in Action — Josiah L. Carlson*
