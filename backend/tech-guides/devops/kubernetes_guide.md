# Kubernetes Deployment Guide

## 🔁 Core Principles
- Declarative configuration: define desired state in YAML and let Kubernetes reconcile
- Containers are ephemeral: assume pods can die and be recreated anytime
- Infrastructure as Code: version-control all manifests and configs
- Service abstraction: decouple workload from IPs or node location
- Self-healing: use probes and replicas to ensure availability

## 🧩 Design Patterns
- **Pod & ReplicaSet**: Run containers and ensure high availability
- **Deployment**: Declarative rolling updates with rollback support
- **ConfigMap & Secret**: Externalize environment-specific configs securely
- **Service + Ingress**: Internal discovery and external routing abstraction
- **Init Containers**: Pre-run setup before main containers start
- **Job & CronJob**: One-off or scheduled background tasks
- **Horizontal Pod Autoscaler**: Scale based on metrics (CPU, custom)

## ✅ Do
- Use liveness and readiness probes for self-healing and traffic gating
- Namespace workloads logically for multi-team or multi-tenant clusters
- Use resource requests and limits to ensure QoS and prevent cluster exhaustion
- Mount secrets with correct permissions (`readOnly`, restricted paths)
- Apply RBAC: grant only necessary permissions to service accounts
- Use `kubectl diff` or `dry-run=client` before applying manifests
- Store manifests in `/k8s/` folder and reference via CI workflows
- Label resources for lifecycle ops and observability (`app`, `tier`, `env`)

## 🚫 Don’t
- Don’t run database or stateful workloads without StatefulSets and PVCs
- Don’t hardcode secrets or configs into container images
- Don’t expose services via `NodePort` directly in production
- Don’t use `latest` image tags — always pin versions
- Don’t skip probes — they’re essential for uptime and routing control
- Don’t grant cluster-admin roles to app service accounts

## 📚 Codex Use Cases
Codex should apply this guide when:
- Generating Kubernetes manifests for backend/frontend workloads
- Automating rolling deploys via GitHub Actions or ArgoCD
- Implementing health checks and autoscaling for stateless services
- Refactoring monoliths into microservices using Deployments + Services
- Writing RBAC and network policy templates
- Securing secret handling across environments

> Source: *Learn Kubernetes in a Month of Lunches — Elton Stoneman*
