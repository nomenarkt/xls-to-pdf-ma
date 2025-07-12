# Java Backend Tech Guide

This guide defines how to implement backend Codex tasks using Java while adhering to the conventions in `/backend/AGENT.md`.

## 🔧 Stack & Tools

* Language: Java 17+
* Framework: Spring Boot 3 (Spring Web, Spring Security, Spring Data JPA)
* ORM: Hibernate (via Spring Data JPA)
* Validation: Jakarta Bean Validation (Hibernate Validator)
* Auth: jjwt or Spring Security JWT
* Formatter: `google-java-format`, `spotless`
* Linter: `Checkstyle`, `PMD`, `SpotBugs`
* Static Analysis: `ErrorProne`, `SonarQube`
* Testing:

  * JUnit 5
  * AssertJ or Hamcrest
  * Mockito
  * Spring Boot Test (`MockMvc`, `@SpringBootTest`)
* Coverage: JaCoCo
* Documentation: SpringDoc OpenAPI or Swagger 3

## 📁 Folder Conventions

```
/backend
  /delivery        → Controllers (REST endpoints)
  /usecase         → Services (Application layer)
  /repository      → JPA Repositories, SQL or external API
  /domain          → Entities, enums, value objects
```

* Use constructor injection (not field injection)
* Interfaces should be in usecase/repository layers only

## 🔗 Interfaces & DI

* Define interfaces in `usecase` and `repository` layers

```java
public interface UserRepository {
    void save(User user);
}
```

* Use `@Service`, `@Repository`, and `@Component`
* Register manually only if needed in `@Configuration`

## 🧪 Testing Guidelines

* Unit test all services and domain logic with `@ExtendWith(MockitoExtension.class)`
* Use `MockMvc` or `WebTestClient` for integration tests
* Validate:

  * 2xx success
  * 4xx validation
  * 401/403 JWT failures
  * Edge cases and exception paths

### Test Stack

* JUnit 5
* AssertJ
* Mockito / Spring Boot Test
* JaCoCo coverage enforced by Maven/Gradle

## 🔐 Security & Auth

* Use Spring Security with JWT Bearer filter
* Required claims: `userID`, `email`, `role`
* Use `@PreAuthorize("hasRole('ADMIN')")` or method-based role guards
* Extract claims from `SecurityContextHolder.getContext().getAuthentication()`

## 🚦 CI/CD Expectations

* Format: `google-java-format` or `spotlessCheck`
* Lint: `checkstyle`, `pmd`, `spotbugs`
* Static Analysis: `mvn verify` or `gradle check`
* Test: `mvn test` or `gradle test`
* Coverage: `mvn jacoco:report` or Gradle equivalent
* Coverage >90% required before merge

## 📌 Examples

### Usecase Interface

```java
public interface StoreUserUsecase {
    void execute(UserDTO user);
}
```

### Controller

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final StoreUserUsecase usecase;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> store(@RequestBody @Valid UserDTO user) {
        usecase.execute(user);
        return ResponseEntity.ok(Map.of("status", "success"));
    }
}
```

---

Follow this guide when building Java backend services. Codex contributors must pair this with `/backend/AGENT.md` for all implementations.

