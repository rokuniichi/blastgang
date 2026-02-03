import { EventBus } from "../../../../core/events/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { BoardRuntimeModel, TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { VisualConfig } from "../../../application/common/config/visual/VisualConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { VisualTileUnlocked } from "../events/VisualTileUnlocked";
import { BoardVisualModel } from "./BoardVisualModel";
import { DropMap } from "./DropMap";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgentFactory } from "./TileVisualAgentFactory";

export class TileVisualOrchestrator {
    private readonly _visualConfig: VisualConfig;
    private readonly _eventBus: EventBus;

    private readonly _runtimeModel: BoardRuntimeModel;
    private readonly _visualModel: BoardVisualModel;

    private readonly _tweenHelper: TweenHelper;

    private readonly _viewPool: TileViewPool;
    private readonly _visualAgentFactory: TileVisualAgentFactory;

    private readonly _boardWidth: number;
    private readonly _boardHeight: number;

    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _tilePrefab: cc.Prefab;

    private readonly _dropMap: DropMap;

    public constructor(
        visualConfig: VisualConfig,
        eventBus: EventBus,
        animationSystem: TweenHelper,
        runtimeModel: BoardRuntimeModel,
        boardWidth: number,
        boardHeight: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node,
        tilePrefab: cc.Prefab
    ) {
        this._visualConfig = visualConfig;
        this._eventBus = eventBus;
        this._tweenHelper = animationSystem;
        this._runtimeModel = runtimeModel;
        this._boardWidth = boardWidth;
        this._boardHeight = boardHeight;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
        this._tilePrefab = tilePrefab;

        this._visualModel = new BoardVisualModel();

        this._tweenHelper = new TweenHelper();

        this._viewPool = new TileViewPool(this._eventBus, this._tilePrefab, this._tileLayer);

        this._visualAgentFactory = new TileVisualAgentFactory(
            this._visualConfig,
            this._eventBus,
            this._tweenHelper,
            this._viewPool,
            this._boardWidth,
            this._boardHeight,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer,
        );

        this._dropMap = new DropMap();

        this._eventBus.on(VisualTileUnlocked, this.onTileUnlocked);
    }

    public dispatch(result: BoardMutationsBatch): void {
        this._dropMap.reset();

        for (const mutation of result.mutations) {
            if (mutation.kind === "tile.spawned") {
                this._dropMap.add(mutation.at.x);
            }
        }

        this._dropMap.forEach((v, k) => console.log(`[DISPATCH] spawning ${v} nodes in ${k} column`));

        console.log(`[DISPATCH] mutations: ${result.mutations.length}`);
        for (const mutation of result.mutations) {
            switch (mutation.kind) {
                case "tile.spawned": {
                    console.log(`[DISPATCH] dispatching spawn at: ${BoardKey.position(mutation.at)}; id: ${mutation.id}`);
                    const agent = this._visualAgentFactory.create(mutation.id);
                    this._visualModel.register(agent);
                    const offset = this._dropMap.get(mutation.at.x);
                    agent.spawn(mutation.type, mutation.at, offset);
                    break;
                }

                case "tile.moved": {
                    console.log(`[DISPATCH] dispatching move from: ${BoardKey.position(mutation.from)}; to: ${BoardKey.position(mutation.to)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) break;
                    if (this._runtimeModel.stable(agent.id)) console.log(`[DISPATCH] MOVE !STABILITY CONFLICT!`);
                    console.log(`[DISPATCH] DISPATCHED`);
                    agent.move(mutation.to);
                    break;
                }

                case "tile.destroy": {
                    console.log(`[DISPATCH] dispatching destroy at: ${BoardKey.position(mutation.at)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) break;
                    if (this._runtimeModel.stable(agent.id)) console.log(`[DISPATCH] ${mutation.id} DESTROY STABILITY CONFLICT at ${BoardKey.position(mutation.at)}`)
                    console.log(`[DISPATCH] DISPATCHED`);
                    agent.destroy();
                    break;
                }

                case "tile.transformed": {
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) break;

                    //agent.transform(mutation.toType);
                    break;
                }
                case "tile.rejected": {
                    console.log(`[DISPATCH] rejected: ${mutation.reason}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) break;
                    if (mutation.reason == TileRejectedReason.NO_MATCH) agent.shake();
                    console.log(`[DISPATCH] agent: ${agent.id}; position: ${BoardKey.position(agent.position!)}`);
                    break;
                }

                default:
                    throw new Error(`Unsupported mutation kind: ${(mutation as any).kind}`);
            }
        }
    }

    private onTileUnlocked = (event: VisualTileUnlocked) => {
        this._runtimeModel.unlock(event.id, event.reason);
        if (event.reason === TileLockReason.DESTROY) {
            this._runtimeModel.delete(event.id);
            const agent = this._visualModel.get(event.id);
            if (!agent) return;
            this._visualModel.remove(agent.id);
            this._viewPool.release(agent.view);
        }
    }
}