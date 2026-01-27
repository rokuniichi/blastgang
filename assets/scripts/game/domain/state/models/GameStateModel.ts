import { GameStateType } from "./GameStateType";

export class GameStateModel {
    private _movesLeft = 0;
    private _targetScore = 0;

    private _currentScore = 0;
    private _currentState = GameStateType.IDLE;

    constructor(movesLeft: number, targetScore: number) {
        this._movesLeft = movesLeft;
        this._targetScore = targetScore;
    }

    get movesLeft() { return this._movesLeft; }
    get targetScore() { return this._targetScore; }
    get currentScore() { return this._currentScore; }
    get currentState() { return this._currentState };

    addScore(value: number): void {
        this._currentScore += value;
    }

    useMove(): void {
        this._movesLeft--;
    }

    setState(state: GameStateType) {
        this._currentState = state;
    }
}