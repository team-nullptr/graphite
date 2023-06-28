export type Obj =
  | {
      type: "NUMBER";
      value: number;
    }
  | { type: "VERTEX"; value: string }
  | { type: "VOID" };

export type ObjType = Obj["type"];
