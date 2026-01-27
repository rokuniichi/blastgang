import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../../domain/models/BoardModel";
import { ClusterDestructionService } from "../../domain/services/ClusterDestructionService";
import { ClusterSearchService } from "../../domain/services/ClusterSearchService";
import { TileClickedEvent } from "../../presentation/events/TileClickedEvent";
import { TilesUpdatedEvent } from "../../presentation/events/TilesUpdatedEvent";
import { SubscriberController } from "./SubscriberController";

export class BoardController extends SubscriberController {
    constructor(
        private readonly _config: GameConfig,
        private readonly _board: BoardModel,
        private readonly _clusterSearchService: ClusterSearchService,
        private readonly _clusterDestructionService: ClusterDestructionService
    ) {
        super();
    }

    protected onInit(): void { }

    protected subscribe(): void {
        this.on(TileClickedEvent, this.onTileClicked)
    }

    private onTileClicked = (event: TileClickedEvent): void => {
        const cluster = this._clusterSearchService.findCluster(this._board, event.position);

        if (!cluster || cluster.size < this._config.minClusterSize) return;

        this._clusterDestructionService.destroy(this._board, cluster);

        this.emit(new TilesUpdatedEvent(cluster.tiles));
    }
}