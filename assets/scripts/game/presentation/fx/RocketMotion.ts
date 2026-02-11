import { EventBus } from "../../../core/eventbus/EventBus";
import { BoardKey } from "../../application/board/BoardKey";
import { RocketFxInfo } from "../../config/visual/VisualConfig";
import { TilePosition } from "../../domain/board/models/TilePosition";
import { RocketCrossed } from "../board/events/RocketCrossed";
import { RocketOutOfBounds } from "../board/events/RocketOutOfBounds";
import { getLogical, logicalEquals, outOfBounds } from "../utils/calc";
import { RocketDirection } from "./RocketType";

const { ccclass } = cc._decorator;

@ccclass
export class RocketMotion extends cc.Component {

    private _eventBus: EventBus | null = null;

    private _direction: cc.Vec2 = cc.Vec2.ZERO;
    private _logicalDir!: RocketDirection;

    private _boardCols = 0;
    private _boardRows = 0;

    private _nodeWidth = 0;
    private _nodeHeight = 0;

    private _speed = 0;

    private _running = false;

    private _lastLogical!: TilePosition;

    public play(
        eventBus: EventBus,
        direction: RocketDirection,
        start: TilePosition,
        cols: number,
        rows: number,
        nodeWidth: number,
        nodeHeight: number,
        rocketInfo: RocketFxInfo,
    ) {
        this._eventBus = eventBus;
        this._direction = this.direction(direction);
        this._lastLogical = start;
        this._boardCols = cols;
        this._boardRows = rows;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;
        this._speed = rocketInfo.speed;
        this._running = true;

        this._logicalDir = direction;
    }

    protected update(dt: number): void {
        if (!this._running) return;

        const delta = cc.v3(this._direction.mul(this._speed * dt));
        this.node.setPosition(this.node.position.add(delta));

        const logical = getLogical(
            cc.v2(this.node.position),
            this._boardCols,
            this._boardRows,
            this._nodeWidth,
            this._nodeHeight
        );

        if (!logicalEquals(logical, this._lastLogical)) {
            this._lastLogical = logical;
            this._eventBus?.emit(new RocketCrossed(logical));

            if (outOfBounds(logical, this._boardCols, this._boardRows)) {
                this._eventBus?.emit(new RocketOutOfBounds(this.node));
                this._running = false;
            }
        }
    }

    private direction(dir: RocketDirection): cc.Vec2 {
        switch (dir) {
            case RocketDirection.LEFT: return cc.v2(-1, 0);
            case RocketDirection.RIGHT: return cc.v2(1, 0);
            case RocketDirection.UP: return cc.v2(0, 1);
            case RocketDirection.DOWN: return cc.v2(0, -1);
        }
    }
}