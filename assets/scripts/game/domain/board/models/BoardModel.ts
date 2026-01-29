import { Matrix } from "../../../../core/collections/Matrix";
import { TileChange } from "./TileChange";
import { TileChangeType } from "./TileChangeType";
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

    public set(position: TilePosition, type: TileType): void {
        const tile = this._board.get(position.x, position.y);

        if (tile.type === type) return;

        this.pushChange(
            TileChangeType.TYPE,
            position,
            tile.type,
            type,
            tile.state,
            tile.state
        );

        tile.type = type;
    }

    public lock(position: TilePosition): void {
        this.setState(position, TileState.BUSY);
    }

    public free(position: TilePosition): void {
        this.setState(position, TileState.IDLE);
    }

    public clear(position: TilePosition): void {
        this.set(position, TileType.NONE);
    }

    public empty(position: TilePosition): boolean {
        return this.get(position) === TileType.NONE;
    }

    public swap(a: TilePosition, b: TilePosition): void {
        const ta = this._board.get(a.x, a.y);
        const tb = this._board.get(b.x, b.y);

        this.pushChange(TileChangeType.TYPE, a, ta.type, tb.type, ta.state, ta.state);
        this.pushChange(TileChangeType.TYPE, b, tb.type, ta.type, tb.state, tb.state);

        this._board.swap(a.x, a.y, b.x, b.y);
    }

    private setState(position: TilePosition, state: TileState): void {
        const tile = this._board.get(position.x, position.y);

        if (tile.state === state) return;

        this.pushChange(
            TileChangeType.STATE,
            position,
            tile.type,
            tile.type,
            tile.state,
            state
        );

        tile.state = state;
    }

    private pushChange(
        changeType: TileChangeType,
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
