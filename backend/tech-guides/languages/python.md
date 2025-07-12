# Python Backend Tech Guide

This guide defines how to implement backend Codex tasks using Python while conforming to `/backend/AGENT.md` principles.

## 🔧 Stack & Tools

* Language: Python 3.11+
* Framework: FastAPI (preferred), Flask (fallback)
* DB Layer: SQLAlchemy + Alembic
* Validation: Pydantic
* Auth: PyJWT
* Formatter: `black`, `isort`
* Linter: `flake8`, `pylint`
* Static Analysis: `mypy`
* Testing:

  * `pytest`
  * `httpx.AsyncClient`
  * `unittest.mock`, `pytest-mock`
* Coverage: `pytest-cov`, `coverage.py`
* Documentation: auto-generated OpenAPI via FastAPI

## 📁 Folder Conventions

```
/backend
  /delivery        → FastAPI routers and endpoints
  /usecase         → Business logic, orchestrators
  /repository      → SQLAlchemy implementations
  /domain          → Models, Enums, Value Objects
```

* Never import repository into delivery directly
* Inject dependencies via constructor or FastAPI Depends

## 🔗 Interfaces & DI

* Define repository and usecase interfaces as base ABCs

```python
class UserRepository(ABC):
    @abstractmethod
    async def save(self, user: UserModel) -> None: ...
```

* Use FastAPI's `Depends` or manual DI to inject services

## 🧪 Testing Guidelines

* Use `pytest` for all test suites
* Use `pytest-mock` or `unittest.mock` for mocks
* Validate:

  * Happy paths
  * 400 validation
  * 401/403 auth failure
  * Failure branches and edge cases

### Test Stack

* `pytest`, `httpx.AsyncClient`
* Coverage via `pytest-cov`
* Avoid stateful globals; use fixture scopes correctly

## 🔐 Security & Auth

* Use PyJWT and FastAPI middleware
* Required claims: `userID`, `email`, `role`
* Use dependency injection to extract and validate claims:

```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return User(**payload)
```

* Use role guards at usecase entry or dependency layer

## 🚦 CI/CD Expectations

* Must pass:

  * `black . && isort .`
  * `flake8`, `pylint`, `mypy`
  * `pytest --cov`
* Coverage must exceed 90%
* Use GitHub Actions or pre-commit + CI config

## 📌 Examples

### Usecase interface

```python
class StoreUserUsecase(ABC):
    @abstractmethod
    async def execute(self, user: UserDTO) -> None: ...
```

### Router handler

```python
@router.post("/users", status_code=200)
async def store_user(user: UserDTO, service: StoreUserUsecase = Depends()):
    await service.execute(user)
    return {"status": "success"}
```

---

Follow this guide when implementing any Python backend feature. All rules in `/backend/AGENT.md` apply.

