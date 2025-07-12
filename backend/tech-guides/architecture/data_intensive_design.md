# Designing Data-Intensive Applications

## 🔁 Core Principles
- Optimize systems for scalability, fault tolerance, and maintainability
- Pick storage and computation models based on **read/write patterns**, **consistency**, and **latency tolerance**
- Use logs and immutable event streams to model time and ensure durability
- Embrace eventual consistency where needed — tradeoffs must be explicit
- Data systems are made robust via **idempotence**, **retries**, and **deduplication**

## 🧩 Design Patterns
- **Event Sourcing**: Store change history as immutable events
- **Log-Based Architecture**: Use append-only logs (e.g., Kafka) to feed state and cache rebuilds
- **Command Query Responsibility Segregation (CQRS)**: Separate write model (commands) from read model (queries)
- **Materialized Views**: Precompute and store views for fast querying
- **Multi-Version Concurrency Control (MVCC)**: Use snapshots to allow readers/writers to operate in parallel
- **Distributed Consensus**: Use Raft/Paxos/Zab for consistency (e.g., leader election)
- **Stream Processing Pipelines**: Compose stateless + stateful operations (map, window, aggregate)

## ✅ Do
- Design schemas to evolve — support backward and forward compatibility
- Favor append-only writes for auditability and resilience
- Use idempotent operations in message processing to tolerate retries
- Measure consistency latency tradeoffs when using distributed stores (e.g., quorum reads)
- Apply batching and compaction to improve throughput
- Use compaction (log cleaning, snapshotting) to control storage growth
- Choose storage engines based on access patterns (LSM tree vs. B-Tree)

## 🚫 Don’t
- Don’t treat distributed consensus as a free abstraction — it has performance costs
- Don’t mix transactional updates across multiple services without a coordination mechanism
- Don’t assume consistency guarantees — make them explicit in contract
- Don’t design APIs that expose database internals (e.g., partition keys, offsets)
- Don’t mutate data destructively — prefer append + flag as deleted/invalidated
- Don’t overfit to one database — evaluate DBs per workload and SLA

## 📚 Codex Use Cases
Codex should apply this guide when:
- Designing schemas and persistence layers for evolving systems
- Suggesting event-driven patterns for audit, consistency, or cache invalidation
- Choosing database engines and replication models
- Writing Kafka consumers, stream processors, or log-compaction logic
- Building CQRS pipelines and materialized views
- Implementing eventual consistency mechanisms with retries, backoff, and deduplication

> Source: *Designing Data-Intensive Applications — Martin Kleppmann*
