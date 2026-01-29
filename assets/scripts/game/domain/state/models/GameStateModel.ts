export class GameStateModel {

    private _movesLeft: number;
    private _targetScore: number;
    private _currentScore: number;
    private _state: string;

    constructor(movesLeft: number, targetScore: number, currentScore: number) {
        this._movesLeft = movesLeft;
        this._targetScore = targetScore;
        this._currentScore = currentScore;
        this._state = "IDLE"
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
        return this._state;
    }

    public addScore(value: number): void {
        this._currentScore += value;
    }

    public useMove(): void {
        this._movesLeft--;
    }

    public setState(state: string) {
        this._state = state;
    }
}