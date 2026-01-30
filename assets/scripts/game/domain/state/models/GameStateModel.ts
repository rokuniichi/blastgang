import { GameStateType } from "./GameStateType";

export class GameStateModel {

    private _movesLeft: number;
    private _targetScore: number;
    private _currentScore: number;
    private _stateType: GameStateType;

    constructor(movesLeft: number, targetScore: number, currentScore: number, initialState: GameStateType) {
        this._movesLeft = movesLeft;
        this._targetScore = targetScore;
        this._currentScore = currentScore;
        this._stateType = initialState;
    }

    public get movesLeft() {
        return this._movesLeft;
    }

    public get targetScore() {
        return this._targetScore;
    }

    public get currentScore() {
        return this._currentScore;
    }

    public get state() {
        return this._stateType;
    }

    public addScore(value: number): void {
        this._currentScore += value;
    }

    public useMove(): void {
        this._movesLeft--;
    }

    public setState(state: GameStateType) {
        this._stateType = state;
    }
}