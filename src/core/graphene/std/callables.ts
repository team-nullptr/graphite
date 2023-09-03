import { Edge, Vertex } from "~/core/simulator/graph";
import { Callable } from "../callable";
import { Interpreter } from "../interpreter";
import { Obj, assertNumber, assertVertex, assertVertexCollection } from "../object";
import { nanoid } from "nanoid";

export class VertexFn extends Callable {
  arity = { min: 1, max: 2 };

  call(interpreter: Interpreter, args: Obj[]): void {
    const value = args[1] ? assertNumber(args[1]) : 1;

    if (args[0].type === "VERTEX") {
      interpreter.addVertex(args[0].value, new Vertex(args[0].value, value));
    } else if (args[0].type === "VERTEX_COLLECTION") {
      for (const vertex of args[0].value) {
        interpreter.addVertex(vertex, new Vertex(vertex, value));
      }
    } else {
      throw new Error("Expected a vertex or a vertex collection.");
    }
  }
}

export class EdgeFn extends Callable {
  arity = { min: 2, max: 3 };

  call(interpreter: Interpreter, args: Obj[]): void {
    const from = assertVertex(args[0]);
    const weight = args[2] ? assertNumber(args[2]) : 1;

    if (args[1].type === "VERTEX") {
      const id = nanoid();
      const to = args[1].value;

      interpreter.addEdge(id, new Edge(id, from, to, weight, false));
      interpreter.getVertex(from).outs.push(id);
      interpreter.getVertex(from).ins.push(id);
      interpreter.getVertex(to).ins.push(id);
      interpreter.getVertex(to).outs.push(id);
    } else if (args[1].type === "VERTEX_COLLECTION") {
      for (const to of args[1].value) {
        const id = nanoid();

        interpreter.addEdge(id, new Edge(id, from, to, weight, false));
        interpreter.getVertex(from).outs.push(id);
        interpreter.getVertex(from).ins.push(id);
        interpreter.getVertex(to).ins.push(id);
        interpreter.getVertex(to).outs.push(id);
      }
    } else {
      throw new Error("Expected a vertex or a vertex collection.");
    }
  }
}

export class ArcFn extends Callable {
  arity = { min: 2, max: 3 };

  call(interpreter: Interpreter, args: Obj[]): void {
    const from = assertVertex(args[0]);
    const weight = args[2] ? assertNumber(args[2]) : 1;

    if (args[1].type === "VERTEX") {
      const id = nanoid();
      const to = args[1].value;

      interpreter.addEdge(id, new Edge(id, from, to, weight, true));
      interpreter.getVertex(from).outs.push(id);
      interpreter.getVertex(to).ins.push(id);
    } else if (args[1].type === "VERTEX_COLLECTION") {
      for (const to of args[1].value) {
        const id = nanoid();

        interpreter.addEdge(id, new Edge(id, from, to, weight, true));
        interpreter.getVertex(from).outs.push(id);
        interpreter.getVertex(to).ins.push(id);
      }
    } else {
      throw new Error("Expected a vertex or a vertex collection.");
    }
  }
}

export class CompleteFn extends Callable {
  arity = { min: 1, max: 1 };

  call(interpreter: Interpreter, args: Obj[]): void {
    const vertices = assertVertexCollection(args[0]);

    for (const vertex of vertices) {
      interpreter.addVertex(vertex, new Vertex(vertex, 0));
    }

    for (const fromVertex of vertices) {
      for (const toVertex of vertices) {
        const duplicate = interpreter.getVertex(toVertex).outs.some((edgeId) => {
          return (
            interpreter.getEdge(edgeId).to === fromVertex ||
            interpreter.getEdge(edgeId).from === fromVertex
          );
        });

        if (fromVertex === toVertex || duplicate) {
          continue;
        }

        const id = nanoid();
        interpreter.addEdge(id, new Edge(id, fromVertex, toVertex, 1, false));
        interpreter.getVertex(fromVertex).outs.push(id);
        interpreter.getVertex(fromVertex).ins.push(id);
        interpreter.getVertex(toVertex).ins.push(id);
        interpreter.getVertex(toVertex).outs.push(id);
      }
    }
  }
}

export class BinaryTreeFn extends Callable {
  arity = { min: 1, max: 1 };

  private buildTree(interpreter: Interpreter, vertices: string[], i: number) {
    let root: Vertex | undefined = undefined;

    if (i < vertices.length) {
      root = interpreter.getVertex(vertices[i]);

      const left = this.buildTree(interpreter, vertices, 2 * i + 1);
      if (left) {
        const id = nanoid();
        interpreter.addEdge(id, new Edge(id, root.id, left.id, 1, false));
        root.outs.push(id);
        left.ins.push(id);
      }

      const right = this.buildTree(interpreter, vertices, 2 * i + 2);
      if (right) {
        const id = nanoid();
        interpreter.addEdge(id, new Edge(id, root.id, right.id, 1, false));
        root.outs.push(id);
        right.ins.push(id);
      }
    }

    return root;
  }

  call(interpreter: Interpreter, args: Obj[]): void {
    const vertices = assertVertexCollection(args[0]);
    this.buildTree(interpreter, vertices, 0);
  }
}
