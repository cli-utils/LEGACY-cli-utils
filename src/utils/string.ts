/**
 * Create a string, consisting of a repeating sequence N times
 *
 * @param str string to repeat
 * @param len number of times to repeat
 *
 * @internal
 */
export function repeat(str: string, len: number): string {
  if (len <= 0) return "";
  return new Array(len).fill(str).join("");
}
