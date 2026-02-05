import { EventBus } from "../../../../core/events/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { TileSpawned } from "../../../domain/board/events/mutations/TileSpawned";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { TileAssets } from "../../common/assets/TileAssets";
import { VisualTileDestroyed } from "../events/TileViewDestroyed";
import { VisualTileStabilized } from "../events/VisualTileStabilized";
import { TileDestructionFx } from "../fx/TileDestructionFx";
import { TileFlashFx } from "../fx/TileFlashFx";
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
    private readonly _tilePool: TileViewPool;

    private readonly _boardCols: number;
    private readonly _boardRows: number;

    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _tiles: TileAssets;
    private readonly _shards: ShardAssets;
    private readonly _flash: cc.Prefab;

    private readonly _safeDropMap: SafeDropMap;

    private readonly _destructionFx: TileDestructionFx;
    private readonly _flashFx: TileFlashFx;

    public constructor(
        eventBus: EventBus,
        visualConfig: VisualConfig,
        tweenHelper: TweenHelper,
        boardCols: number,
        boardRows: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node,
        tiles: TileAssets,
        shards: ShardAssets,
        flash: cc.Prefab
    ) {
        this._eventBus = eventBus;
        this._visualConfig = visualConfig;
        this._tweenHelper = tweenHelper;
        this._boardCols = boardCols;
        this._boardRows = boardRows;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
        this._tiles = tiles;
        this._shards = shards;
        this._flash = flash;

        this._visualModel = new BoardVisualModel();

        this._tilePool = new TileViewPool(this._eventBus, this._tiles, this._tileLayer);

        this._destructionFx = new TileDestructionFx(this._tweenHelper, this._fxLayer, this._shards, this._visualConfig.gravity);
        this._flashFx = new TileFlashFx(this._tweenHelper, this._fxLayer, this._flash)

        this._visualAgentFactory = new TileVisualAgentFactory(
            this._visualConfig,
            this._eventBus,
            this._tweenHelper,
            this._tilePool,
            this._boardCols,
            this._boardRows,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer,
            this._destructionFx,
            this._flashFx
        );

        this._safeDropMap = new SafeDropMap();


        this._eventBus.on(VisualTileStabilized, this.onTileStabilized);
        this._eventBus.on(VisualTileDestroyed, this.onTileDestroyed);
    }

    public init(spawned: TileSpawned[]) {
        spawned.forEach((mutation) => {
            const agent = this._visualAgentFactory.create(mutation.id, mutation.type);
            this._visualModel.register(agent);
            const from = { x: mutation.at.x, y: -mutation.at.y - this._visualConfig.initialSpawnLine };
            agent.spawn(mutation.type, from, mutation.at, this.getDropDelay(from));
        });
    }

    public dispatch(result: BoardMutationsBatch): void {
        for (const mutation of result.mutations) {
            if (mutation.kind === "tile.spawned") {
                const agent = this._visualAgentFactory.create(mutation.id, mutation.type);
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
                    const from = { x: mutation.at.x, y: mutation.at.y - offset - this._visualConfig.normalSpawnLine };
                    agent.spawn(mutation.type, from, mutation.at, this.getDropDelay(from));
                    break;
                }

                case "tile.moved": {
                    console.log(`[DISPATCH] dispatching move from: ${BoardKey.position(mutation.from)}; to: ${BoardKey.position(mutation.to)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) continue;
                    console.log(`[DISPATCH] MOVE DISPATCHED`);
                    agent.drop(mutation.to, this.getDropDelay(agent.position!));
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
        this._tilePool.release(event.id);
        this._visualModel.remove(event.id);
    }

    private getDropDelay(position: TilePosition) {
        return (this._boardRows - position.y) * this._visualConfig.dropDelayParameter;
    }
}