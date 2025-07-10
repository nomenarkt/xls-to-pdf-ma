# Backend Directory

This folder follows a Clean Architecture layout.

- `delivery/` – HTTP handlers and route definitions.
- `usecase/` – Business logic orchestrating domain and repository code.
- `repository/` – Data access and external service integrations.

Each layer communicates via interfaces and must remain isolated.
