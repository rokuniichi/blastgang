export function intersection<T>(a: T[], b: T[], c: T[]): T[] {
    const setB = new Set(b);
    const setC = new Set(c);

    return a.filter(x => setB.has(x) && setC.has(x));
};