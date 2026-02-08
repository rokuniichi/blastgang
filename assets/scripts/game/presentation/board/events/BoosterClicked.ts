import { BoosterType } from "../../../domain/state/models/BoosterType";

export class BoosterClicked {
    constructor(public readonly type: BoosterType) { }
}