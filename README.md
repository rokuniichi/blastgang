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

This project emphasizes **deterministic** game logic, **agent** driven animation pipeline, and **strict** separation between domain, application, and presentation layers.

### Board & Data Structures

#### Logical model
The **BoardLogicalModel** represents the pure logical structure of the board.
- Internally based on a generic 2D Matrix<TileId>
- Provides **O(1)** access by position
- Acts as a spatial index
- Contains no runtime or visual state
- Used exclusively by domain algorithms
- This model answers the question:
  - ***"Who is where?"***

#### Tile repository
The **TileRepository** is a registry of all tile entities.
- Maps ```TileId → TileType```
- Stores stable, identity-bound data
- Decouples tile identity from board placement
- Allows the same tile to:
  - move across the board
  - temporarily disappear
  - be transformed
- This repository answers:
  - ***"What is this tile?"***

#### Runtime model
The **BoardRuntimeModel** tracks runtime-only state.
- Implemented as ```Map<TileId, number>```
- Stores frame-level information regarding the state of tile's runtime
- ```number``` value represents the lock state reason and is a bitmask value
- Exists only for gameplay execution
- Is synced in runtime through visual agents
- This model answers:
  - ***"How is this tile behaving right now?"***

#### Visual agent registry
- The VisualAgentRegistry lives entirely in the presentation layer.
- Maps ```TileId → TileVisualAgent```
- Owns:
  - animations
  - tweens
  - effects
- Agents are self-driven
  - they receive high-level instructions
  - they decide how to execute them (retarget, cancel, blend, delay)
- This registry answers:
  - ***"How is this tile shown to the player?"***

---

### Logical base

#### Cluster Search

- Tile clusters are detected using a **Depth-First Search** (DFS)
- Visited tiles are tracked via a ```boolean``` matrix

#### Board Processing

- Domain produces ```BoardMutationsBatch``` containing ```mutations```
  - a comprehensive history of "events" happened with the board in order
  - ```TileDestroyed```, ```TileMoved```, ```TileRejected``` etc.
- Mutations are then processed inside the ```VisualOrchestrator``` that dispatches commands accross agents

---

### Runtime and presentation

#### Animation System

- Agent-based decentralized animation system
- Each tile holds ownership over it's own FX
- No global animation barriers

#### Event System

- A lightweight, typed EventBus decouples systems
- No direct dependencies between domain and presentation

#### Initialization via Contexts

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

- JSON-based configuration supported (```/assets/resources/configs```)
- Physics engine disabled
- Mainly optimizied for mobile web browsers and **1080x1920** resolution
