import Err from "./with-cause";

export default class UnreachableErorr extends Err {
  constructor(n: never, message: string, cause?: any) {
    super(message, cause);
  }
}
