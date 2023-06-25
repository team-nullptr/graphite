import { Interpreter } from ".";

export interface Callable {
  call(interpreter: Interpreter, args: unknown[]): unknown;
}
