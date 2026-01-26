import { assertNumber } from "./assert";

export function ensureNumber(
    value: unknown,
    source: object | Function,
    name: string
): number {
    assertNumber(value, source, name);
    return value;
}