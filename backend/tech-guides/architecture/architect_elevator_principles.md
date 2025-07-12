# Architecture Elevation Guide

## 🔁 Core Principles
- Architects must traverse the "elevator" — connecting high-level business strategy with low-level technical implementation
- Technical decisions must align with enterprise goals, not just local optimizations
- Software architecture is about managing **complexity through abstraction and boundaries**
- Favor **platform thinking**: reusable systems that accelerate downstream teams
- Apply **system thinking** — consider org structure, incentives, and communication paths as part of architecture
- Communicate architecture with clarity: context diagrams, fitness functions, and architectural decision records (ADRs)

## 🧩 Design Patterns and Architectural Strategies
- **Architect Elevator**: Navigate between executive floors (business) and engine rooms (code)
- **Inverse Conway Maneuver**: Shape teams and communication to promote desired architecture
- **Utility vs Capability Architecture**: Split foundational platform from differentiated domain capabilities
- **Just-Enough Architecture**: Delay decisions; avoid premature standardization
- **Fitness Functions**: Define and measure success criteria (performance, compliance, modifiability) through automation
- **Self-Service Platforms**: Provide APIs and automation to empower dev teams and reduce central bottlenecks

## ✅ Do
- Define bounded contexts and enforce contracts between them
- Build minimal viable platforms — reduce friction for teams without central gatekeeping
- Encourage loose coupling via async messaging, interface boundaries, and shared vocabularies
- Make decisions transparent via ADRs — explain context, options, trade-offs, and consequences
- Use system diagrams to communicate architecture to all stakeholders (execs, devs, ops)
- Invest in internal platforms that support **reuse, autonomy, and observability**

## 🚫 Don’t
- Don’t enforce architecture through slide decks or documentation only — use executable policies (e.g., linters, CI rules)
- Don’t over-standardize — prefer enabling constraints over rigid mandates
- Don’t separate architects from code — architects must stay hands-on to maintain credibility and context
- Don’t make critical architecture decisions without understanding deployment and runtime realities
- Don’t confuse organizational hierarchy with system modularity — org chart != architecture

## 📚 Codex Use Cases
Codex should apply this guide when:
- Translating business objectives into system architecture and service boundaries
- Designing platforms, SDKs, or tooling for developer enablement
- Writing ADRs or capturing architectural trade-offs
- Reviewing decisions across abstraction levels (infra, app, data, org)
- Creating visual diagrams to document bounded contexts, integration flows, and responsibilities
- Defining or enforcing architecture using automation (e.g., fitness functions in CI/CD)

> Source: *The Software Architect Elevator — Gregor Hohpe*
