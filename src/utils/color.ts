export function shouldStripColor(prc = process) {
  return !!prc.env.NO_COLOR;
}
