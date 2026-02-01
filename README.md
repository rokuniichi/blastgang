# 💥 BlastGang

**Blast-puzzle game** built with **Cocos Creator**, focused on clean architecture, separation of concerns, future-proof design.   
The project explores a hybrid of different philosophies and design dogmas such as **DDD + MVCS + event-driven** approach.

🎮 Play online:  
https://rokuniichi.github.io/blastgang

---

## 🏆 Key Goals

- Decouple game logic and rendering
- Apply Domain-Driven Design principles
- Build an event-driven MVCS architecture
- Make the codebase readable, extensible, scalable

---

## 🧩 Core Concepts

- **Domain-first architecture** | game rules are independent from Cocos and UI
- **Event-driven communication** | loose coupling between layers
- **Controllers as orchestrators** | no business logic in views
- **Services as pure algorithms** | stateless, deterministic, reusable
- **Contexts as dependency containers** | explicit dependency graph
- **Initialization pipelines** | deterministic game startup flow
- **Runtime vs Domain separation** | logical state vs execution state

---

## 🏗️ Architecture Overview

```
core/           → utilities & infrastructure
game/
  domain/       → pure game rules and business logic
  application/  → orchestration, use-cases, runtime
  presentation/ → Cocos views, animations, UI, input
  startup/      → composition root
  entry/        → engine entry point (Cocos adapter)
```

### Dependency direction

```
presentation ───────▶ application ───────▶ domain
     │                     │                  │
     └─────────────────────┴──────────────────┘
                          core
```

---

## 📐 Implementation

This project emphasizes **deterministic** game logic, **asynchronous** animation orchestration, and **strict** separation between domain, application, and presentation layers.

### Board & Data Structures

- The board is represented via a generic 2D ```Matrix<T>``` abstraction
- **O(1)** access by position, reused across domain, runtime, and visual layers
- Positions are modeled as explicit value objects (```TileType```)

### Cluster Search

- Tile clusters are detected using a **Depth-First Search** (DFS)
- Visited tiles are tracked via a ```boolean``` matrix

### Board Processing

- Domain produces a ```BoardProcessResult``` containing:
  - ```mutations``` - **how** tiles were changed
  - ```commits``` - **what** was changed
- This allows for asynchronous rendering for the present logical state while utilizing animations

### Animation System

- Each tile position owns its own AnimationChain
- Animations for the same tile are queued
- Animations for different tiles run in parallel
- No global animation barriers

### Runtime Lock Model

- Tile interaction is controlled via a bitmask-based **runtime model**
- Multiple lock reasons can coexist per tile (```destroy```, ```move```, ```spawn```, etc.)
- Locks are added and removed atomically, per tile

### Visual Orchestration

- ```BoardVisualOrchestrator``` coordinates animations and visual commits
- Visual state updates happen only after animation chains resolve
- No early or global board redraws (except initial state)

### Event System

- A lightweight, typed EventBus decouples systems
- No direct dependencies between domain and presentation

### Initialization via Contexts

- Dependencies are grouped into explicit Contexts per layer
- Contexts act as scoped composition roots
- Startup remains predictable and easily extendable

---

## ✨ Code Style & Conventions

- Access modifiers are **always** explicit (```public```, ```protected```, ```private```)
- ```@property``` fields use **camelCase**, regardless of access level
- Private fields are prefixed with ```_```
- ```protected``` and ```public``` members have **no** prefix
- Constants and enum types use ```SCREAMING_SNAKE_CASE```
- Strict "**no** ```any```" policy unless absolutely required for abstractions

---

## ⚙️ Requirements
- Cocos Creator **2.4.0**

---

## 🛠️ Build & Run

1.    Build target: Web Mobile
2.    Output folder: ```/build/web-mobile```
3.    Deploy to any web server (or run via Cocos)

---

## 📌 Notes

- JSON-based configuration supported
- Physics engine disabled
- Mobile web browser is main target
