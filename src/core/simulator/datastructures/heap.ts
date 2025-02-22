import { CompareFn } from "./types";

export type ValuesEqFn<T> = (a: T, b: T) => boolean;

export const maxHeapCompareFn: CompareFn<number> = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
export const minHeapCompareFn: CompareFn<number> = (a, b) => (a < b ? 1 : a > b ? -1 : 0);
export const defaultValuesEqFn: ValuesEqFn<unknown> = (a, b) => a === b;

export class Heap<TValue> {
  private _size = 0;

  get size(): number {
    return this._size;
  }

  constructor(
    private values: Array<[value: TValue, key: number]>,
    private readonly compareFn: CompareFn<number> = maxHeapCompareFn,
    private readonly valuesEqFn: ValuesEqFn<TValue> = defaultValuesEqFn
  ) {
    this._size = values.length;
    this.makeHeap();
  }

  top() {
    if (this._size === 0) {
      throw new Error("Heap underflow");
    }

    return this.values[0];
  }

  extractTop() {
    const top = this.top();
    this.values[0] = this.values[this.size - 1];
    this._size -= 1;
    this.heapify(0);
    return top;
  }

  increaseKey(value: TValue, newKey: number) {
    let i = this.values.findIndex(([v]) => this.valuesEqFn(v, value));

    if (i === -1) {
      throw new Error("Value does not exist in the heap");
    }

    if (this.compareFn(this.values[i][1], newKey) > 0) {
      throw new Error("New key can't be smaller than the old key");
    }

    this.values[i][1] = newKey;

    while (i > 0 && this.compareFn(this.values[this.parent(i)][1], this.values[i][1]) < 0) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private makeHeap() {
    for (let i = Math.floor(this._size / 2); i >= 0; i--) {
      this.heapify(i);
    }
  }

  private heapify(i: number) {
    const left = this.left(i);
    const right = this.right(i);
    let largest = i;

    if (left < this._size && this.compareFn(this.values[left][1], this.values[largest][1]) > 0) {
      largest = left;
    }

    if (right < this._size && this.compareFn(this.values[right][1], this.values[largest][1]) > 0) {
      largest = right;
    }

    if (largest != i) {
      this.swap(i, largest);
      this.heapify(largest);
    }
  }

  private swap(a: number, b: number) {
    const tmp = this.values[a];
    this.values[a] = this.values[b];
    this.values[b] = tmp;
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private left(i: number): number {
    return 2 * i + 1;
  }

  private right(i: number): number {
    return 2 * i + 2;
  }
}
