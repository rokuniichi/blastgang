import { Matrix } from "../../../../core/collections/Matrix";
import { TileChange } from "./TileChange";
import { TileChangeReason } from "./TileChangeReason";
import { TileModel } from "./TileModel";
import { TilePosition } from "./TilePosition";
import { TileState } from "./TileState";
import { TileType } from "./TileType";

export class BoardModel {

    private readonly _board: Matrix<TileModel>;
    private readonly _changes: Map<string, TileChange>;

    public constructor(width: number, height: number) {
        this._board = new Matrix<TileModel>(
            width,
            height,
            () => new TileModel(TileType.NONE, TileState.IDLE)
        );
        this._changes = new Map<string, TileChange>();
    }

    public get width(): number {
        return this._board.width;
    }

    public get height(): number {
        return this._board.height;
    }

    public get changes(): TileChange[] {
        const result = Array.from(this._changes.values());
        this._changes.clear();
        return result;
    }

    public get(position: TilePosition): TileType {
        return this._board.get(position.x, position.y).type;
    }

    public set(reason: TileChangeReason, position: TilePosition, type: TileType): void {
        const tile = this._board.get(position.x, position.y);

        if (tile.type === type) return;

        this.pushChange(
            reason,
            position,
            tile.type,
            type,
            tile.state,
            tile.state
        );

        tile.type = type;
    }

    public move(reason: TileChangeReason, from: TilePosition, to: TilePosition): void {
        this.set(reason, to, this.get(from));
        this.clear(reason, from);
    }

    public lock(reason: TileChangeReason, position: TilePosition): void {
        this.setState(reason, position, TileState.BUSY);
    }

    public free(reason: TileChangeReason, position: TilePosition): void {
        this.setState(reason, position, TileState.IDLE);
    }

    public clear(reason: TileChangeReason, position: TilePosition): void {
        this.set(reason, position, TileType.NONE);
    }

    public empty(position: TilePosition): boolean {
        return this.get(position) === TileType.NONE;
    }

    public swap(reason: TileChangeReason, posA: TilePosition, posB: TilePosition): void {
        const tileA = this._board.get(posA.x, posA.y);
        const tileB = this._board.get(posB.x, posB.y);

        this.pushChange(reason, posA, tileA.type, tileB.type, tileA.state, tileA.state);
        this.pushChange(reason, posB, tileB.type, tileA.type, tileB.state, tileB.state);

        this._board.swap(posA.x, posA.y, posB.x, posB.y);
    }

    private setState(reason: TileChangeReason, position: TilePosition, state: TileState): void {
        const tile = this._board.get(position.x, position.y);

        if (tile.state === state) return;

        this.pushChange(
            reason,
            position,
            tile.type,
            tile.type,
            tile.state,
            state
        );

        tile.state = state;
    }

    private pushChange(
        changeType: TileChangeReason,
        position: TilePosition,
        typeBefore: TileType,
        typeAfter: TileType,
        stateBefore: TileState,
        stateAfter: TileState
    ): void {
        const key = this.key(position);
        const existing = this._changes.get(key);

        if (!existing) {
            this._changes.set(key, {
                changeType,
                position,
                typeBefore,
                typeAfter,
                stateBefore,
                stateAfter,
            });
            return;
        }

        existing.typeAfter = typeAfter;
        existing.stateAfter = stateAfter;

        existing.changeType = changeType;
    }

    private key(position: TilePosition): string {
        return `${position.x}:${position.y}`;
    }
}
