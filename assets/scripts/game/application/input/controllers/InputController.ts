import { EventBus } from "../../../../core/eventbus/EventBus";
import { TileId } from "../../../domain/board/models/BoardLogicModel";
import { DomainGraph } from "../../../domain/DomainGraph";
import { BoosterType } from "../../../domain/state/models/BoosterType";
import { BoosterClicked } from "../../../presentation/board/events/BoosterClicked";
import { VisualTileClicked } from "../../../presentation/board/events/VisualTileClicked";
import { BoardRuntimeModel } from "../../board/models/BoardRuntimeModel";
import { EventController } from "../../common/controllers/BaseController";
import { BombEmplaceIntent } from "../intents/BombEmplaceIntent";
import { BoosterSelected } from "../intents/BoosterSelected";
import { NormalClickIntent } from "../intents/NormalClickIntent";
import { SwapDeselected } from "../intents/SwapDeselected";
import { SwapIntent } from "../intents/SwapIntent";
import { SwapSelected } from "../intents/SwapSelected";

enum InputMode {
    NORMAL,
    SWAP_FIRST_CHOICE,
    SWAP_SECOND_CHOICE,
    BOMB_PLACEMENT
}

export class InputController extends EventController {
    private readonly _runtimeModel: BoardRuntimeModel;

    private _mode: InputMode = InputMode.NORMAL;
    private _activeBooster: BoosterType = BoosterType.NONE;
    private _firstTile: TileId | null = null;

    constructor(eventBus: EventBus, runtimeModel: BoardRuntimeModel) {
        super(eventBus);
        this._runtimeModel = runtimeModel;
    }

    protected onInit(): void {
        this.on(VisualTileClicked, this.onTileClicked);
        this.on(BoosterClicked, this.onBoosterClicked);
    }

    // -----------------------------
    // Booster click
    // -----------------------------

    private onBoosterClicked = (event: BoosterClicked): void => {
        switch (event.type) {
            case BoosterType.SWAP:
                if (this._mode === InputMode.SWAP_FIRST_CHOICE ||
                    this._mode === InputMode.SWAP_SECOND_CHOICE) {
                    this.resetAll();
                    break;
                }

                this.selectBooster(InputMode.SWAP_FIRST_CHOICE, BoosterType.SWAP);
                break;
            case BoosterType.BOMB:
                if (this._mode === InputMode.BOMB_PLACEMENT) {
                    this.resetAll();
                    break;
                }

                this.selectBooster(InputMode.BOMB_PLACEMENT, BoosterType.BOMB);
                break;
            default:
                this._mode = InputMode.NORMAL;
                break;
        }

        console.log(`[INPUT CONTROL] BOOSTER booster selected: ${BoosterType[this._activeBooster]}`);
    };

    // -----------------------------
    // Tile click
    // -----------------------------

    private onTileClicked = (event: VisualTileClicked): void => {
        if (this._runtimeModel.lockedBoard())
            return

        console.log(`[INPUT CONTROL] visual tile clicked: ${event.id}`);
        switch (this._mode) {
            case InputMode.NORMAL: {
                console.log(`[INPUT CONTROL] NORMAL: ${event.id}`);
                this.emit(new NormalClickIntent(event.id));
                break;
            }

            case InputMode.SWAP_FIRST_CHOICE: {
                console.log(`[INPUT CONTROL] SWAP FIRST: ${event.id}`);
                if (this._runtimeModel.lockedTile(event.id))
                    break;

                this._firstTile = event.id;
                this._mode = InputMode.SWAP_SECOND_CHOICE;
                this.emit(new SwapSelected(event.id));
                break;
            }

            case InputMode.SWAP_SECOND_CHOICE: {
                console.log(`[INPUT CONTROL] SWAP SECOND: ${event.id}`);
                if (this._runtimeModel.lockedTile(event.id))
                    break;

                if (this._firstTile === null) {
                    this.resetAll();
                    break;
                }

                this.emit(new SwapSelected(event.id));
                this.emit(new SwapIntent(this._firstTile, event.id));
                this._firstTile = null;
                this.resetAll();
                break;
            }

            case InputMode.BOMB_PLACEMENT: {
                console.log(`[INPUT CONTROL] BOMB EMPLACE: ${event.id}`);
                if (this._runtimeModel.lockedTile(event.id))
                    break;

                this.emit(new BombEmplaceIntent(event.id));
                this.resetAll();
                break;
            }
        }
    };

    // -----------------------------
    // Cancel selection
    // -----------------------------

    // -----------------------------
    // Helpers
    // -----------------------------

    private selectBooster(mode: InputMode, type: BoosterType) {
        this._mode = mode;
        this._activeBooster = type;
        this.emit(new BoosterSelected(this._activeBooster));
    }

    private resetAll(): void {
        if (this._activeBooster !== BoosterType.NONE)
            this.emit(new BoosterSelected(BoosterType.NONE));

        if (this._firstTile !== null) {
            this.emit(new SwapDeselected(this._firstTile));
            this._firstTile = null;
        }

        this._mode = InputMode.NORMAL;
        this._activeBooster = BoosterType.NONE;
    }
}
