export default class Err extends Error {
  constructor(message: string, cause?: any) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
    if (cause) {
      this.stack += `

CAUSED BY:

  ${cause instanceof Error ? cause.stack.replace(/\n/g, "\n  ") : cause}`;
    }
  }
}
