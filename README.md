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

⚙️ Requirements
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
- Web-browser build target
