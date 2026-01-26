import { assertNotNull, assertNumber } from "./assert";

export function ensureNumber(
    value: unknown,
    source: object | Function,
    name: string
): number {
    assertNumber(value, source, name);
    return value;
}

export function ensureNotNull<T>(
    value: T | null | undefined,
    source: object | Function,
    identifier: string
): T {
    assertNotNull(value, source, identifier);
    return value;
}