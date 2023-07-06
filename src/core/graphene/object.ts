export type Obj =
  | {
      type: "NUMBER";
      value: number;
    }
  | { type: "VERTEX"; value: string };

export const assertVertex = (arg: Obj): string => {
  if (arg.type !== "VERTEX") {
    throw new Error("Expected vertex.");
  }

  return arg.value;
};

export const assertNumber = (arg: Obj): number => {
  if (arg.type !== "NUMBER") {
    throw new Error("Expected a number.");
  }

  return arg.value;
};
