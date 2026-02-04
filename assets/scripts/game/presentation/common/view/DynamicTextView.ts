import { ValueChangedEvent } from "../../../../core/events/ValueChangedEvent";
import { assertNotNull, assertNumber } from "../../../../core/utils/assert";
import { DynamicTextViewContext } from "../context/DynamicTextViewContext";
import { EventView } from "./EventView";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class DynamicTextView<TContext extends DynamicTextViewContext> extends EventView<TContext> {
    @property(cc.Label)
    private targetLabel: cc.Label = null!;

    protected abstract eventType(): new (...args: any[]) => ValueChangedEvent;

    public validate(): void {
        super.validate();
        assertNotNull(this.targetLabel, this, "targetLabel");
    }

    protected preInit(): void {
        super.preInit();
        assertNumber(this.context.initialValue, this, "initialValue");
    }

    protected onInit(): void {
        this.on(this.eventType(), this.onValueChanged);
    }

    protected postInit(): void {
        this.render(this.context.initialValue);
    }

    protected accept(event: ValueChangedEvent): boolean {
        return true;
    }

    private onValueChanged = (event: ValueChangedEvent): void => {
        if (this.accept(event)) this.render(event.value);
    }

    private render(value: number) {
        this.targetLabel!.string = this.format(value);
    }

    protected abstract format(value: number): string;
}