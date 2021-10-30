export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return ((rad * 180) / Math.PI) % 360;
}

export function clampDeg(deg: number): number {
  const mod = deg % 360;
  return mod >= 0 ? mod : (mod + 360);
}

export function circularMean(a1: number, a2: number, a3: number): number {
  const radA1 = degToRad(a1);
  const radA2 = degToRad(a2);
  const radA3 = degToRad(a3);
  const rad = Math.atan2(
    Math.sin(radA1) + Math.sin(radA2) + Math.sin(radA3),
    Math.cos(radA1) + Math.cos(radA2) + Math.cos(radA3),
  );

  return clampDeg(radToDeg(rad));
}
