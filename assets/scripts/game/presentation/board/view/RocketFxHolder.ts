import { EventBus } from "../../../../core/eventbus/EventBus";
import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { RocketFxInfo } from "../../../config/visual/VisualConfig";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { RocketAssets } from "../../common/assets/RocketAssets";
import { NodePool } from "../../common/view/NodePool";
import { RocketDirection } from "../../fx/RocketType";
import { getLocal } from "../../utils/calc";
import { RocketOutOfBounds } from "../events/RocketOutOfBounds";
import { RocketView } from "./RocketView";

export class RocketFxHolder implements IDisposable {
    private readonly _eventBus: EventBus;
    private readonly _rocketInfo: RocketFxInfo;
    private readonly _rockets: RocketAssets;
    private readonly _rocketPool: NodePool;
    private readonly _boardCols: number;
    private readonly _boardRows: number;
    private readonly _nodeWidth: number;
    private readonly _nodeHeight: number;

    public constructor(
        eventBus: EventBus,
        rocketInfo: RocketFxInfo,
        rockets: RocketAssets,
        parent: cc.Node,
        boardCols: number,
        boardRows: number,
        nodeWidth: number,
        nodeHeight: number
    ) {
        this._eventBus = eventBus;
        this._rocketInfo = rocketInfo;
        this._rockets = rockets;
        this._boardCols = boardCols;
        this._boardRows = boardRows;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;

        this._rocketPool = new NodePool(rockets.getPrefab(), parent, this._boardCols * this._boardRows);
        this._eventBus.on(RocketOutOfBounds, this.onRocketOutOfBound);
    }

    public dispose(): void {
        this._rocketPool.dispose();
        this._eventBus.off(RocketOutOfBounds, this.onRocketOutOfBound)
    }

    public play(start: TilePosition, direction: RocketDirection): void {
        const node = this._rocketPool.pull();
        const rocket = node.getComponent(RocketView);
        rocket.init(this._rockets);
        rocket.set(direction);
        rocket.show();
        const local = getLocal(start, this._boardCols, this._boardRows, this._nodeWidth, this._nodeHeight);
        rocket.node.setPosition(local.clone());

        rocket.rocket.play(
            this._eventBus,
            direction,
            start,
            this._boardCols,
            this._boardRows,
            this._nodeWidth,
            this._nodeHeight,
            this._rocketInfo);
    }

    private onRocketOutOfBound = (event: RocketOutOfBounds) => {
        this._rocketPool.release(event.node);
    };
}