# Design Patterns for Reusable Object-Oriented Code

## 🔁 Core Principles
- **Program to an interface, not an implementation**
- **Favor object composition over class inheritance**
- **Encapsulate variation** in behavior, structure, or instantiation
- **Separate concerns** of responsibility, communication, and lifecycle
- **Use delegation** to enhance flexibility and decoupling
- **Open/Closed Principle**: Classes should be open for extension, but closed for modification

## 🧩 Design Patterns
- **Creational**:
  - Factory Method: Delegate instantiation to subclasses
  - Abstract Factory: Create families of related objects
  - Builder: Separate construction from representation
  - Prototype: Clone from prototype instead of instantiating
  - Singleton: Single global access point with controlled instantiation

- **Structural**:
  - Adapter: Translate one interface to another
  - Decorator: Attach responsibilities without modifying code
  - Facade: Simplify subsystems via a unified interface
  - Composite: Treat part-whole hierarchies uniformly
  - Proxy: Control access with stand-in objects

- **Behavioral**:
  - Strategy: Encapsulate interchangeable algorithms
  - Command: Represent requests as objects
  - Observer: Notify dependents on state change
  - Mediator: Centralize complex communications
  - State: Change behavior with internal state
  - Template Method: Define steps in an algorithm with subclass hooks

## ✅ Do
- Define interfaces for variable behaviors (e.g., `SortStrategy`, `StorageProvider`)
- Use composition to extend behavior dynamically (e.g., Decorators over inheritance)
- Encapsulate creation logic behind factories or builders
- Centralize shared responsibilities using patterns like Mediator or Singleton (with care)
- Use the Observer pattern for reactive systems (e.g., domain events)
- Ensure open/closed compliance with patterns like Strategy or State

## 🚫 Don’t
- Hard-code object creation (`new`) in core logic — use factories
- Rely heavily on subclassing — prefer composition for flexibility
- Leak internal behavior across modules — use encapsulation and proxies
- Couple modules tightly — use interfaces and mediators for decoupling
- Create monolithic classes — split responsibilities via command/strategy patterns

## 📚 Codex Use Cases
Codex should apply these patterns when:
- Implementing pluggable business logic (use Strategy or Command)
- Designing extendable APIs with consistent interfaces (use Template Method or Abstract Factory)
- Enforcing interface contracts while allowing implementation diversity (e.g., Adapter or Proxy)
- Supporting dynamic feature wrapping (e.g., LoggingDecorator, AuthDecorator)
- Building tree-like hierarchies (Composite for menu, UI, or DOM-like structures)

> Source: *Design Patterns: Elements of Reusable Object-Oriented Software – Gamma, Helm, Johnson, Vlissides (GoF)*
