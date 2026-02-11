import { ThresholdType } from "../../../../config/game/ThresholdType";
import { TileType } from "../../../../domain/board/models/TileType";

export class SpecialResolver {

    public resolve(rule: ThresholdType): TileType {

        switch (rule) {

            case ThresholdType.ROCKET:
                return Math.random() < 0.5
                    ? TileType.HORIZONTAL_ROCKET
                    : TileType.VERTICAL_ROCKET;

            case ThresholdType.BOMB:
                return TileType.BOMB;

            case ThresholdType.SUPER_BOMB:
                return TileType.SUPER_BOMB;
        }
    }
}