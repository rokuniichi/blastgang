import { EventBus } from "../../../../core/eventbus/EventBus";
import { SubscriptionGroup } from "../../../../core/eventbus/SubscriptionGroup";
import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { SwapSelected } from "../../../application/input/intents/SwapSelected";
import { VisualConfig } from "../../../config/visual/VisualConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { DestroyMutation } from "../../../domain/board/events/mutations/DestroyMutation";
import { MoveMutation } from "../../../domain/board/events/mutations/MoveMutation";
import { ShakeMutation } from "../../../domain/board/events/mutations/ShakeMutation";
import { SpawnMutation } from "../../../domain/board/events/mutations/SpawnMutation";
import { TransformMutation } from "../../../domain/board/events/mutations/TransformationMutation";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TweenSystem } from "../../common/animations/tweens/TweenSystem";
import { RocketAssets } from "../../common/assets/RocketAssets";
import { ShardAssets } from "../../common/assets/ShardAssets";
import { TileAssets } from "../../common/assets/TileAssets";
import { RocketCrossed } from "../events/RocketCrossed";
import { RocketOutOfBounds } from "../events/RocketOutOfBounds";
import { VisualTileDestroyed } from "../events/VisualTileDestroyed";
import { VisualTileFlown } from "../events/VisualTileFlown";
import { VisualTileLanded } from "../events/VisualTileLanded";
import { BoardPositionalModel } from "./BoardPositionalModel";
import { BoardVisualModel } from "./BoardVisualModel";
import { RocketFxHolder } from "./RocketFxHolder";
import { SafeDropMap } from "./SafeDropMap";
import { TileDestructionFxHolder } from "./TileDestructionFxHolder";
import { TileFlashFxHolder } from "./TileFlashFxHolder";
import { TileViewHolder } from "./TileViewHolder";
import { TileVisualAgentFactory } from "./TileVisualAgentFactory";
import { VisualPhases } from "./VisualPhases";

export class TileVisualOrchestrator implements IDisposable {

    private readonly _eventBus: EventBus;
    private readonly _visualConfig: VisualConfig;

    private readonly _tweenSystem: TweenSystem;

    private readonly _visualAgentFactory: TileVisualAgentFactory;
    private readonly _visualModel: BoardVisualModel;
    private readonly _positionalModel: BoardPositionalModel;

    private readonly _boardCols: number;
    private readonly _boardRows: number;

    private readonly _backgroundLayer: cc.Node;
    private readonly _tileLayer: cc.Node;
    private readonly _fxLayer: cc.Node;

    private readonly _tiles: TileAssets;
    private readonly _shards: ShardAssets;
    private readonly _rockets: RocketAssets;
    private readonly _flash: cc.Prefab;

    private readonly _safeDropMap: SafeDropMap;

    private readonly _tilePool: TileViewHolder;
    private readonly _destructionFx: TileDestructionFxHolder;
    private readonly _rocketFx: RocketFxHolder;
    private readonly _flashFx: TileFlashFxHolder;

    private readonly _subscriptions: SubscriptionGroup;
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
        rockets: RocketAssets,
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
        this._rockets = rockets;
        this._flash = flash;

        this._visualModel = new BoardVisualModel();
        this._positionalModel = new BoardPositionalModel();
        this._safeDropMap = new SafeDropMap();

