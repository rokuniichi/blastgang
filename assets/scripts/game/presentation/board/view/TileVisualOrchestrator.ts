import { EventBus } from "../../../../core/events/EventBus";
import { BoardKey } from "../../../application/board/BoardKey";
import { BoardRuntimeModel, TileRuntimeState } from "../../../application/board/runtime/BoardRuntimeModel";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { TweenHelper } from "../../common/animations/TweenHelper";
import { VisualTileDestroyed } from "../events/VisualTileDestroyed";
import { VisualTileMoved } from "../events/VisualTileMoved";
import { VisualTileSpawned } from "../events/VisualTileSpawned";
import { BoardVisualModel } from "./BoardVisualModel";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgentFactory } from "./TileVisualAgentFactory";

export class TileVisualOrchestrator {
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

    public constructor(
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
            this._eventBus,
            this._tweenHelper,
            this._viewPool,
            this._boardWidth,
            this._boardHeight,
            this._backgroundLayer,
            this._tileLayer,
            this._fxLayer,
        );

        this._eventBus.on(VisualTileSpawned, this.onTileSpawned);
        this._eventBus.on(VisualTileMoved, this.onTileMoved);
        this._eventBus.on(VisualTileDestroyed, this.onTileDestroyed);
    }

    public dispatch(result: BoardMutationsBatch): void {
        console.log(`[DISPATCH] mutations: ${result.mutations.length}`);
        for (const mutation of result.mutations) {
            switch (mutation.kind) {
                case "tile.spawned": {
                    console.log(`[DISPATCH] spawned at: ${BoardKey.position(mutation.at)}; id: ${mutation.id}`);
                    const agent = this._visualAgentFactory.create(mutation.id);
                    this._visualModel.register(agent);

                    agent.spawn(mutation.type, mutation.at);
                    break;
                }

                case "tile.moved": {
                    console.log(`[DISPATCH] moved from: ${BoardKey.position(mutation.from)}; to: ${BoardKey.position(mutation.to)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) break;

                    agent.move(mutation.to);
                    //agent.retargetMove(mutation.to);
                    break;
                }

                case "tile.destroy": {
                    console.log(`[DISPATCH] destroyed at: ${BoardKey.position(mutation.at)}; id: ${mutation.id}`);
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) break;

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
                    if (mutation.reason == TileRejectedReason.NO_MATCH && !agent.busy) agent.shake();
                    console.log(`[DISPATCH] agent: ${agent.id}; position: ${BoardKey.position(agent.position!)}`);
                    //agent.shake();
                    break;
                }

                default:
                    throw new Error(`Unsupported mutation kind: ${(mutation as any).kind}`);
            }
        }
    }

    private onTileSpawned = (event: VisualTileSpawned) => {
        this._runtimeModel.set(event.id, TileRuntimeState.IDLE);
    }

    private onTileMoved = (event: VisualTileMoved) => {
        this._runtimeModel.set(event.id, TileRuntimeState.IDLE);
    }

    private onTileDestroyed = (event: VisualTileDestroyed) => {
        this._runtimeModel.delete(event.id);
        const agent = this._visualModel.get(event.id);
        if (!agent) return;
        this._visualModel.remove(agent.id);
        this._viewPool.release(agent.view);
    };
}