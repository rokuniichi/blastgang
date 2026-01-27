export class ScoreService {
    private readonly _scoreMultiplier;

    public constructor(scoreMultiplier: number) {
        this._scoreMultiplier = scoreMultiplier;
    }

    public calculate(destroyed: number) {
        return destroyed * destroyed * this._scoreMultiplier;
    }
}