export class GameStateModel {
    private _movesLeft = 0;
    private _targetScore = 0;
    private _currentScore = 0;
    private _state = "IDLE";

    constructor(movesLeft: number, targetScore: number) {
        this._movesLeft = movesLeft;
        this._targetScore = targetScore;
        this._state = "IDLE"
    }

    get movesLeft() { return this._movesLeft; }
    get targetScore() { return this._targetScore; }
    get currentScore() { return this._currentScore; }
    get state() { return this._state; }

    addScore(value: number): void {
        this._currentScore += value;
    }

    useMove(): void {
        this._movesLeft--;
    }

    setState(state: string) {
        this._state = state;
    }
}