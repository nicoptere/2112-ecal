export const RAD = Math.PI / 180;

export function lerp(t, a, b) {
  return a * (1 - t) + b * t;
}

export function norm(t, a, b) {
  return (t - a) / (b - a);
}

export function map(t, a0, b0, a1, b1) {
  return lerp(norm(t, a0, b0), a1, b1);
}

export function mix(__a, __b, __x) {
  return lerp(__x, __a, __b);
}

export function smoothstep(__x, __a, __b) {
  return lerp(__x * __x * (3.0 - 2.0 * __x), __a, __b);
}
