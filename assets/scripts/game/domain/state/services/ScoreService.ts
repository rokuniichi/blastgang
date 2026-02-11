export class ScoreService {
    private readonly _scoreMultiplier;

    public constructor(scoreMultiplier: number) {
        this._scoreMultiplier = scoreMultiplier;
    }

    public calculateCluster(destroyed: number) {
        return destroyed * destroyed * this._scoreMultiplier;
    }

    public calculateCollateral(destroyed: number) {
        return destroyed * this._scoreMultiplier * this._scoreMultiplier;
    }
}