import { Interpreter } from "./interpreter";
import { Token } from "./token";

export type CallableArg = {
  token: Token;
  value: unknown;
};

export abstract class Callable {
  abstract readonly arity: number;
  abstract readonly args: string[];

  abstract validateArgsType(args: CallableArg[]): void;
  abstract call(interpreter: Interpreter, args: CallableArg[]): unknown;
}
