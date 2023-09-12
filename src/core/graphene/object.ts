export type Obj =
  | {
      type: "NUMBER";
      value: number;
    }
  | { type: "VERTEX"; value: string }
  | { type: "VERTEX_COLLECTION"; value: string[] };

export function assertVertex(arg: Obj): string {
  if (arg.type !== "VERTEX") {
    throw new Error("Expected vertex.");
  }

  return arg.value;
}

export function assertNumber(arg: Obj): number {
  if (arg.type !== "NUMBER") {
    throw new Error("Expected a number.");
  }

  return arg.value;
}

export function assertVertexCollection(arg: Obj): string[] {
  if (arg.type !== "VERTEX_COLLECTION") {
    throw new Error("Expected a vertex collection.");
  }

  return arg.value;
}
