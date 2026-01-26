export class GameStateModel {
    private _score = 0;
    private _movesLeft = 0;
    private _targetScore = 0;
    private _gameOver = false;
    private _win = false;

    constructor(moves: number, targetScore: number) {
        this._movesLeft = moves;
        this._targetScore = targetScore;
    }

    get score() { return this._score; }
    get movesLeft() { return this._movesLeft; }
    get targetScore() { return this._targetScore; }
    get isGameOver() { return this._gameOver; }
    get isWin() { return this._win; }

    addScore(value: number): void {
        this._score += value;
    }

    useMove(): void {
        this._movesLeft--;
    }

    setGameOver(win: boolean): void {
        this._gameOver = true;
        this._win = win;
    }
}