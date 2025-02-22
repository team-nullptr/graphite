import { test, assert } from "vitest";
import { Heap, maxHeapCompareFn, minHeapCompareFn } from "./heap";

test("Creates max heap properly", () => {
  const elements = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1].map((v) => [v, v] as [number, number]);
  const expected = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1].map((v) => [v, v] as [number, number]);

  const heap = new Heap<number>(elements, maxHeapCompareFn);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.deepStrictEqual((heap as any).values, expected);
});

test("Creates min heap properly", () => {
  const elements = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1].map((v) => [v, v] as [number, number]);
  const expected = [1, 2, 3, 8, 4, 9, 10, 14, 16, 7].map((v) => [v, v] as [number, number]);

  const heap = new Heap<number>(elements, minHeapCompareFn);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.deepStrictEqual((heap as any).values, expected);
});

test("Extracts top element from max heap properly", () => {
  const elements = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1].map((v) => [v, v] as [number, number]);

  const heap = new Heap<number>(elements, maxHeapCompareFn);

  const top = heap.extractTop();
  assert.deepStrictEqual(top, [16, 16]);
});

test("Extract top element from min heap properly", () => {
  const elements = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1].map((v) => [v, v] as [number, number]);

  const heap = new Heap<number>(elements, minHeapCompareFn);

  const top = heap.extractTop();
  assert.deepStrictEqual(top, [1, 1]);
});

test("Increase key of an element in max heap properly", () => {
  const elements = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1].map((v) => [v, v] as [number, number]);

  const heap = new Heap<number>(elements, maxHeapCompareFn);

  heap.increaseKey(1, 20);
  const top = heap.extractTop();
  assert.deepStrictEqual(top, [1, 20]);
});
