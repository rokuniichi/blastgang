# BlastGang

## Description
A simplified Blast puzzle game done in Cocos Creator with an attempt to implement MVCS driven around with events.

Play at: https://rokuniichi.github.io/blastgang/

## Requirements
- **Cocos 2.4.0**

## Building
1. Build target: Web Mobile
2. Build folder: `/docs`
3. Deploy on your web-server

## Architecture*
```
├── Game
    ├── Domain (logic)
        ├── Models (BoardModel, GameStateModel...)
        ├── Services (ClusterService, SearchService, DestructionService...)
        └── Events (MovesUpdatedEvent, BoardProcessedEvent...)
    ├── Application (management)
        ├── Entry (GameEntry) 
        ├── Context (DomainContext) 
        └── Controllers (BoardController, GameStateController)
    ├── Presentation (visuals)
        ├── Animations (animation system)
        ├── Views (BoardView, TileView...)
        └── Events (TileClickedEvent...)
├── Core
    ├── Utilities (assert, ensure, Matrix...)
    └──  Events (event system)
```
*the scheme is for reference, details are subject to change

## Implementation
- Game logic is independent of rendering
- Tile lifecycle instead of input-locking
- EventBus is the glue between Domain and Presentation
- Services don't hold states and act as algorithm containers
- Controllers coordinate Domain processes ("who goes where and when and why")
- Dependencies are managed via Contexts
- DomainContext acts as a dependency-root, GameEntry as a launcher
- Architecture is easily scalable and is open to more levels of abstraction (e.g. creating a GameManager above DomainContext for a level-management system, where DomainContext would probably become LevelContext)

## Notes
- Supports JSON config injection
- Physics engine is disabled
- The project is optimized for mobile browsers
