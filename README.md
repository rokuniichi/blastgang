# Blast-style puzzle game.

## Description
A simplified Blast puzzle game done in Cocos Creator with an attempt to implement MVCS driven around with events.

## Requirements
Cocos 2.4.0

## Building
1. Build target: Web Mobile
2. Build folder: `/docs`
3. Deploy

## Implementation
- Game logic is independent of rendering
- Tile lifecycle instead of input-locking (side-effect is animated titles are not part of the logic, like in Toon Blast)
- EventBus is the glue between Domain and Presentation
- Services don't hold states and act as algorithm containers
- Controllers coordinate Domain processes ("who goes where and when and why")

## Notes
- Supports JSON config injection
- Physics engine is disabled.
- The project is optimized for mobile browsers.
