import { GameStateInfo } from "../../../config/game/GameConfig";
import { BoosterType } from "./BoosterType";
import { GameStateType } from "./GameStateType";

export class GameStateModel {
    public readonly targetScore: number;
    public readonly maxMoves: number;
    
    private readonly _boosters: Map<BoosterType, number>;

    private _movesLeft: number;
    private _currentScore: number;
    private _stateType: GameStateType;

    public constructor(stateInfo: GameStateInfo) {
        this.targetScore = stateInfo.targetScore;
        this.maxMoves = stateInfo.maxMoves;

        this._movesLeft = this.maxMoves;
        this._currentScore = 0;
        this._stateType = GameStateType.NONE;

        this._boosters = new Map<BoosterType, number>(stateInfo.boosters);
    }

    public get movesLeft() {
        return this._movesLeft;
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

    public useBooster(booster: BoosterType) {
        const value = this._boosters.get(booster);
        if (!value || value === 0) return;
        this._boosters.set(booster, value - 1)
    }
}