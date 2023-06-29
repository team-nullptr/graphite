import { Interpreter } from "./interpreter";
import { Obj } from "./object";

export abstract class Callable {
  abstract readonly arity: number;

  abstract call(interpreter: Interpreter, args: Obj[]): void;
}
