export class Vertex {
  constructor(
    public readonly id: string,
    public value: number,
    public readonly ins: string[] = [],
    public readonly outs: string[] = []
  ) {}
}

export class Edge {
  constructor(
    public readonly id: string,
    public readonly from: string,
    public readonly to: string,
    public weight: number | null,
    public readonly directed: boolean
  ) {}
}

export type Graph = {
  readonly edges: Record<string, Edge>;
  readonly vertices: Record<string, Vertex>;
};
