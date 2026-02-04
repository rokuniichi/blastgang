import { BoostersInfo } from "../../../application/common/config/game/GameConfig";
import { BoosterType } from "./BoosterType";
import { GameStateType } from "./GameStateType";



export class GameStateModel {

    private readonly _boosters: Map<BoosterType, number>;

    public constructor(
        private _movesLeft: number,
        private _targetScore: number,
        private _currentScore: number,
        private _stateType: GameStateType
    ) { 
        this._boosters = new Map<BoosterType, number>();
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

    public setBoosters(boosters: BoostersInfo) {
        this._boosters.set(BoosterType.SWAP, boosters.swap);
        this._boosters.set(BoosterType.BOMB, boosters.bomb);
    }

    public useBooster(booster: BoosterType) {
        const value = this._boosters.get(booster);
        if (!value || value === 0) return;
        this._boosters.set(booster, value - 1)
    }
}