export class FxPool {

    private pool: cc.Node[] = [];

    constructor(
        private prefab: cc.Prefab,
        private parent: cc.Node
    ) { }

    get(): cc.Node {
        let node = this.pool.pop();

        if (!node || !cc.isValid(node)) {
            node = cc.instantiate(this.prefab);
        }

        node.setParent(this.parent);
        node.active = true;

        return node;
    }

    release(node: cc.Node) {
        if (!cc.isValid(node)) return;

        node.stopAllActions();
        cc.Tween.stopAllByTarget(node);

        node.active = false;
        node.removeFromParent(false);

        this.pool.push(node);
    }

    clear() {
        for (const node of this.pool) {
            node.destroy();
        }
        this.pool.length = 0;
    }
}