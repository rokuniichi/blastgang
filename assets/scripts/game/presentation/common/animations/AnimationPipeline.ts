import { BoardKey } from "../../../application/board/BoardKey";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { ActionStatus, AnimationAction } from "./AnimationAction";
import { AnimationType } from "./AnimationType";

export class AnimationPipeline {
    // Храним активные действия по позициям
    private readonly _actionsByPosition: Map<string, AnimationAction[]>;

    // Все активные действия
    private readonly _allActions: AnimationAction[];

    public constructor() {
        this._actionsByPosition = new Map();
        this._allActions = [];
    }

    // Добавляем действие
    public add(action: AnimationAction): void {
        this._allActions.push(action);

        // Индексируем по позиции "to"
        const key = BoardKey.position(action.data.to);
        const actions = this._actionsByPosition.get(key) || [];
        actions.push(action);
        this._actionsByPosition.set(key, actions);
    }

    // Получаем действия на позиции
    public getAt(position: TilePosition): AnimationAction[] {
        const key = BoardKey.position(position);
        return this._actionsByPosition.get(key) || [];
    }

    // Получаем активные DROP действия, которые летят В указанную позицию
    public getActiveDropsTo(position: TilePosition): AnimationAction[] {
        return this.getAt(position).filter(
            action =>
                action.data.type === AnimationType.DROP &&
                (action.status === ActionStatus.PENDING ||
                    action.status === ActionStatus.RUNNING)
        );
    }

    // Получаем активные DROP действия, которые летят ИЗ указанной позиции
    public getActiveDropsFrom(position: TilePosition): AnimationAction[] {
        const key = BoardKey.position(position);

        return this._allActions.filter(
            action =>
                action.data.type === AnimationType.DROP &&
                BoardKey.position(action.data.from) === key &&
                (action.status === ActionStatus.PENDING ||
                    action.status === ActionStatus.RUNNING)
        );
    }

    // Ждем завершения всех действий на позиции
    public async waitFor(position: TilePosition): Promise<void> {
        const actions = this.getAt(position);
        const pending = actions.filter(
            a => a.status === ActionStatus.PENDING ||
                a.status === ActionStatus.RUNNING
        );

        if (pending.length === 0) return;

        await Promise.all(pending.map(a => a.wait()));
    }

    // Ждем завершения всех действий
    public async waitAll(): Promise<void> {
        await Promise.all(this._allActions.map(a => a.wait()));
    }

    // Очищаем завершенные/отмененные действия
    public cleanup(): void {
        const completed = this._allActions.filter(
            a => a.status === ActionStatus.COMPLETED ||
                a.status === ActionStatus.CANCELLED
        );

        completed.forEach(action => {
            const index = this._allActions.indexOf(action);
            if (index > -1) {
                this._allActions.splice(index, 1);
            }

            const key = BoardKey.position(action.data.to);
            const actions = this._actionsByPosition.get(key);
            if (actions) {
                const actionIndex = actions.indexOf(action);
                if (actionIndex > -1) {
                    actions.splice(actionIndex, 1);
                }
                if (actions.length === 0) {
                    this._actionsByPosition.delete(key);
                }
            }
        });
    }

    // Для отладки
    public debugPrint(): void {
        console.log('=== Animation Pipeline ===');
        console.log(`Total actions: ${this._allActions.length}`);
        this._allActions.forEach(action => {
            console.log(`  ${action.id}: ${action.status}`);
        });
    }
}