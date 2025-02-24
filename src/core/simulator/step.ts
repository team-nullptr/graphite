import { Highlights } from "./highlight";
import { State } from "./state";

export type Labels = Map<string, string>;

export type Step = {
  description: string;
  state: State[];
  labels: Labels;
  verticesHighlights: Highlights;
  edgesHighlights: Highlights;
};

export type StepRequiredOptions = Pick<Step, "description">;

export class StepBuilder {
  private target: Step;

  constructor(required: Pick<Step, "description">) {
    this.target = {
      ...required,
      state: [],
      labels: new Map(),
      verticesHighlights: new Map(),
      edgesHighlights: new Map(),
    };
  }

  state(state: State[]) {
    this.target.state = state;
    return this;
  }

  labels(labels: Labels) {
    this.target.labels = labels;
    return this;
  }

  verticesHighlights(highlights: Highlights) {
    this.target.verticesHighlights = highlights;
    return this;
  }

  edgesHighlights(highlights: Highlights) {
    this.target.edgesHighlights = highlights;
    return this;
  }

  build() {
    return this.target;
  }
}
