import { Interpreter } from "./interpreter";

export abstract class Callable {
  abstract readonly arity: number;

  abstract call(interpreter: Interpreter, args: unknown[]): unknown;
}
