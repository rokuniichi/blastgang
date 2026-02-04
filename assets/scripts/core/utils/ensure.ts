import { assert, assertNonEmptyArray, assertNotNull, assertNumber, assertObject } from "./assert";

export function ensureNumber(
    value: unknown,
    source: object | Function,
    identifier: string
): number {
    assertNumber(value, source, identifier);
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

export function ensureObject<T>(
    value: T | null | undefined,
    source: object | Function,
    identifier: string
): T {
    assertObject(value, source, identifier);
    return value;
}

export function ensureNonEmptyArray<T>(
    value: T | null | undefined,
    source: object | Function,
    identifier: string
): Array<T> {
    assertNotNull<T>(value, source, identifier);
    assertNonEmptyArray<T>(value, source, identifier);
    return value;
}

export function ensureEnumValue<T extends object>(
    enumObj: T,
    value: string,
    source: object | Function, 
    identifier: string
): T[keyof T] {
    const enumValue = (enumObj as any)[value];
    assert(enumValue !== undefined, source, `Unknown ${identifier}: "${value}"`);
    return enumValue;
}