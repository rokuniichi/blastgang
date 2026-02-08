import { EventBus } from "../../../../core/eventbus/EventBus";
import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { BoardKey } from "../../../application/board/BoardKey";
import { SwapDeselected } from "../../../application/input/intents/SwapDeselected";
import { SwapSelected } from "../../../application/input/intents/SwapSelected";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { TileAssets } from "../../common/assets/TileAssets";
import { VisualTileDestroyed } from "../events/VisualTileDestroyed";
import { VisualTileStabilized } from "../events/VisualTileStabilized";
import { BoardVisualModel } from "./BoardVisualModel";
import { SafeDropMap } from "./SafeDropMap";
import { TileDestructionFxHolder } from "./TileDestructionFxHolder";
import { TileFlashFxHolder } from "./TileFlashFxHolder";
import { TileViewHolder } from "./TileViewHolder";
import { TileVisualAgentFactory } from "./TileVisualAgentFactory";

export class TileVisualOrchestrator implements IDisposable {

    private readonly _eventBus: EventBus;
    private readonly _visualConfig: VisualConfig;

    private readonly _tweenSystem: TweenSystem;

    private readonly _visualAgentFactory: TileVisualAgentFactory;
    private readonly _visualModel: BoardVisualModel;

    private readonly _boardCols: number;
    private readonly _boardRows: number;

    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _tiles: TileAssets;
    private readonly _shards: ShardAssets;
    private readonly _flash: cc.Prefab;

    private readonly _safeDropMap: SafeDropMap;

    private readonly _tilePool: TileViewHolder;
    private readonly _destructionFx: TileDestructionFxHolder;
    private readonly _flashFx: TileFlashFxHolder;

    private readonly _disposables: IDisposable[];
    private readonly _layers: cc.Node[];

    public constructor(
        eventBus: EventBus,
        visualConfig: VisualConfig,
        tweenSystem: TweenSystem,
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
        this._tweenSystem = tweenSystem;
        this._boardCols = boardCols;
        this._boardRows = boardRows;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
        this._tiles = tiles;
        this._shards = shards;
        this._flash = flash;

        this._visualModel = new BoardVisualModel();
        this._safeDropMap = new SafeDropMap();

        const boardSize = this._boardCols * this._boardRows;
        this._tilePool = new TileViewHolder(this._tiles, this._tileLayer, boardSize);
        this._destructionFx = new TileDestructionFxHolder(this._visualConfig.burst, this._tweenSystem, this._shards, this._fxLayer, boardSize);
        this._flashFx = new TileFlashFxHolder(this._tweenSystem, this._flash, this._backgroundLayer, boardSize)

        this._visualAgentFactory = new TileVisualAgentFactory(
            this._visualConfig,
            this._eventBus,
            this._tweenSystem,
            this._tilePool,
            this._boardCols,
            this._boardRows,
            this._tileLayer,
            this._fxLayer,
            this._destructionFx,
            this._flashFx
        );

        this._disposables = [
            this._tilePool,
            this._destructionFx,
            this._flashFx
        ];

        this._layers = [this._tileLayer, this._fxLayer];

        this._eventBus.on(VisualTileStabilized, this.onTileStabilized);
        this._eventBus.on(VisualTileDestroyed, this.onTileDestroyed);
        this._eventBus.on(SwapSelected, this.onSwapSelected);
        this._eventBus.on(SwapDeselected, this.onSwapDeselected);
    }

    public dispose(): void {
        console.log("TILE LAYER BEFORE", this._tileLayer.childrenCount);
        console.log("FX LAYER BEFORE", this._fxLayer.childrenCount);


        this._eventBus.off(VisualTileStabilized, this.onTileStabilized);
        this._eventBus.off(VisualTileDestroyed, this.onTileDestroyed);
        this._eventBus.off(SwapSelected, this.onSwapSelected);
        this._eventBus.off(SwapDeselected, this.onSwapDeselected);
        this._disposables.forEach((entity) => entity.dispose());
        this._layers.forEach((layer) => layer.destroyAllChildren());
    }

    public init(result: BoardMutationsBatch) {
        console.log(`[DISPATCH] INIT COMMAND: ${result.mutations.length}`);

        result.mutations.forEach((mutation) => {
            if (mutation.kind === "tile.spawned") {
                const agent = this._visualAgentFactory.create(mutation.id, mutation.type);
                this._visualModel.register(agent);
                const from = { x: mutation.at.x, y: -mutation.at.y - this._visualConfig.initialSpawnLine };
                agent.spawn(mutation.type, from, mutation.at, this.getDropDelay(from));
            }
        });
    }

    public dispatch(result: BoardMutationsBatch): void {
        console.log(`[DISPATCH] DISPATCH COMMAND: ${result.mutations.length}`);

        for (const mutation of result.mutations) {
            if (mutation.kind === "tile.spawned") {
                const agent = this._visualAgentFactory.create(mutation.id, mutation.type);
                this._visualModel.register(agent);
                this._safeDropMap.add(mutation.at.x, agent.id);
            }
        }

        this._safeDropMap.forEach((v, k) => console.log(`[DISPATCH] spawning ${v.size} nodes in ${k} column`));

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
                    agent.drop(mutation.to, this.getDropDelay(mutation.from));
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
                    console.log(`[DISPATCH] agent: ${agent.id}; position: ${agent.id}`);
                    break;
                }

                default:
                    throw new Error(`Unsupported mutation kind: ${(mutation as any).kind}`);
            }
        }

    }

    private onTileStabilized = (event: VisualTileStabilized) => {
        this._safeDropMap.subtract(event.id);
    };

    private onTileDestroyed = (event: VisualTileDestroyed) => {
        this._tilePool.release(event.id);
        this._visualModel.remove(event.id);
    };

    private onSwapSelected = (event: SwapSelected) => {
        this.highlightTile(event.id, true);
    };

    private onSwapDeselected = (event: SwapDeselected) => {
        this.highlightTile(event.id, false);
    }

    private highlightTile(id: TileId, state: boolean) {
        const view = this._visualModel.get(id);
        if (view) view.highlight(state);
    }

    private getDropDelay(position: TilePosition) {
        return (this._boardRows - position.y) * this._visualConfig.drop.delay;
    }
}