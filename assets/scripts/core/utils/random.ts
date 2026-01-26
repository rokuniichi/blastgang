export class Random {
    public static intRange(minInclusive: number, maxExclusive: number): number {
        return minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive));
    }

    public static floatRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    public static pick<T>(array: readonly T[]): T {
        if (array.length === 0) {
            throw new Error("[Random] Cannot pick from empty array");
        }
        return array[this.intRange(0, array.length)];
    }
}