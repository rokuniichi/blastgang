import { EventBus } from "../../../../core/events/EventBus";
import { BoardRuntimeModel, TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { TileCommit } from "../../../domain/board/models/TileCommit";
import { TileMove } from "../../../domain/board/models/TileMove";
import { TileMutations } from "../../../domain/board/models/TileMutations";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileSpawn } from "../../../domain/board/models/TileSpawn";
import { TileType } from "../../../domain/board/models/TileType";
import { AnimationSystem } from "../../common/animations/AnimationSystem";
import { BoardAnimationHelper } from "../animations/BoardAnimationHelper";
import { BoardAnimationTracker } from "../animations/BoardAnimationTracker";
import { BoardVisualModel } from "./BoardVisualModel";
import { TileView } from "./TileView";

export class BoardVisualOrchestrator {
    private readonly _eventBus: EventBus;
    private readonly _animationSystem: AnimationSystem;

    private readonly _runtimeModel: BoardRuntimeModel;
    private readonly _visualModel: BoardVisualModel;

    private readonly _animationTracker!: BoardAnimationTracker;
    private readonly _animationHelper!: BoardAnimationHelper;

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

        this._animationTracker = new BoardAnimationTracker(this._runtimeModel);
        this._animationHelper = new BoardAnimationHelper(
            this._animationSystem,
            this._animationTracker,
            this._backgroundLayer,
            this._fxLayer,
            this._tilePrefab,
            this._boardWidth,
            this._boardHeight
        );
    }

    public animateShake(data: TilePosition): void {
        this.hide(data);
        const view = this._visualModel.get(data);
        if (!view) return;
        this._animationHelper.shake(view);
        this._animationTracker.enqueue(
            this.get(data),
            async () => this.show(data, view.get()),
            TileLockReason.SHAKE
        )
    }

    public visualize(result: BoardProcessResult): void {
        this.prepare(result);
        this.animate(result.mutations);
        this.push(result.commits);
    }

    private prepare(result: BoardProcessResult): void {
        result.mutations.destroyed.forEach((position) => this.hide(position));
        result.mutations.dropped.forEach((move) => { this.hide(move.from); this.hide(move.to); });
        result.mutations.spawned.forEach((spawn) => this.hide(spawn.at));
    }

    private animate(mutations: TileMutations): void {
        this.animateDestroy(mutations.destroyed);
        this.animateDrop(mutations.dropped);
        this.animateSpawn(mutations.spawned);
    }

    private push(commits: TileCommit[]): void {
        for (const commit of commits) {
            if (commit.after === TileType.EMPTY) {
                this._animationTracker.enqueue(
                    this.get(commit.position),
                    async () => this.hide(commit.position),
                    TileLockReason.NONE
                );
            } else {
                this._animationTracker.enqueue(
                    this.get(commit.position),
                    async () => this.show(commit.position, commit.after),
                    TileLockReason.NONE
                );
            }
        }

        this._animationTracker.onCleanup(() => this.sort());
    }

    private create(position: TilePosition): TileView {
        const node = cc.instantiate(this._tilePrefab);
        node.setParent(this._tileLayer);

        const view = node.getComponent(TileView)!;
        view.init({
            eventBus: this._eventBus,
            position
        });

        return view;
    }

    private get(position: TilePosition): TileView {
        let view = this._visualModel.get(position);
        if (!view) {
            view = this.create(position);
            this._visualModel.set(position, view);
            const local = this._animationHelper.getLocalPosition(position, view.node.width, view.node.height);
            view.node.setPosition(local);
        }
        return view;
    }

    private show(position: TilePosition, type: TileType): void {
        const view = this.get(position);
        view.set(type);
        view.show();
    }

    private hide(position: TilePosition): void {
        const view = this.get(position);
        view.hide();
    }

    private animateDestroy(data: TilePosition[]): void {
        for (const position of data) {
            const view = this.get(position);
            this._animationHelper.destroy(view, position);
        }
    }

    private animateDrop(data: TileMove[]): void {
        for (const move of data) {
            const to = this.get(move.to);
            const from = this.get(move.from);
            this._animationHelper.drop(to, from);
        }
    }

    private animateSpawn(data: TileSpawn[]): void {
        for (const spawn of data) {
            const to = this.get(spawn.at);
            const from = this.get({ x: spawn.at.x, y: to.node.height * 2 })
            this._animationHelper.spawn(to, from, spawn.type);
        }
    }

    private sort(): void {
        const tiles = this._visualModel.views();

        tiles.sort((a, b) => a.position.y - b.position.y)

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].node.setSiblingIndex(i);
        }
    }
}