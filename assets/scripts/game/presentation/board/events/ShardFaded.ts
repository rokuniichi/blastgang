import { IEvent } from "../../../../core/eventbus/IEvent";

export class ShardFaded implements IEvent {
    public constructor(public readonly node: cc.Node) { }
}