# Observability Engineering Guide

## 🔁 Core Principles
- Treat observability as a first-class system feature
- Instrument before deploying — "you build it, you watch it"
- High cardinality and dimensionality are essential for real debugging
- Use telemetry to ask any arbitrary question about system state
- Prioritize debugging over alerting

## 🧩 Design Patterns
- **Event-based Logging**: emit structured logs for all important transitions
- **Trace-centric Architecture**: associate logs and metrics with trace spans
- **Three Pillars Unified**: Metrics, Logs, and Traces are correlated, not siloed
- **SLOs with Error Budgets**: define SLIs to control alert fatigue and error tolerance
- **Dark Launching**: release with observability but without user exposure
- **High-Cardinality Labels**: e.g., `userID`, `orderID`, `region`, etc. for debugging

## ✅ Do
- Add trace IDs to every request and log line
- Emit structured logs with machine-parseable formats (e.g., JSON)
- Use span attributes to enrich traces with business metadata
- Define SLIs for latency, error rate, saturation, availability
- Use dynamic sampling on traces (tail-based, head-based)
- Alert on symptoms (e.g., user pain), not causes
- Use tools like OpenTelemetry for consistent instrumentation

## 🚫 Don’t
- Don’t log unstructured or free-form text only
- Don’t sample metrics blindly without correlation to traces
- Don’t use uptime checks as primary SLO indicators
- Don’t page on every error or warning — tune alert thresholds
- Don’t couple observability logic with business code

## 📚 Codex Use Cases
Codex should use this when:
- Generating observability middleware (e.g., logging + tracing)
- Writing OpenTelemetry or structured log wrappers
- Implementing instrumentation in handlers, jobs, or pipelines
- Defining SLO/SLI contracts for a new service
- Adding error budget policy enforcement in CI/CD or alerting configs

> Source: *Observability Engineering – Charity Majors, Liz Fong-Jones, George Miranda*
