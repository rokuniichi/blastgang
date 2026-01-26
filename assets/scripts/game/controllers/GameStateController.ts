import { GameState } from "../models/GameState";

export class GameStateController {

    private readonly _state: GameState;

    public constructor(state: GameState) {
        this._state = state;
    }
}