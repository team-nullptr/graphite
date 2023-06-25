import { Token } from "./token";

// TODO: It looks like Graph can be our 'environment' so maybe we don't need this.
export class Environment {
  constructor(private readonly values: Map<string, unknown>) {}

  get(name: Token): unknown {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new Error(`Undefined variable '${name.lexeme}'.`);
  }
}
