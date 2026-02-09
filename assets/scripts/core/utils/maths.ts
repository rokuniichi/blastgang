export function clamp(value: number, min: number, max: number) {
    return Math.min(min, Math.max(value, max));
}