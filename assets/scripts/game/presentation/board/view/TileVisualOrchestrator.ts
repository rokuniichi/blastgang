import { EventBus } from "../../../../core/events/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { TileSpawned } from "../../../domain/board/events/mutations/TileSpawned";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { VisualTileDestroyed } from "../events/TileViewDestroyed";
import { VisualTileStabilized } from "../events/VisualTileStabilized";
import { BoardVisualModel } from "./BoardVisualModel";
import { SafeDropMap } from "./SafeDropMap";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgentFactory } from "./TileVisualAgentFactory";

export class TileVisualOrchestrator {

    private readonly _eventBus: EventBus;
    private readonly _visualConfig: VisualConfig;


    private readonly _tweenHelper: TweenHelper;

    private readonly _visualAgentFactory: TileVisualAgentFactory;
    private readonly _visualModel: BoardVisualModel;
    private readonly _viewPool: TileViewPool;

    private readonly _boardCols: number;
    private readonly _boardRows: number;

    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _tilePrefab: cc.Prefab;

    private readonly _safeDropMap: SafeDropMap;

    public constructor(
        eventBus: EventBus,
        visualConfig: VisualConfig,
        tweenHelper: TweenHelper,
        boardCols: number,
        boardRows: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node,
        tilePrefab: cc.Prefab
    ) {
        this._eventBus = eventBus;
        this._visualConfig = visualConfig;
        this._tweenHelper = tweenHelper;
        this._boardCols = boardCols;
        this._boardRows = boardRows;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
        this._tilePrefab = tilePrefab;

        this._visualModel = new BoardVisualModel();

        this._viewPool = new TileViewPool(this._eventBus, this._tilePrefab, this._tileLayer);

        this._visualAgentFactory = new TileVisualAgentFactory(
            this._visualConfig,
            this._eventBus,
            this._tweenHelper,
            this._viewPool,
            this._boardCols,
            this._boardRows,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer,
        );

        this._safeDropMap = new SafeDropMap();

        this._eventBus.on(VisualTileStabilized, this.onTileStabilized);
        this._eventBus.on(VisualTileDestroyed, this.onTileDestroyed);
    }

    public init(spawned: TileSpawned[]) {
        spawned.forEach((mutation) => {
            const agent = this._visualAgentFactory.create(mutation.id);
            this._visualModel.register(agent);
            agent.spawnInverted(mutation.type, mutation.at);
        });
    }

    public dispatch(result: BoardMutationsBatch): void {
        for (const mutation of result.mutations) {
            if (mutation.kind === "tile.spawned") {
                const agent = this._visualAgentFactory.create(mutation.id);
                this._visualModel.register(agent);
                this._safeDropMap.add(mutation.at.x, agent.id);
            }
        }

        this._safeDropMap.forEach((v, k) => console.log(`[DISPATCH] spawning ${v} nodes in ${k} column`));

        console.log(`[DISPATCH] mutations: ${result.mutations.length}`);
        for (const mutation of result.mutations) {
            switch (mutation.kind) {
                case "tile.spawned": {
                    console.log(`[DISPATCH] dispatching spawn at: ${BoardKey.position(mutation.at)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    const offset = this._safeDropMap.get(mutation.at.x);
                    console.log(`[OFFSET CALCULCATED] ${offset} for ${mutation.at.x}`)
                    if (!agent) continue;
                    console.log(`[DISPATCH] SPAWN DISPATCHED`);
                    agent.spawnNormal(mutation.type, mutation.at, offset);
                    break;
                }

                case "tile.moved": {
                    console.log(`[DISPATCH] dispatching move from: ${BoardKey.position(mutation.from)}; to: ${BoardKey.position(mutation.to)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) continue;
                    console.log(`[DISPATCH] MOVE DISPATCHED`);
                    agent.drop(mutation.to);
                    break;
                }

                case "tile.destroy": {
                    console.log(`[DISPATCH] dispatching destroy at: ${BoardKey.position(mutation.at)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) continue;
                    console.log(`[DISPATCH] DESTROY DISPATCHED`);
                    agent.destroy();
                    break;
                }

                case "tile.transformed": {
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) continue;

                    //agent.transform(mutation.toType);
                    break;
                }
                case "tile.rejected": {
                    console.log(`[DISPATCH] rejected: ${mutation.reason}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) continue;
                    if (mutation.reason == TileRejectedReason.NO_MATCH) agent.shake();
                    console.log(`[DISPATCH] agent: ${agent.id}; position: ${BoardKey.position(agent.position!)}`);
                    break;
                }

                default:
                    throw new Error(`Unsupported mutation kind: ${(mutation as any).kind}`);
            }
        }
    }

    private onTileStabilized = (event: VisualTileStabilized) => {
        this._safeDropMap.subtract(event.position.x, event.id);
    }

    private onTileDestroyed = (event: VisualTileDestroyed) => {
        this._viewPool.release(event.id);
        this._visualModel.remove(event.id);
    }
}