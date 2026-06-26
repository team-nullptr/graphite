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
    public name: string | null,
    public readonly directed: boolean
  ) {}

  /**
   * Checks if an edge is defined between provided vertexIds.
   * Order in which vertices are given does not matter.
   */
  between(aId: string, bId: string) {
    return (this.from === aId && this.to === bId) || (this.from === bId && this.to === aId);
  }
}

export type Graph = {
  readonly edges: Record<string, Edge>;
  readonly vertices: Record<string, Vertex>;
};
