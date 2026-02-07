import { IDisposable } from "../../../../core/lifecycle/IDisposable";
import { BasePool } from "./BasePool";

export class NodePool extends BasePool<cc.Node> implements IDisposable {
    private readonly _prefab: cc.Prefab;
    private readonly _parent: cc.Node;

    public constructor(prefab: cc.Prefab, parent: cc.Node, size: number) {
        super();
        this._prefab = prefab;
        this._parent = parent;

        for (let i = 0; i < size; i++) {
            const node = this.create();
            node.active = false;
            this._pool[i] = node;
        }
    }

    public dispose(): void {
        this._pool.forEach(node => node.destroy());
        this._pool = [];
    }

    public pull(): cc.Node {
        let node = this._pool.pop();
        if (!node || !cc.isValid(node)) node = this.create();
        node.setParent(this._parent);
        return node;
    }

    public release(node: cc.Node): void {
        if (!node) return;
        cc.Tween.stopAllByTarget(node);
        node.active = false;
        node.removeFromParent();
        this._pool.push(node);
    }

    private create(): cc.Node {
        const node = cc.instantiate(this._prefab);

        node.setPosition(0, 0);
        node.setScale(1, 1);
        node.angle = 0;
        node.opacity = 255;
        node.active = false;

        return node;
    }
}