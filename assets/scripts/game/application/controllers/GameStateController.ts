import { GameStateModel } from "../../domain/models/GameStateModel";

export class GameStateController {

    private readonly _state: GameStateModel;

    public constructor(state: GameStateModel) {
        this._state = state;
    }
}