import { BoosterType } from "../../../domain/state/models/BoosterType";
import { DynamicTextViewContext } from "../../common/context/DynamicTextViewContext";

export interface BoosterTextViewContext extends DynamicTextViewContext {
    boosterType: BoosterType;
}