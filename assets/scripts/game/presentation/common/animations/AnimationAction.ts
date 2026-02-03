import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationType } from "./AnimationType";

export enum ActionStatus {
    PENDING,
    RUNNING,
    COMPLETED,
    CANCELLED
}

export interface ActionData {
    type: AnimationType;
    from: TilePosition;
    to: TilePosition;
    tileType: TileType;
}

export class AnimationAction {
    public readonly id: string;
    public readonly data: ActionData;
    
    public status: ActionStatus;
    public node: cc.Node | null;
    public tween: cc.Tween | null;
    
    private _resolve?: () => void;
    private _promise: Promise<void>;

    public constructor(data: ActionData) {
        this.id = `${data.type}_${data.from.x},${data.from.y}_${data.to.x},${data.to.y}`;
        this.data = data;
        this.status = ActionStatus.PENDING;
        this.node = null;
        this.tween = null;
        
        this._promise = new Promise<void>(resolve => {
            this._resolve = resolve;
        });
    }

    public async execute(executor: (action: AnimationAction) => Promise<void>): Promise<void> {
        if (this.status !== ActionStatus.PENDING) {
            return;
        }
        
        this.status = ActionStatus.RUNNING;
        
        try {
            await executor(this);
            this.complete();
        } catch (error) {
            console.error(`AnimationAction ${this.id} failed:`, error);
            this.cancel();
        }
    }

    public cancel(): void {
        if (this.status === ActionStatus.COMPLETED) {
            return;
        }
        
        this.status = ActionStatus.CANCELLED;
        
        if (this.tween && this.node && cc.isValid(this.node)) {
            cc.Tween.stopAllByTarget(this.node);
        }
        
        this._resolve?.();
    }

    public complete(): void {
        this.status = ActionStatus.COMPLETED;
        this._resolve?.();
    }

    public wait(): Promise<void> {
        return this._promise;
    }
}