        this._tilePool = new TileViewHolder(
            this._tiles,
            this._tileLayer,
            this._boardCols * this._boardRows
        );
        this._destructionFx = new TileDestructionFxHolder(
            this._eventBus,
            this._visualConfig.burst,
            this._shards,
            this._fxLayer,
            this._boardCols * this._boardRows
        );
        this._flashFx = new TileFlashFxHolder(
            this._tweenSystem,
            this._flash,
            this._backgroundLayer,
            this._boardCols * this._boardRows
        );
        this._rocketFx = new RocketFxHolder(
            this._eventBus,
            this._visualConfig.rocket,
            this._rockets, this._fxLayer,
            this._boardCols,
            this._boardRows,
            this._visualConfig.tileWidth,
            this._visualConfig.tileHeight
        );

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
            this._rocketFx,
            this._flashFx
        );

        this._disposables = [
            this._tilePool,
            this._destructionFx,
            this._flashFx
        ];

        this._layers = [this._tileLayer, this._fxLayer];

        this._subscriptions = new SubscriptionGroup();

        this._subscriptions.add(this._eventBus.on(VisualTileLanded, this.onTileLanded));
        this._subscriptions.add(this._eventBus.on(VisualTileDestroyed, this.onTileDestroyed));
        this._subscriptions.add(this._eventBus.on(SwapSelected, this.onSwapSelected));
        this._subscriptions.add(this._eventBus.on(RocketCrossed, this.onRocketCrossed));
    }

    public dispose(): void {
        this._subscriptions.clear();
        this._disposables.forEach((entity) => entity.dispose());
        this._layers.forEach((layer) => layer.destroyAllChildren());
    }

    public init(result: BoardMutationsBatch) {
        result.mutations.forEach((mutation) => {
            if (mutation.kind === "tile.spawned") {
                const agent = this._visualAgentFactory.create(mutation.id, mutation.type);
                this._visualModel.register(agent);
                const from = { x: mutation.at.x, y: -mutation.at.y - this._visualConfig.initialSpawnLine };
                this._positionalModel.register(mutation.at, agent);
                agent.spawn(mutation.type, from, mutation.at, this.getDropDelay(from));
            }
        });
    }

    public async dispatch(batch: BoardMutationsBatch): Promise<void> {

        const phases = this.splitPhases(batch);

        this.playShakes(phases.shakes);

        await this.playTransforms(phases.transforms);
        await this.playDestroys(phases.destroys);

        this.playMoves(phases.moves);
        this.playSpawns(phases.spawns);
    }

    private splitPhases(batch: BoardMutationsBatch): VisualPhases {
        const shakes = [];
        const transforms = [];
        const destroys = [];
        const moves = [];
        const spawns = [];

        for (const m of batch.mutations) {
            switch (m.kind) {
                case "tile.shaked": shakes.push(m); break;
                case "tile.transformed": transforms.push(m); break;
                case "tile.destroy": destroys.push(m); break;
                case "tile.moved": moves.push(m); break;
                case "tile.spawned": spawns.push(m); break;
            }
        }

        return { shakes, transforms, destroys, moves, spawns };
    }

    private playShakes(shakes: ShakeMutation[]) {
        for (const mutation of shakes) {
            const agent = this._visualModel.get(mutation.id);
            if (!agent) continue;
            agent.shake();
            break;
        }
    }

    private async playTransforms(transforms: TransformMutation[]): Promise<void> {
        for (const mutation of transforms) {
            mutation.transformed.forEach((transform) => {
                const agent = this._visualModel.get(transform);
                if (!agent) return;
                agent.fly(mutation.center);
            });
            const agent = this._visualModel.get(mutation.id);
            if (!agent) continue;
            agent.highlight(true);
            if (mutation.transformed.length > 0)
                await this._eventBus.waitForRemaining(VisualTileFlown, mutation.transformed.length);

            agent.highlight(false);
            agent.transform(mutation.type);
        }
    }

    private async playDestroys(destroys: DestroyMutation[]): Promise<void> {
        for (const mutation of destroys) {
            switch (mutation.cause) {
                case "bomb":
                case "match":
                case "superbomb": {
                    mutation.destroyed.forEach((tile) => {
                        const agent = this._visualModel.get(tile);
                        if (!agent) return;
                        agent.destroy();
                    });
                    break;
                }

                case "horizontal_rocket":
                case "vertical_rocket":
                    const agent = this._visualModel.get(mutation.id);
                    if (!agent) continue;
                    agent.launch(mutation.cause);
                    await this._eventBus.waitForRemaining(RocketOutOfBounds, 2);
            }
        }
    }

    private playMoves(moves: MoveMutation[]) {
        for (const mutation of moves) {
            const agent = this._visualModel.get(mutation.id);
            if (!agent) continue;
            switch (mutation.cause) {
                case "drop": {
                    agent.drop(mutation.to, this.getDropDelay(mutation.from));
                    this._positionalModel.register(mutation.to, agent);
                    break;
                }

                case "swap": {
                    agent.swap(mutation.to);
                    this._positionalModel.register(mutation.to, agent);
                    break;
                }
            }
        }
    }

    private playSpawns(spawns: SpawnMutation[]) {
        for (const mutation of spawns) {
            const agent = this._visualAgentFactory.create(mutation.id, mutation.type);
            this._visualModel.register(agent);
            this._positionalModel.register(mutation.at, agent);
            this._safeDropMap.add(mutation.at.x, agent.id);
        }

        for (const mutation of spawns) {
            const agent = this._visualModel.get(mutation.id);
            const offset = this._safeDropMap.get(mutation.at.x);
            if (!agent) continue;
            const from = { x: mutation.at.x, y: mutation.at.y - offset - this._visualConfig.normalSpawnLine };
            agent.spawn(mutation.type, from, mutation.at, this.getDropDelay(from));
        }
    }

    private onTileLanded = (event: VisualTileLanded) => {
        this._safeDropMap.subtract(event.id);
        const agent = this._visualModel.get(event.id);
        if (!agent) return;
        this._positionalModel.register(event.position, agent)
    };

    private onTileDestroyed = (event: VisualTileDestroyed) => {
        this._safeDropMap.subtract(event.id);
        const agent = this._visualModel.get(event.id);
        if (!agent) return;
        this._positionalModel.remove(agent.position);
        this._visualModel.remove(agent.id);
        this._tilePool.release(agent.id);
    };

    private onSwapSelected = (event: SwapSelected) => {
        this.highlightTile(event.id, event.state);
    };

    private onRocketCrossed = (event: RocketCrossed) => {
        const agent = this._positionalModel.get(event.position);
        if (!agent) return;
        agent.destroy();
    }

    private highlightTile(id: TileId, state: boolean) {
        const view = this._visualModel.get(id);
        if (view) view.highlight(state);
    }

    private getDropDelay(position: TilePosition) {
        return (this._boardRows - position.y) * this._visualConfig.drop.delay;
    }
}