export function kgToLb(kg: number): number {
  return kg * 2.20462;
}
export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

export function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inch = Math.round(totalInches - ft * 12);
  return { ft, inch };
}
export function ftInToCm(ft: number, inch: number): number {
  return (ft * 12 + inch) * 2.54;
}
