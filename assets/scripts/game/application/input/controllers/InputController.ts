import { EventBus } from "../../../../core/eventbus/EventBus";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { BoosterType } from "../../../domain/state/models/BoosterType";
import { BoosterClicked } from "../../../presentation/board/events/BoosterClicked";
import { VisualTileClicked } from "../../../presentation/board/events/VisualTileClicked";
import { VisualTileSwapped } from "../../../presentation/board/events/VisualTileSwapped";
import { BoardRuntimeModel } from "../../board/models/BoardRuntimeModel";
import { EventController } from "../../common/controllers/BaseController";
import { BombEmplaceIntent } from "../intents/BombEmplaceIntent";
import { BoosterSelected } from "../intents/BoosterSelected";
import { NormalClickIntent } from "../intents/NormalClickIntent";
import { SwapClickIntent } from "../intents/SwapClickIntent";
import { SwapDeselected } from "../intents/SwapDeselected";
import { SwapSelected } from "../intents/SwapSelected";

enum InputMode {
    NORMAL,
    SWAP_FIRST,
    SWAP_SECOND,
    BOMB
}

export class InputController extends EventController {

    private readonly _runtime: BoardRuntimeModel;

    private _mode: InputMode = InputMode.NORMAL;
    private _activeBooster: BoosterType = BoosterType.NONE;
    private _firstTile: TileId | null = null;

    constructor(eventBus: EventBus, runtime: BoardRuntimeModel) {
        super(eventBus);
        this._runtime = runtime;
    }

    protected onInit(): void {
        this.on(VisualTileClicked, this.onTileClicked);
        this.on(BoosterClicked, this.onBoosterClicked);
        this.on(VisualTileSwapped, this.onSwapFinished);
    }

    private onBoosterClicked = (event: BoosterClicked): void => {

        if (this._activeBooster === event.type) {
            this.reset();
            return;
        }

        this.reset();

        switch (event.type) {
            case BoosterType.SWAP:
                this._mode = InputMode.SWAP_FIRST;
                break;

            case BoosterType.BOMB:
                this._mode = InputMode.BOMB;
                break;

            default:
                return;
        }

        this._activeBooster = event.type;
        this.emit(new BoosterSelected(event.type));
    };

    private onTileClicked = (event: VisualTileClicked): void => {

        if (this._runtime.lockedBoard()) return;
        if (this._runtime.lockedTile(event.id)) return;

        this.tileHandlers[this._mode](event.id);
    };

    private readonly tileHandlers: Record<InputMode, (id: TileId) => void> = {
        [InputMode.NORMAL]: (id) => {
            this.emit(new NormalClickIntent(id));
        },

        [InputMode.SWAP_FIRST]: (id) => {
            this._firstTile = id;
            this._mode = InputMode.SWAP_SECOND;
            this.emit(new SwapSelected(id));
        },

        [InputMode.SWAP_SECOND]: (id) => {

            if (!this._firstTile) {
                this.reset();
                return;
            }

            if (id === this._firstTile) {
                this.reset();
                return;
            }

            this.emit(new SwapSelected(id));
            this.emit(new SwapClickIntent(this._firstTile, id));
        },

        [InputMode.BOMB]: (id) => {
            this.emit(new BombEmplaceIntent(id));
            this.reset();
        }
    };

    private onSwapFinished = (_: VisualTileSwapped) => {
        this.reset();
    };

    private reset(): void {
        this.deselectTiles();
        this._mode = InputMode.NORMAL;
        this._activeBooster = BoosterType.NONE;
        this.emit(new BoosterSelected(BoosterType.NONE));
    }

    private deselectTiles(): void {
        if (this._firstTile !== null) {
            this.emit(new SwapDeselected(this._firstTile));
            this._firstTile = null;
        }
    }
}
