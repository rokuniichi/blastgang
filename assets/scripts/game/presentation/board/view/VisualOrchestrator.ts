import { EventBus } from "../../../../core/events/EventBus";
import { BoardRuntimeModel } from "../../../application/board/runtime/BoardRuntimeModel";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { AnimationHelper } from "../animations/BoardAnimationHelper";
import { TileDestroyFinished } from "../events/TileDestroyFinished";
import { BoardVisualModel } from "./BoardVisualModel";
import { TileViewPool } from "./TileViewPool";
import { TileVisualAgentFactory } from "./TileVisualAgentFactory";

export class BoardVisualOrchestrator {
    private readonly _eventBus: EventBus;
    private readonly _animationSystem: AnimationSystem;

    private readonly _runtimeModel: BoardRuntimeModel;
    private readonly _visualModel: BoardVisualModel;

    private readonly _animationHelper: AnimationHelper;

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
        animationSystem: AnimationSystem,
        runtimeModel: BoardRuntimeModel,
        boardWidth: number,
        boardHeight: number,
        backgroundLayer: cc.Node,
        tileLayer: cc.Node,
        fxLayer: cc.Node,
        tilePrefab: cc.Prefab
    ) {
        this._eventBus = eventBus;
        this._animationSystem = animationSystem;
        this._runtimeModel = runtimeModel;
        this._boardWidth = boardWidth;
        this._boardHeight = boardHeight;
        this._backgroundLayer = backgroundLayer;
        this._tileLayer = tileLayer;
        this._fxLayer = fxLayer;
        this._tilePrefab = tilePrefab;

        this._visualModel = new BoardVisualModel();

        this._animationHelper = new AnimationHelper(
            this._animationSystem,
            this._backgroundLayer,
            this._fxLayer,
            this._tilePrefab,
            this._boardWidth,
            this._boardHeight
        );

        this._viewPool = new TileViewPool(this._eventBus, this._tilePrefab, this._tileLayer);

        this._visualAgentFactory = new TileVisualAgentFactory(
            this._runtimeModel,
            this._animationHelper,
            this._viewPool,
            this._boardWidth,
            this._boardHeight
        );

        this._eventBus.on(TileDestroyFinished, this.onTileDestroy)
    }

    public dispatch(result: BoardMutationsBatch): void {
        for (const mutation of result.mutations) {
            switch (mutation.kind) {

                case "tile.spawned": {
                    const agent = this._visualAgentFactory.create(mutation.id);
                    this._visualModel.register(agent);

                    agent.spawn(mutation.type, mutation.at);
                    break;
                }

                case "tile.moved": {
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) return;

                    //agent.retargetMove(mutation.to);
                    break;
                }

                case "tile.destroy": {
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) return;
                    agent.destroy();
                    break;
                }

                case "tile.transformed": {
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) return;

                    //agent.transform(mutation.toType);
                    break;
                }

                default:
                    throw new Error(`Unsupported mutation kind: ${(mutation as any).kind}`);
            }
        }
    }

    private onTileDestroy = (event: TileDestroyFinished) => {
        /* const agent = this._visualModel.get(event.id);
        if (!agent) return;

        this._visualModel.remove(agent);
        this._viewPool.release(agent.) */
    };

}