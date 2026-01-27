import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../../domain/models/BoardModel";
import { BoardFillService } from "../../domain/services/BoardFillService";
import { ClusterDestructionService } from "../../domain/services/ClusterDestructionService";
import { ClusterSearchService } from "../../domain/services/ClusterSearchService";
import { TileClickedEvent } from "../../presentation/events/TileClickedEvent";
import { TilesUpdatedEvent } from "../../presentation/events/TilesUpdatedEvent";
import { BaseController } from "./BaseController";

export class BoardController extends BaseController {
    constructor(
        private readonly config: GameConfig,
        private readonly board: BoardModel,
        private readonly boardFillService: BoardFillService,
        private readonly clusterSearchService: ClusterSearchService,
        private readonly clusterDestructionService: ClusterDestructionService
    ) {
        super();
    }

    protected onInit(): void {
        this.boardFillService.fillRandom(this.board);        
    }

    protected subscribe(): void {
        this.on(TileClickedEvent, this.onTileClicked)
    }

    private onTileClicked(event: TileClickedEvent): void {
        const cluster = this.clusterSearchService.findCluster(this.board, event.x, event.y);

        if (!cluster || cluster.size < this.config.minClusterSize) return;

        this.clusterDestructionService.destroy(this.board, cluster);

        this.emit(new TilesUpdatedEvent(cluster.tiles));
    }
}