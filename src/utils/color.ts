export function shouldStripColor(
  prc = process,
  explicitSignal: boolean | undefined
) {
  if (typeof explicitSignal !== undefined) return explicitSignal;
  return !!prc.env.NO_COLOR;
}
