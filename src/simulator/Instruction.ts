export interface Instruction {
  readonly id: string;
  readonly type: "vertex" | "edge";
  select: boolean;
  color?: string;
}
