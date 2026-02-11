export function assert(
    condition: unknown,
    source: object | Function,
    message: string
): asserts condition {
    let name: string;
    if (typeof source === "function") name = source.name
    else name = source.constructor.name;
    if (!condition) throw new Error(`[${name}] ${message}`);
}

export function assertNotNull<T>(
    value: T | null | undefined,
    source: object | Function,
    identifier: string
): asserts value is T {
    assert(value !== null && value !== undefined, source, `${identifier} must not be null nor undefined`);
}

export function assertArray<T>(
    value: unknown, 
    source: object | Function, 
    identifier: string
): asserts value is T[] {
    assert(Array.isArray(value), source, `${identifier} must be an array`);
}

export function assertArrayNotEmpty<T>(
    value: T[],
    source: object | Function,
    identifier: string
): void {
    assert(value.length > 0, source, `${identifier} must not be empty`);
}

export function assertNonEmptyArray<T>(
    value: unknown,
    source: object | Function,
    identifier: string
): asserts value is T[] {
    assertArray<T>(value, source, identifier);
    assertArrayNotEmpty(value, source, identifier);
}

export function assertString(
    value: unknown,
    source: object | Function,
    identifier: string
): asserts value is string {
    assert(typeof value === "string", source, `${identifier} must be string`);
}

export function assertObject(
    value: unknown,
    source: object | Function,
    identifier: string
): asserts value is Record<string, unknown> {
    assert(typeof value === "object", source, `${identifier} must be object`);
    assertNotNull(value, source, identifier);
}

export function assertNumber(
    value: unknown,
    source: object | Function,
    name: string
): asserts value is number {
    assert(typeof value === "number" && !Number.isNaN(value), source, `${name} must be number`);
}