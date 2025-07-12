# Secure & Reliable Systems Engineering Guide

## 🔁 Core Principles
- Design for **resilience and graceful degradation** from the start
- **Security and reliability are systemic**, not bolted-on concerns
- **Defense in depth** is mandatory: isolation, validation, monitoring, recovery
- Incident response is part of the system lifecycle
- Prioritize **user trust**, **auditability**, and **blast radius containment**

## 🧩 Design Patterns
- **Zero Trust Architecture**: never assume implicit trust within the network
- **Least Privilege Enforcement**: scope every permission by default
- **Cell-based Architecture**: isolate workloads into failure domains
- **Redundancy and Replication**: remove single points of failure
- **Tamper-evident Logging**: cryptographically verifiable logs
- **Circuit Breakers & Retries**: in external API and DB access
- **Security Boundaries as Code**: IAM, ACLs, security groups, firewall policies
- **Chaos Engineering**: inject failure to validate assumptions

## ✅ Do
- Automate patching and vulnerability scanning in CI/CD
- Use secure by default configs (e.g., HTTPS only, HSTS, CSP headers)
- Enable 2FA and SSO for all production access
- Define and rehearse incident response playbooks
- Audit logs for all privileged operations
- Deploy canaries and validate rollback paths
- Instrument SLIs/SLOs and error budgets for reliability tracking
- Enforce role separation between dev, ops, and security

## 🚫 Don’t
- Don’t allow persistent secrets in source code or containers
- Don’t rely on perimeter firewalls alone for protection
- Don’t disable logging or silently drop errors
- Don’t treat staging and prod differently for auth/security
- Don’t skip threat modeling for external integrations
- Don’t delay post-incident reviews or patching cycles

## 📚 Codex Use Cases
Codex should use this when:
- Defining RBAC, IAM, or firewall policies
- Setting up audit log trails, API rate limits, or SLO-based monitoring
- Designing resilient, fault-isolated microservice deployments
- Writing scripts or pipelines that include secret scanning and validation gates
- Creating default templates for secure services and CI/CD processes

> Source: *Building Secure and Reliable Systems – Heather Adkins, Betsy Beyer, et al.*
