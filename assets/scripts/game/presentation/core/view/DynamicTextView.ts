import { ValueChangedEvent } from "../../../../core/events/ValueChangedEvent";
import { assertNotNull } from "../../../../core/utils/assert";
import { DynamicTextViewContext } from "../context/DynamicTextViewContext";
import { EventView } from "./EventView";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class DynamicTextView<TContext extends DynamicTextViewContext> extends EventView<TContext> {
    @property(cc.Label)
    private targetLabel: cc.Label = null!;

    protected abstract eventType(): new (...args: any[]) => ValueChangedEvent;

    public override validate(): void {
        assertNotNull(this.targetLabel, this, "targetLabel");
    }

    protected override onInit(): void {
        this.render(this.context.initialValue);
    }

    protected override subscribe(): void {
        this.on(this.eventType(), this.onValueChanged);
    }

    private onValueChanged = (event: ValueChangedEvent): void => {
        this.render(event.value);
    }

    private render(value: number) {
        this.targetLabel!.string = this.format(value);
    }

    protected abstract format(value: number): string;
}