# Kubernetes Operational Patterns Guide

## 🔁 Core Principles
- Desired state drives system behavior — everything is declarative
- Controllers continuously reconcile real state to match declared manifests
- Cluster workloads must be isolated, observable, and fault-tolerant
- Containers are not VMs — build for stateless, disposable compute
- Always plan for self-healing, scaling, and graceful degradation

## 🧩 Design Patterns
- **Controller Pattern**: Built-in controllers monitor objects and act (e.g., Deployments, ReplicaSets)
- **Service Abstraction**: Expose Pods using ClusterIP, NodePort, LoadBalancer, or Ingress
- **Labels + Selectors**: Used for targeting workloads and building scalable policies
- **Namespaces**: Logical isolation of resources for multitenancy and RBAC scope
- **Secrets & ConfigMaps**: Decouple config from container logic
- **Pod Lifecycle Hooks**: Init containers, preStop/postStart for orchestration and safety
- **Horizontal & Vertical Autoscaling**: Optimize workloads based on CPU/memory/metrics

## ✅ Do
- Use `kubectl explain` or OpenAPI schema to validate resource fields
- Apply resource `requests` and `limits` to avoid noisy neighbors
- Version images explicitly and roll out with deployment strategies
- Use readiness probes to gate traffic until ready
- Structure manifests into `base` and `overlays` for kustomize support
- Use `kubectl get events` or `describe` to debug pod issues
- Leverage `livenessProbe` for crash recovery
- Grant scoped service accounts via RBAC
- Organize `/k8s/` directory with workload-based folders (e.g., `/k8s/api/`, `/k8s/db/`)

## 🚫 Don’t
- Don’t use `latest` image tag in production
- Don’t expose ports directly — use Services or Ingress only
- Don’t skip audit logs or cluster role bindings when managing users
- Don’t assign `cluster-admin` to workloads
- Don’t put large secrets or binary blobs in `ConfigMaps`
- Don’t deploy without probes or resource quotas

## 📚 Codex Use Cases
Codex should use this when:
- Generating Kubernetes YAML for Deployments, Services, Ingress
- Writing autoscaling or rollout strategies for cloud-native apps
- Building CI/CD pipelines that apply manifests using `kubectl` or ArgoCD
- Enforcing RBAC policies and namespace boundaries
- Validating pod health and diagnostics via probes and logs
- Refactoring infrastructure using Helm or Kustomize

> Source: *The Kubernetes Book — Nigel Poulton*
