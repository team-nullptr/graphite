import { ColumnDef } from "@tanstack/react-table";

export type TableState = {
  type: "table";
  columns: ColumnDef<unknown, any>[];
  data: unknown[];
};

export class TableStateBuilder {
  private target: TableState;

  constructor(required: Pick<TableState, "columns">) {
    this.target = {
      type: "table",
      ...required,
      data: [],
    };
  }

  data(data: unknown[]) {
    this.target.data = data;
    return this;
  }

  build() {
    return this.target;
  }
}

export type ArrayState = {
  type: "array";
  title: string;
  data: string[];
  highlighted: Set<number>;
};

export class ArrayStateBuilder {
  private target: ArrayState;

  constructor(required: Pick<ArrayState, "title">) {
    this.target = {
      type: "array",
      ...required,
      data: [],
      highlighted: new Set(),
    };
  }

  data(data: string[]) {
    this.target.data = data;
    return this;
  }

  highlighted(highlighted: Set<number>) {
    this.target.highlighted = highlighted;
    return this;
  }

  build() {
    return this.target;
  }
}

export type State = TableState | ArrayState | undefined;
