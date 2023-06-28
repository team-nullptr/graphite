import { Interpreter } from "./interpreter";
import { Obj } from "./object";
import { Token } from "./token";

export type CallableArg = {
  token: Token;
  obj: Obj;
};

export abstract class Callable {
  abstract readonly arity: number;

  abstract call(interpreter: Interpreter, args: CallableArg[]): void;
}
