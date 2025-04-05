// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

(window as any).graphToPythonMatrix = () => {
  const graph = (window as any).graph;
  const vertices = Object.values(graph.vertices);
  const edges = Object.values(graph.edges);

  const matrix = Array.from({ length: vertices.length }).map(() =>
    Array.from({ length: vertices.length }).fill(0)
  );

  const idToIndexMap: Record<string, number> = {};

  for (let i = 0; i < vertices.length; i++) {
    idToIndexMap[vertices[i].id] = i;
  }

  for (const edge of edges) {
    matrix[idToIndexMap[edge.from]][idToIndexMap[edge.to]] = 1;
  }

  console.log(JSON.stringify(matrix));
};

(window as any).graphToPythonList = () => {
  const graph = (window as any).graph;
  const vertices = Object.values(graph.vertices);
  const edges = Object.values(graph.edges);

  const list = Array.from({ length: vertices.length }).map(() => []);

  const idToIndexMap: Record<string, number> = {};

  for (let i = 0; i < vertices.length; i++) {
    idToIndexMap[vertices[i].id] = i;
  }

  for (const edge of edges) {
    list[idToIndexMap[edge.from]].push(idToIndexMap[edge.to]);
  }

  console.log(JSON.stringify(list));
};
