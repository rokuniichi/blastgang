export class AnimationBatch {
    private tasks: Promise<void>[] = [];

    add(task?: Promise<void>) {
        if (task) this.tasks.push(task);
    }

    async run(): Promise<void> {
        await Promise.all(this.tasks);
        this.tasks.length = 0;
    }
}