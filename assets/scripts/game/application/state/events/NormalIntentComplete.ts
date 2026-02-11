import { IEvent } from "../../../../core/eventbus/IEvent";
export class NormalIntentComplete implements IEvent {
    public constructor(public readonly clusterDestroys: number, public readonly collateralDestroys: number) { };
}